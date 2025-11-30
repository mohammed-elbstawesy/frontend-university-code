import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();

  if (role === 'admin') {
    return true;
  }
  else if (role === 'user') {
    auth.logout();
    // return true;
  return router.createUrlTree(['/login']);

  }
  return router.createUrlTree(['/login']);
};
