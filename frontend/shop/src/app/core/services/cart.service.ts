import {computed, inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Cart, CartItem} from '../../shared/models/cart';
import {Product} from '../../shared/models/product';
import {map} from 'rxjs';
import {DeliveryMethod} from '../../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null); // Signal koji prati stanje korpe.

  // Izračunava ukupan broj stavki u korpi.
  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0); // Zbraja količinu svih stavki.
  });
  selectedDelivery = signal<DeliveryMethod | null>(null);

  // Izračunava ukupan iznos korpe, uključujući subtotal, dostavu i popuste.
  totals = computed(() => {
    const cart = this.cart(); // Dohvaća trenutnu korpu.
    const delivery = this.selectedDelivery();
    if (!cart) return null; // Ako korpa ne postoji, vraća null.
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0); // Izračunava subtotal svih stavki.
    const shipping = delivery ? delivery.price : 0;
    const discount = 0;
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount // Izračunava ukupan iznos korpe.
    }
  });

  // Dohvaća korpu sa servera na osnovu ID-a.
  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart); // Postavlja dobijenu korpu u signal.
        return cart; // Vraća korpu kao rezultat.
      })
    );
  }

  // Ažurira korpu na serveru.
  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: cart => this.cart.set(cart) // Nakon uspješnog ažuriranja, postavlja novu vrijednost korpe u signal.
    });
  }

  // Dodaje stavku u korpu ili ažurira postojeću.
  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart(); // Dohvaća trenutnu korpu ili kreira novu ako ne postoji.
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item); // Ako je stavka proizvod, mapira ga u CartItem.
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity); // Ažurira stavku ili je dodaje u korpu.
    this.setCart(cart); // Ažurira korpu na serveru.
  }

  // Dodaje ili ažurira stavku u listi stavki.
  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(x => x.productId === item.productId); // Pronalazi indeks stavke u listi prema ID-u proizvoda.
    if (index === -1) {
      item.quantity = quantity; // Ako stavka ne postoji, postavlja količinu.
      items.push(item); // Dodaje novu stavku u listu.
    } else {
      items[index].quantity += quantity; // Ako stavka postoji, povećava njenu količinu.
    }
    return items;
  }

  // Mapira proizvod u stavku korpe.
  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    };
  }

  // Provjerava je li stavka tipa Product.
  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined; // Ako stavka ima ID, smatra se proizvodom.
  }

  // Kreira novu korpu.
  private createCart(): Cart {
    const cart = new Cart(); // Kreira novu instancu korpe.
    localStorage.setItem('cart_id', cart.id); // Sprema ID korpe u Local Storage.
    return cart; // Vraća novu korpu.
  }

  removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart(); // Dohvaća trenutnu korpu iz signala.
    if (!cart) return; // Ako korpa ne postoji, prekida funkciju.
    const index = cart.items.findIndex(x => x.productId === productId); // Pronalazi indeks stavke prema `productId`.
    if (index !== -1) { // Ako je stavka pronađena u korpi.
      if (cart.items[index].quantity > quantity) { // Ako je količina stavke veća od količine za uklanjanje.
        cart.items[index].quantity -= quantity; // Smanjuje količinu stavke.
      } else {
        cart.items.splice(index, 1); // Uklanja stavku iz korpe ako je količina manja ili jednaka.
      }
      if (cart.items.length === 0) { // Ako su sve stavke uklonjene iz korpe.
        this.deleteCart(); // Briše korpu sa servera i localStorage-a.
      } else {
        this.setCart(cart); // Ažurira korpu na serveru i signalu.
      }
    }
  }

  // Briše korpu sa servera i iz Local Storage-a.
  private deleteCart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id'); // Briše ID korpe iz Local Storage-a.
        this.cart.set(null); // Postavlja korpu na `null` u signalu.
      }
    });
  }
}
