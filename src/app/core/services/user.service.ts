import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, throwError, shareReplay, tap, of } from 'rxjs';
import { User } from '../models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  // --- RxJS Caches ---
  private usersCache$: Observable<User[]> | null = null;
  private userCacheMap = new Map<string, Observable<any>>();

  constructor(private _http:HttpClient){}

  url = environment.apiUrl +'users';

  // يجلب جميع المستخدمين مع حفظ النتيجة في الذاكرة لتسريع التنقل
  getAllUsers(): Observable<User[]> {
    if (!this.usersCache$) {
      this.usersCache$ = this._http.get<User[]>(this.url + '/').pipe(
        shareReplay(1),
        catchError(err => {
          this.usersCache$ = null; // تفريغ الكاش في حالة الخطأ
          return throwError(() => err);
        })
      );
    }
    return this.usersCache$;
  }

  // تنظيف الكاش (تستخدم عند تحديث بيانات المستخدمين لضمان جلب الداتا الجديدة)
  clearCache() {
    this.usersCache$ = null;
    this.userCacheMap.clear();
  }

  editUserStatus(id:string,payload:{userActive?: 'active' | 'notActive'; userPending?: 'pending' | 'accepted';role?: 'admin' | 'user';fristName?: string;}): Observable<User>{
    return this._http.put<{message?:string; data:User}>(`${this.url}/edit/status/${id}`,payload).pipe(
      map(res=>res.data ?? (res as any)),
      tap(() => this.clearCache()), // مجرد ما يعدل، نفضي الكاش عشان الداتا تتحدث المرة الجاية
      catchError(err=>{
        console.error('Failed to update user status',err);
        return throwError(()=>err);
      })
    );
  }
  
  // دالة جلب بيانات المستخدم مع كاشينج مخصص لكل ID (عشان تعرضها أول ما يفتح من غير تأخير)
  getUser(id: string): Observable<any> {
    if (!this.userCacheMap.has(id)) {
      const request$ = this._http.get(`${this.url}/${id}`).pipe(
        shareReplay(1),
        catchError(err => {
          this.userCacheMap.delete(id);
          return throwError(() => err);
        })
      );
      this.userCacheMap.set(id, request$);
    }
    return this.userCacheMap.get(id)!;
  }

  // دالة التعديل (نفس الـ Backend اللي بعته) - وتفرغ الكاش عند نجاح التعديل
  updateUser(id: string, userData: any): Observable<any> {
    return this._http.put(`${this.url}/edit/${id}`, userData).pipe(
      tap(() => this.clearCache())
    );
  }

}
