import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service'; // تأكد من صحة المسار

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // 1. حقن السيرفس عشان نقدر نعمل Logout
  const token = authService.getToken();

  let newReq = req;

  if (token) {
    newReq = req.clone({
      setHeaders: {
        //  تنبيه هام: تأكد أن الباك إند عندك يتوقع 'token' أم 'Authorization'
        // في الأغلب في مشروعنا كنا نستخدم 'token' في الهيدر، لو كان الباك إند يستخدم Bearer، غير السطر ده
        token: `${token}` 
        // أو لو كان القديم شغال معاك سيبه كده:
        // Authorization: `Bearer ${token}`
      },
    });
  }

  return next(newReq).pipe(
    // 2. مراقبة الأخطاء القادمة من الباك إند
    catchError((err: HttpErrorResponse) => {
      
      //  3. الشرط السحري: لو الخطأ 401 (التوكن منتهي أو غير صالح)
      if (err.status === 401) {
        console.warn('Session expired (401). Logging out automatically...');
        authService.logout(); // طرد المستخدم لصفحة اللوجين ومسح التوكن
      }
      
      return throwError(() => err);
    })
  );
};