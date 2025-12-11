export interface LogEntry {
  _id: string;
  level: string;
  message: string;
  timestamp: string;
  meta?: any; // البيانات الإضافية زي الـ user id
}
export interface LogsResponse {
    status: string;
    results: number;
    totalLogs: number;
    totalPages: number;
    currentPage: number;
    data: LogEntry[];
}