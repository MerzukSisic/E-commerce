import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AccountService} from '../services/account.service';
import {SnackbarService} from '../services/snackbar.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const snack = inject(SnackbarService);

  if (accountService.isAdmin())
    return true;
  else {
    snack.error('Noope');
    router.navigateByUrl('/shop');
    return false;
  }
};
