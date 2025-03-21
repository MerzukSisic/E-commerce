import {Component, inject, OnInit} from '@angular/core';
import {OrderService} from '../../../core/services/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../../../shared/models/order';
import {MatCard} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {AddressPipe} from '../../../shared/pipes/address.pipe';
import { PaymentPipe } from '../../../shared/pipes/payment.pipe';
import {CurrencyPipe, DatePipe} from '@angular/common';
import { AccountService } from '../../../core/services/account.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-order-detailed',
  imports: [
    MatCard,
    MatButton,
    AddressPipe,
    CurrencyPipe,
    DatePipe,
    PaymentPipe
  ],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss'
})
export class OrderDetailedComponent implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  private accountService=inject(AccountService);
  private adminService=inject(AdminService);
  private router=inject(Router);

  order?: Order;
  buttonText=this.accountService.isAdmin() ? 'Return to admin' : 'Return to orders'

  ngOnInit() {
    this.loadOrders();
  }


  onReturnClick()
  {
    this.accountService.isAdmin() ?
    this.router.navigateByUrl('/admin')
    : this.router.navigateByUrl('/orders');
  }

  loadOrders() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id) return;

    const loadOrderData=this.accountService.isAdmin()?
    this.adminService.getOrder(+id)
    : this.orderService.getOrderDetailed(+id);

   loadOrderData.subscribe({
      next: order => this.order = order,
    })
  }}
