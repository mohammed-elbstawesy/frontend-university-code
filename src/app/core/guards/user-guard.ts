import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();

  

  if (role === 'user') {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};