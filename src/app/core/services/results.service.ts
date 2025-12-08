import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { results } from '../models/results.model';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {



  constructor(private _http:HttpClient){}
  url = environment.apiUrl + 'results'

  getResultsByIdUrl(_id:string | number):Observable<results[]>{
  // return this._http.get<results[]>(this.url+`/`+_id)
  return this._http.get<{ message: string; data: results[] }>(`${this.url}/url/${_id}`)
  .pipe(
    map(resp => resp.data || []) // نرجّع المصفوفة فقط
  );
  }

    getResult(): Observable<results[]> {
      return this._http.get<results[]>(`${this.url}`);
    }


  // .get<{ message: string; data: Results[] }>(`${this.url}/${id}`)
  // .pipe(
  //   map(resp => resp.data || []) // نرجّع المصفوفة فقط
  // );
    // return this._http.put(environment.apiUrl+`users/users/`+_id,data)

    // getResultsById(id: string | number): Observable<Results[]> {
    //   const endpoint = `${this.url}/${id}`;
    //   return this.http.get<Results[]>(endpoint).pipe(
    //     catchError(err => {
    //       // logging أو تحويل الخطأ هنا
    //       console.error('getResultsById error', err);
    //       return throwError(() => err);
    //     })
    //   );
    // }

}
