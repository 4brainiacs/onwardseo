import { ErrorResponse } from '../types';

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
  const timestamp = new Date().toISOString();
  const errorObj = error instanceof Error ? {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(error instanceof PingError && {
      code: error.code,
      details: error.details,
      service: error.service
    })
  } : { message: String(error) };

  console.error(JSON.stringify({
    timestamp,
    context,
    error: errorObj,
    metadata
  }));
}