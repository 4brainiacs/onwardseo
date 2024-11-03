export interface PingResult {
  url: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  timestamp: number;
}

export interface PingService {
  name: string;
  url: string;
}

export type PingResults = Record<string, PingResult[]>;