import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';
      if (error.status === 0) {
        // Network error or server is completely down
        errorMsg = 'No connection to the server. Please check your internet or try again later.';
        toastService.show(errorMsg, 'error');
      } else {
        // Server returned an error response (4xx, 5xx)
        errorMsg = error.error?.message || `Server Error: ${error.status}`;
        // We only show global toast for 500+ errors to not annoy users for 400 Bad Request validations
        if (error.status >= 500) {
          toastService.show('A server error occurred. Please try again.', 'error');
        }
      }
      return throwError(() => error);
    })
  );
};
