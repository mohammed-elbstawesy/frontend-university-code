import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Vulnerability } from '../models/vuln.model';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class VulnService {
  constructor(private _http:HttpClient){}
  url = environment.apiUrl + 'vuln'

  getVuln():Observable<ApiResponse<Vulnerability[]>>{
    return this._http.get<ApiResponse<Vulnerability[]>>(`${this.url}/`);
  }

  getVulnsByIds(ids: string[]): Observable<Vulnerability[]> {
    return this._http.post<Vulnerability[]>(`${this.url}/getByIds`, { ids });
  }
  


}
