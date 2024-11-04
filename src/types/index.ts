export type PingStatus = 'pending' | 'success' | 'error';

export interface PingService {
  name: string;
  url: string;
}

export interface ErrorResponse {
  code: string;
  details: string;
  service: string;
}

export interface PingResponse {
  success: boolean;
  message: string;
  error?: ErrorResponse;
}

export interface PingResult {
  status: PingStatus;
  timestamp: number;
  url: string;
  message?: string;
  error?: ErrorResponse;
}

export interface PingResults {
  [url: string]: PingResult[];
}

export interface ProgressInfo {
  total: number;
  completed: number;
  currentUrl: string;
  currentService: string;
  errors: number;
  successes: number;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  version: string;
  context?: string;
  metadata?: Record<string, unknown>;
}