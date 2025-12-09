
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const notloginGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // التأكد من حالة تسجيل الدخول
  const isLogged: boolean = auth.isLogin();

  if (isLogged) {
    // لو المستخدم مسجل دخوله بالفعل وحاول يدخل صفحة اللوجين
    // نرجعه للصفحة الرئيسية (Home)
    return router.createUrlTree(['']);
  } else {
    // لو المستخدم مش مسجل دخوله
    // نسمح له يدخل الصفحة عادي (يفتح صفحة اللوجين)
    return true;
  }
};
