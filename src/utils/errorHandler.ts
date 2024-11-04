import { ErrorResponse } from '../types';
import { logger } from './logger';

export class PingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details: string,
    public service: string
  ) {
    super(message);
    this.name = 'PingError';
    Object.setPrototypeOf(this, PingError.prototype);
  }
}

export function createErrorResponse(error: unknown, service: string): ErrorResponse {
  logger.error('Error occurred during ping', 'ErrorHandler', { error, service });

  if (error instanceof PingError) {
    return {
      code: error.code,
      details: error.details,
      service: error.service
    };
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return {
        code: 'TIMEOUT',
        details: 'The request timed out',
        service
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      details: error.message || 'An unknown error occurred',
      service
    };
  }

  return {
    code: 'SYSTEM_ERROR',
    details: String(error) || 'An unexpected system error occurred',
    service
  };
}

export function logError(context: string, error: unknown, metadata?: Record<string, unknown>): void {
  logger.error(
    error instanceof Error ? error.message : String(error),
    context,
    {
      ...metadata,
      errorType: error instanceof Error ? error.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined
    }
  );
}