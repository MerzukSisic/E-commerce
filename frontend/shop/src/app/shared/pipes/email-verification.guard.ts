import {CanActivateFn, Router} from '@angular/router';
import {AccountService} from '../../core/services/account.service';
import {inject} from '@angular/core';
import {SnackbarService} from '../../core/services/snackbar.service';
import {map} from 'rxjs';

export const emailVerificationGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const  snack = inject(SnackbarService);

  return accountService.getAuthState().pipe(
    map(auth => {
      if (auth.isAuthenticated) {
        if (!auth.emailConfirmed) {
          snack.error("Please verify your email address");
          router.navigate(['/account/profile']);
          return false;
        }
        return true;
      }
      return false;
    })
  );
};
