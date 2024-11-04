export const APP_VERSION = '1.2.21';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  version: string;
  context?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;
  private isDebugEnabled: boolean;

  private constructor() {
    this.isDebugEnabled = import.meta.env.DEV || window.location.search.includes('debug=true');
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(level: LogLevel, message: string, context?: string, metadata?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      version: APP_VERSION,
      context,
      metadata
    };
  }

  private output(entry: LogEntry): void {
    if (entry.level === 'debug' && !this.isDebugEnabled) return;

    const logFn = entry.level === 'error' ? console.error :
                 entry.level === 'warn' ? console.warn :
                 entry.level === 'debug' ? console.debug :
                 console.log;

    logFn(JSON.stringify(entry, null, 2));
  }

  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.output(this.formatLog('info', message, context, metadata));
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.output(this.formatLog('warn', message, context, metadata));
  }

  error(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.output(this.formatLog('error', message, context, metadata));
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.output(this.formatLog('debug', message, context, metadata));
  }
}

export const logger = Logger.getInstance();