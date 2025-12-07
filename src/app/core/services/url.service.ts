import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Url } from '../models/url.model';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(private _http: HttpClient){}
  url = environment.apiUrl + 'urls/'

  getUrls(): Observable<Url[]> {
    return this._http.get<Url[]>(`${this.url}url`);
  }
  
  addUrl(urlData: { originalUrl: string, report?: string }): Observable<Url> {
    return this._http.post<Url>(`${this.url}url`, urlData);
  }
  
  getUrlById(id:string):Observable<Url[]>{
    return this._http.get<Url[]>(`${this.url}url/${id}`);
  }

  getUrlByUserId(userId:string):Observable<Url[]>{
    return this._http.get<Url[]>(`${this.url}user/urls/${userId}`);
  }
  





//   url :Url[]= [];
// constructor(private _urlService:UrlService){}

// ngOnInit() {

//   this._urlService.getUrls().subscribe({
//     next: (response) => {
//       this.url = response;
//       console.log("URLs:", this.url);
//     },
//     error: (error) => {
//       console.error('Error fetching URLs:', error);
//     }
//   });
// }




}
