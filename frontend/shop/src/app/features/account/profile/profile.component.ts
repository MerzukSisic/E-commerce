import {Component, computed, inject, OnInit} from '@angular/core';
import {AccountService} from '../../../core/services/account.service';
import {Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DashboardService} from '../../../core/services/dashboard.service';
import {UserDashboard} from '../../../shared/models/Dashboard';
import {SnackbarService} from '../../../core/services/snackbar.service';
import {MatIcon} from '@angular/material/icon';
import {AddressPipe} from '../../../shared/pipes/address.pipe';
import {CurrencyPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Chart, ChartOptions, registerables} from 'chart.js';

@Component({
  selector: 'app-profile',
  imports: [
    MatIcon,
    AddressPipe,
    CurrencyPipe,
    MatButton,
    RouterLink
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
  chart?: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.accountService.getUserInfo().subscribe({
      next: (user) => {
        console.log("User data received:", user);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.snack.error("Error loading user data!");
      },
    });
    this.dashboardService.getUserDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.mostBoughtPlatform = this.getMostBoughtPlatform(data);
        if (this.dashboardData?.platformSales.length > 0) {
          setTimeout(() => this.createChart(), 500);
        }
      },
      error: (err) => {
        console.error("Dashboard loading error:", err);
        this.snack.error("Failed to load dashboard data!");      },
    });
  }


  getMostBoughtPlatform(data: UserDashboard): string {
    if (!data.platformSales || data.platformSales.length === 0) {
      this.snack.error("No data available for most purchased platform.");
      return 'N/A';
    }
    return data.platformSales.reduce((prev, current) =>
      prev.salesCount > current.salesCount ? prev : current).platform;
  }

  createChart(): void {
    console.log("Creating chart...");

    if (!this.dashboardData?.platformSales || this.dashboardData.platformSales.length === 0) {
      console.warn("No data available for chart!");
      this.snack.error("No sales data available to generate a chart.");
      return;
    }

    const salesChartElement = document.querySelector('#platformSalesChart') as HTMLCanvasElement | null;
    if (!salesChartElement) {
      console.warn("Canvas element 'platformSalesChart' not found. Retrying...");
      setTimeout(() => this.createChart(), 500);
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(salesChartElement, {
      type: 'bar',
      data: {
        labels: this.dashboardData.platformSales.map((p) => p.platform),
        datasets: [
          {
            label: 'Number of games purchased',
            data: this.dashboardData.platformSales.map((p) => p.salesCount),
            backgroundColor: 'rgba(126, 34, 206, 0.5)',
            borderColor: 'rgba(126, 34, 206, 1)',
            borderWidth: 1,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
              callback: function (value) {
                return Number(value).toFixed(0);
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      } as ChartOptions,
    });

    console.log("Chart created!");
    this.snack.success("Chart successfully generated!");
  }
}
