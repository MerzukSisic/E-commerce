import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {SnackbarService} from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(SnackbarService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 400) {
        snackBar.error(err.error.title || err.error)
      }
      if(err.status === 401) {
        snackBar.error(err.error.title || err.error)
      }
      if(err.status === 404) {
        router.navigateByUrl('/not-found');
      }
      if(err.status === 500) {
        router.navigate(['/server-error']);
      }
      return throwError(() => err);
    })
  )
};
