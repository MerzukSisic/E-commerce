import {Component, inject, OnInit} from '@angular/core';
import {OrderService} from '../../../core/services/order.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Order} from '../../../shared/models/order';
import {MatCard} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {AddressPipe} from '../../../shared/pipes/address.pipe';
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-order-detailed',
  imports: [
    MatCard,
    MatButton,
    RouterLink,
    AddressPipe,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss'
})
export class OrderDetailedComponent implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  order?: Order;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(!id) return;
    this.orderService.getOrderDetailed(+id).subscribe({
      next: order => this.order = order,
    })
  }}
