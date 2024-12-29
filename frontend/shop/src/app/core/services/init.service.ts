import {inject, Injectable} from '@angular/core';
import {CartService} from './cart.service';
import {coerceArray} from '@angular/cdk/coercion';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private cartService = inject(CartService);

  init(){
    const cardId = localStorage.getItem('cart_id');
    const cart$ = cardId ? this.cartService.getCart(cardId) : of(null);

    return cart$;
  }

}
