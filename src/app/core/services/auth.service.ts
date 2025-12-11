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
  // تأكد أن الرابط الأساسي صحيح
  url = environment.apiUrl + 'users/login'; 

  constructor(private _http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(data: { email: string; password: string }): Observable<Auth> {
    return this._http.post<Auth>(this.url, data).pipe(
      tap((res) => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          this.saveUserData(); // حفظ البيانات عند تسجيل الدخول
        }
      })
    );
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decode = jwtDecode<any>(token);
        return decode.role || null;
      } catch (error) {
        return null;
      }
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

  // 🔥 تعديل هام: الرابط أصبح /signup ليتوافق مع الباك إند الجديد
  signup(data: FormData) {
    return this._http.post(`${environment.apiUrl}users/signup`, data);
  }

  editUser(data: any | User, _id: string): Observable<any> {
    return this._http.put(environment.apiUrl + `users/edit/${_id}`, data);
  }

  // --- دوال الـ OTP الجديدة ---

  verifyAccount(data: { email: string; otp: string }): Observable<any> {
    return this._http.post(`${environment.apiUrl}users/verify`, data);
  }

  resendOtp(email: string): Observable<any> {
    return this._http.post(`${environment.apiUrl}users/resend-otp`, { email });
  }

  // 🔥🔥 هذه هي الدالة الناقصة التي سببت الخطأ 🔥🔥
  saveUserData() {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('User data decoded & saved:', decoded);
        // يمكنك هنا تخزين الاسم أو الدور في متغيرات داخل الخدمة لو احتجت
      } catch (e) {
        console.error('Error decoding token', e);
      }
    }
  }


  // ... داخل كلاس AuthService

forgotPassword(email: string): Observable<any> {
  return this._http.post(`${environment.apiUrl}users/forgot-password`, { email });
}

resetPassword(data: { email: string, otp: string, newPassword: string }): Observable<any> {
  return this._http.post(`${environment.apiUrl}users/reset-password`, data);
}
}