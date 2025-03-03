import {inject, Injectable} from '@angular/core';
import {CartService} from './cart.service';
import {catchError, forkJoin, of, tap} from 'rxjs';
import { AccountService } from './account.service';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private cartService = inject(CartService);
  private accountService=inject(AccountService);
  private signalrService=inject(SignalrService);

  init() {
    const cardId = localStorage.getItem('cart_id');
    const cart$ = cardId ? this.cartService.getCart(cardId) : of(null);
    const user$ = this.accountService.getUserInfo().pipe(
      catchError(err => {
        console.error('Error fetching user info:', err);
        return of(null); // Vrati null ako dođe do greške
      })
    );
  
    return forkJoin({
      cart: cart$,
      user: this.accountService.getUserInfo().pipe(
        tap(user=>{
          if(user) this.signalrService.createHubConnection();
        })
      )
    });
  }
  



}
