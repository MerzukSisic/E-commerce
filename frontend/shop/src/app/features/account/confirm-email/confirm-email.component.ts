import {Component, inject} from '@angular/core';
import {AccountService} from '../../../core/services/account.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {SnackbarService} from '../../../core/services/snackbar.service';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-confirm-email',
  imports: [
    MatIcon,
    NgIf,
    MatButton,
    RouterLink
  ],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent {
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(SnackbarService);

  confirming = true;
  success = false;

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!email || !token) {
      this.snack.error('Invalid confirmation link.');
      this.router.navigate(['/account/profile']);
      return;
    }

    this.accountService.confirmEmail({ email, token }).subscribe({
      next: () => {
        this.success = true;
        this.snack.success('Email successfully confirmed!');
        setTimeout(() => this.router.navigate(['/account/profile']), 3000);
      },
      error: (err) => {
        console.error('Email confirmation failed:', err);
        this.snack.error('Email confirmation failed. Please try again.');
        this.success = false;
        this.confirming = false;
      },
    });
  }
}
