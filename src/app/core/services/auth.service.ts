import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Auth, User } from '../models/users.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url =environment.apiUrl + 'users/login'
  constructor(private _http:HttpClient){}
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
 




  login(data: { email: string; password: string }): Observable<Auth> {
    return this._http.post<Auth>(this.url, data).pipe(
      tap((res) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }
  
  



  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decode = jwtDecode<any>(token);
      return decode.role || null;
    } else {
      return null;
    }
  }


  isLogin(): boolean {
    return !!this.getToken();
  }


  logout(): void {
    localStorage.removeItem('token');
  }
  


  signup(data: FormData) {
    return this._http.post(`${environment.apiUrl}users/user`, data);
  }
  



  editUser(data : any| User,_id:string):Observable<any>{
    // /users/:id
    return this._http.put(environment.apiUrl+`users/users/`+_id,data)
  }



  
}