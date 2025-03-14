import {Component, computed, inject, OnInit} from '@angular/core';
import {AccountService} from '../../../core/services/account.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DashboardService} from '../../../core/services/dashboard.service';
import {UserDashboard} from '../../../shared/models/Dashboard';
import {SnackbarService} from '../../../core/services/snackbar.service';
import {MatIcon} from '@angular/material/icon';
import {AddressPipe} from '../../../shared/pipes/address.pipe';
import {CurrencyPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-profile',
  imports: [
    MatIcon,
    AddressPipe,
    CurrencyPipe,
    MatButton
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private accountService = inject(AccountService);
  private dashboardService = inject(DashboardService);
  private snack = inject(SnackbarService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  loading = true;
  dashboardData?: UserDashboard;
  currentUser = computed(() => this.accountService.currentUser());
  mostBoughtPlatform: string = '';


  ngOnInit(): void {
    this.accountService.getUserInfo().subscribe({
      next: (user) => {
        console.log("Dobijeni korisnik:", user);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
    this.dashboardService.getUserDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.mostBoughtPlatform = this.getMostBoughtPlatform(data);
      },
      error: (err) => {
        this.snack.error("Pogrešno učitvanje podataka!");
      },
    });
  }


  getMostBoughtPlatform(data: UserDashboard): string {
    if (!data.platformSales || data.platformSales.length === 0) return 'N/A';
    return data.platformSales.reduce((prev, current) =>
      prev.salesCount > current.salesCount ? prev : current).platform;
  }


}
