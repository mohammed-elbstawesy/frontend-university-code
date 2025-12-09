import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();

  

  // if (role === 'user') {
  //   return true;
  // }
  // else if (role === 'admin') {
  //   auth.logout();
  //   // return true;
  // return router.createUrlTree(['/login']);

  // }
  
  // return router.createUrlTree(['/login']);


  if (auth.isLogin()) {
    const role = auth.getRole();
    if (role === 'user') {
      return true;
    } else if (role === 'admin') {
      // لو أدمن وحاول يدخل صفحة يوزر، نخرجه (حسب اللوجيك بتاعك)
      auth.logout();
      return router.createUrlTree(['/login/signin']);
    }
  }
  
  // 🔥 التعديل هنا:
  // لو مش مسجل، وديه اللوجن وخد معاك الرابط اللي كان عايز يروحه
  return router.createUrlTree(['/login/signin'], { 
    queryParams: { returnUrl: state.url } 
  });
};