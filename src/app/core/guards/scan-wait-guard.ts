import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const scanWaitGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const navigation = router.getCurrentNavigation();
  
  if (navigation?.extras?.state?.['authorized']) {
    return true;
  }
  
  return router.parseUrl('/');
};
