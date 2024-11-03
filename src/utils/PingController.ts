import { PING_SERVICES } from '../services/pingServices';
import { PingResults, ProgressInfo } from '../types';
import { pingService } from './pingChecker';
import { logError } from './errorHandler';

export class PingController {
  private isPaused: boolean = false;
  private isStopped: boolean = false;
  private isRunning: boolean = false;
  private pausePromise: Promise<void> | null = null;
  private pauseResolve: (() => void) | null = null;
  private currentRetries: Map<string, number> = new Map();
  private readonly MAX_RETRIES = 2;
  private readonly RETRY_DELAY = 1000;
  private readonly PING_DELAY = 500;
  private abortController: AbortController | null = null;
  private activeRequests: Set<Promise<any>> = new Set();

  constructor(
    private onProgress: (info: ProgressInfo) => void,
    private onResults: (results: PingResults) => void,
    private onError?: (error: Error) => void
  ) {}

  private async waitForActiveRequests(): Promise<void> {
    if (this.activeRequests.size > 0) {
      await Promise.allSettled(Array.from(this.activeRequests));
      this.activeRequests.clear();
    }
  }

  private handleError(error: unknown, context: string, metadata?: Record<string, unknown>) {
    const formattedError = error instanceof Error ? error : new Error(String(error));
    logError(context, formattedError, metadata);
    this.onError?.(formattedError);
  }

  private async safeExecute<T>(
    operation: () => Promise<T>,
    context: string,
    metadata?: Record<string, unknown>
  ): Promise<T | null> {
    try {
      const promise = operation();
      this.activeRequests.add(promise);
      const result = await promise;
      this.activeRequests.delete(promise);
      return result;
    } catch (error) {
      this.handleError(error, context, metadata);
      return null;
    }
  }

  pause(): void {
    if (!this.isPaused && this.isRunning) {
      this.isPaused = true;
      this.pausePromise = new Promise(resolve => {
        this.pauseResolve = resolve;
      });
    }
  }

  resume(): void {
    if (this.isPaused && this.pauseResolve) {
      this.isPaused = false;
      this.pauseResolve();
      this.pausePromise = null;
      this.pauseResolve = null;
    }
  }

  async stop(): Promise<void> {
    this.isStopped = true;
    this.isRunning = false;
    if (this.abortController) {
      this.abortController.abort();
    }
    if (this.isPaused) {
      this.resume();
    }
    await this.waitForActiveRequests();
  }

  reset(): void {
    this.isPaused = false;
    this.isStopped = false;
    this.isRunning = false;
    this.pausePromise = null;
    this.pauseResolve = null;
    this.currentRetries.clear();
    this.activeRequests.clear();
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  private async waitIfPaused(): Promise<void> {
    if (this.isPaused && this.pausePromise) {
      await this.pausePromise;
    }
  }

  private async retryPing(service: typeof PING_SERVICES[0], url: string): Promise<ReturnType<typeof pingService>> {
    const retryCount = this.currentRetries.get(`${url}-${service.name}`) || 0;
    
    if (retryCount >= this.MAX_RETRIES) {
      const error = new Error(`Max retries (${this.MAX_RETRIES}) exceeded for ${service.name}`);
      this.handleError(error, 'PingController.retryPing', { service: service.name, url, retryCount });
      throw error;
    }

    this.currentRetries.set(`${url}-${service.name}`, retryCount + 1);
    await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
    
    return this.safeExecute(
      () => pingService(service, url),
      'PingController.retryPing',
      { service: service.name, url, retryCount: retryCount + 1 }
    ) as Promise<ReturnType<typeof pingService>>;
  }

  async start(urls: string[]): Promise<void> {
    if (this.isRunning) {
      throw new Error('Ping process is already running');
    }

    try {
      this.reset();
      this.isRunning = true;
      this.abortController = new AbortController();
      
      const results: PingResults = {};
      urls.forEach(url => {
        results[url] = PING_SERVICES.map(() => ({
          status: 'pending',
          timestamp: Date.now(),
          url
        }));
      });

      let completed = 0;
      const total = urls.length * PING_SERVICES.length;
      let successes = 0;
      let errors = 0;

      this.onResults(results);
      this.onProgress({
        total,
        completed,
        currentUrl: urls[0],
        currentService: PING_SERVICES[0].name,
        errors,
        successes
      });

      for (const url of urls) {
        if (this.isStopped) break;

        for (const [index, service] of PING_SERVICES.entries()) {
          if (this.isStopped) break;

          await this.waitIfPaused();
          if (this.isStopped) break;

          this.onProgress({
            total,
            completed,
            currentUrl: url,
            currentService: service.name,
            errors,
            successes
          });

          const response = await this.safeExecute(
            () => pingService(service, url),
            'PingController.start.ping',
            { service: service.name, url }
          );

          if (!this.isStopped) {
            if (response === null || !response.success) {
              try {
                const retryResponse = await this.retryPing(service, url);
                if (retryResponse && retryResponse.success) {
                  results[url][index] = {
                    status: 'success',
                    timestamp: Date.now(),
                    url,
                    message: retryResponse.message
                  };
                  successes++;
                } else {
                  results[url][index] = {
                    status: 'error',
                    timestamp: Date.now(),
                    url,
                    message: retryResponse?.message || 'Retry failed',
                    error: retryResponse?.error
                  };
                  errors++;
                }
              } catch (retryError) {
                results[url][index] = {
                  status: 'error',
                  timestamp: Date.now(),
                  url,
                  message: retryError instanceof Error ? retryError.message : 'Retry failed'
                };
                errors++;
              }
            } else {
              results[url][index] = {
                status: 'success',
                timestamp: Date.now(),
                url,
                message: response.message
              };
              successes++;
            }

            completed++;
            this.onResults({ ...results });
            this.onProgress({
              total,
              completed,
              currentUrl: url,
              currentService: service.name,
              errors,
              successes
            });

            if (!this.isStopped && index < PING_SERVICES.length - 1) {
              await new Promise(resolve => setTimeout(resolve, this.PING_DELAY));
            }
          }
        }
      }
    } catch (error) {
      this.handleError(error, 'PingController.start', { urls });
      throw error;
    } finally {
      this.isRunning = false;
      this.abortController = null;
      await this.waitForActiveRequests();
    }
  }
}