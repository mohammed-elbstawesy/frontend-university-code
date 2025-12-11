import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {LogEntry,LogsResponse} from '../models/log.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = `${environment.apiUrl}logs`; 

  constructor(private http: HttpClient) {}

  // الدالة المعدلة
  getLogs(page: number, limit: number, search: string, level: string): Observable<LogsResponse> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString());
    
    if (search) params = params.set('search', search);
    if (level && level !== 'all') params = params.set('level', level);

    return this.http.get<LogsResponse>(this.apiUrl, { params });
  }
}

