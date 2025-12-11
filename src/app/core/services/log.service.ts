import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface LogEntry {
  _id: string;
  level: string;
  message: string;
  timestamp: string;
  meta?: any; // البيانات الإضافية زي الـ user id
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = `${environment.apiUrl}logs`; 

  constructor(private http: HttpClient) {}

  getLogs(): Observable<{ status: string, results: number, data: LogEntry[] }> {
    return this.http.get<{ status: string, results: number, data: LogEntry[] }>(this.apiUrl);
  }
}
