import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScanReport } from '../models/results.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DowmloadFileService {
  constructor(private _http:HttpClient){}


    private apiUrl = `${environment.apiUrl}download`; 
  
  
    downloadReportFile(reportId: string): Observable<Blob> {
      return this._http.get(`${this.apiUrl}/`, {
        responseType: 'blob'
      });
    }
}
