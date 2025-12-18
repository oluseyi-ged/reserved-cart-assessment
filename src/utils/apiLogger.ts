export interface ApiLogEntry {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  endpoint: string;
  requestHeaders: Record<string, string>;
  requestBody: any;
  responseStatus: number | null;
  responseHeaders: Record<string, string>;
  responseBody: any;
  duration: number;
  error: string | null;
  curl: string;
}

class ApiLogger {
  private logs: ApiLogEntry[] = [];
  private maxLogs: number = 100;
  private listeners: Set<() => void> = new Set();

  addLog(entry: ApiLogEntry): void {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    this.notifyListeners();
  }

  getLogs(): ApiLogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  generateCurl(entry: Partial<ApiLogEntry>): string {
    const {method, url, requestHeaders, requestBody} = entry;
    let curl = `curl -X ${method} '${url}'`;

    if (requestHeaders) {
      Object.entries(requestHeaders).forEach(([key, value]) => {
        curl += ` \\\n  -H '${key}: ${value}'`;
      });
    }

    if (requestBody && Object.keys(requestBody).length > 0) {
      curl += ` \\\n  -d '${JSON.stringify(requestBody)}'`;
    }

    return curl;
  }

  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const apiLogger = new ApiLogger();
