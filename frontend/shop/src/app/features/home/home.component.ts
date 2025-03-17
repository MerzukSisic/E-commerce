import {Component, inject, OnInit} from '@angular/core';
import { NgStyle, NgForOf, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {ShopService} from '../../core/services/shop.service';
import {ShopParams} from '../../shared/models/shopParams';
import {Product} from '../../shared/models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    NgStyle,
    RouterLink,
    NgForOf,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private shopService = inject(ShopService);
  productParams = new ShopParams();
  lowStockProducts: Product[] = [];


  images = [
    'https://i.imgur.com/OzqPnfj.jpeg',
    'https://i.imgur.com/3i5AfVd.jpeg',
    'https://hips.hearstapps.com/hmg-prod/images/gh-index-gamingconsoles-052-print-preview-1659705142.jpg?crop=1.00xw:0.753xh;0,0.0831xh&resize=1200:*',
    'https://i.imgur.com/ORjlf0d.jpeg',
  ];

  currentIndex = 0;

  categories = [
    { name: 'PC', icon: 'computer' },
    { name: 'PlayStation', icon: 'sports_esports' },
    { name: 'Xbox', icon: 'videogame_asset' },
    { name: 'Nintendo', icon: 'gamepad' },
    { name: 'Mobile', icon: 'smartphone' }
  ];

  getLowStockProducts() {
    this.productParams.pageSize = 50; // Osigurava da imamo dovoljno proizvoda za filtraciju
    this.productParams.sort = 'quantityInStock'; // Ako API podržava sortiranje, koristi ga

    this.shopService.getProducts(this.productParams)
      .subscribe({
        next: response => {
          console.log('Low Stock Products:', response);
          this.lowStockProducts = response.data
            .filter(product => product.quantityInStock <= 25) // Filtrira proizvode sa malim zalihama
            .slice(0, 4); // Prikazuje samo 4 proizvoda sa najmanjim stanjem
        },
        error: error => console.log('Error fetching low stock products:', error)
      });
  }


  latestNews = [
    { id: 1, title: 'New PlayStation 5 Update Released!', date: new Date(), summary: 'Sony has just released a major update for PlayStation 5 with exciting new features.' },
    { id: 2, title: 'Xbox Series X Price Drop Announced', date: new Date(), summary: 'Microsoft confirms a significant price drop for the Xbox Series X, making it more accessible to gamers.' },
    { id: 3, title: 'PC Gaming Trends for 2025', date: new Date(), summary: 'Here are the top trends shaping the future of PC gaming in the upcoming year.' }
  ];

  ngOnInit() {
    this.getLowStockProducts();
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 5000); // Menja sliku svakih 5 sekundi
  }

  getBackgroundStyle() {
    return {
 'background-image': `url("${this.images[this.currentIndex]}")`,
      'background-size': 'cover',
      'background-position': 'center',
      'transition': 'background-image 1s ease-in-out'
    };
  }
}




