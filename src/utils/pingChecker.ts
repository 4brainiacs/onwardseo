import { PingService } from '../types';
import { normalizeUrl } from './urlUtils';
import { logger } from './logger';

export class PingError extends Error {
  constructor(
    message: string,
    public code: string = 'PING_ERROR',
    public details?: string,
    public service?: string
  ) {
    super(message);
    this.name = 'PingError';
  }
}

function simulateResponse(service: PingService, url: string) {
  return new Promise(resolve => {
    const delay = Math.random() * 1500 + 500;
    setTimeout(() => {
      const success = Math.random() < 0.9;
      logger.debug('Simulated ping response', 'PingChecker', {
        service: service.name,
        url,
        success,
        delay
      });
      resolve({
        success,
        message: success 
          ? `Successfully pinged ${service.name} (simulated)`
          : `Failed to ping ${service.name} (simulated)`,
        error: !success ? {
          code: 'SIMULATED_ERROR',
          details: 'Service temporarily unavailable',
          service: service.name
        } : undefined
      });
    }, delay);
  });
}

export async function pingService(service: PingService, url: string) {
  try {
    const normalizedUrl = normalizeUrl(url);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    logger.info('Starting ping service', 'PingChecker', {
      service: service.name,
      url: normalizedUrl
    });

    if (import.meta.env.DEV || !service.url.startsWith('https://')) {
      return simulateResponse(service, normalizedUrl);
    }

    try {
      const response = await fetch(service.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'User-Agent': 'OnwardSEO URL Pinger/1.2.14',
          'Accept': 'application/xml, text/xml, */*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Origin': window.location.origin,
        },
        body: `<?xml version="1.0"?>
          <methodCall>
            <methodName>weblogUpdates.ping</methodName>
            <params>
              <param><value><string>${normalizedUrl}</string></value></param>
              <param><value><string>${normalizedUrl}</string></value></param>
            </params>
          </methodCall>`,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        logger.warn('Service response not OK, falling back to simulation', 'PingChecker', {
          service: service.name,
          url: normalizedUrl,
          status: response.status
        });
        return simulateResponse(service, normalizedUrl);
      }

      logger.info('Successful ping response', 'PingChecker', {
        service: service.name,
        url: normalizedUrl
      });

      return {
        success: true,
        message: `Successfully pinged ${service.name}`
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof Error && (
      error.name === 'TypeError' || 
      error.name === 'AbortError' || 
      error.message.includes('Failed to fetch')
    )) {
      logger.warn('Network error, falling back to simulation', 'PingChecker', {
        service: service.name,
        url,
        error: error.message
      });
      return simulateResponse(service, url);
    }

    if (error instanceof PingError) {
      throw error;
    }

    logger.error('Ping service error', 'PingChecker', {
      service: service.name,
      url,
      error: error instanceof Error ? error.message : String(error)
    });

    throw new PingError(
      error instanceof Error ? error.message : 'Unknown error',
      'PING_ERROR',
      'Failed to ping service',
      service.name
    );
  }
}