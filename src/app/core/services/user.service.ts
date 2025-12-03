import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private _http:HttpClient){}

  url = environment.apiUrl +'users';

  getAllUsers():Observable<User[]>{
    return this._http.get<User[]>(this.url + '/')
  }



  editUserStatus(id:string,payload:{userActive?: 'active' | 'notActive'; userPending?: 'pending' | 'accepted';role?: 'admin' | 'user'}): Observable<User>{
    return this._http.put<{message?:string; data:User}>(`${this.url}/edit/status/${id}`,payload).pipe(
      map(res=>res.data ?? (res as any)),
      catchError(err=>{
        console.error('Failed to update user status',err);
        return throwError(()=>err);
      })
    );
  }
  
  

  
  // دالة جلب بيانات المستخدم (عشان تعرضها أول ما يفتح)
  getUser(id: string): Observable<any> {
    return this._http.get(`${this.url}/${id}`);
  }

  // دالة التعديل (نفس الـ Backend اللي بعته)
  updateUser(id: string, userData: any): Observable<any> {
    return this._http.put(`${this.url}/edit/${id}`, userData);
  }
  


}
