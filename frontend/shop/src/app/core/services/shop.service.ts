import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Pagination} from '../../shared/models/pagination';
import {Product} from '../../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl='http://localhost:5000/api/'
  private http= inject(HttpClient);
  types: string[] = [];
  brands:string[] = [];

  getProducts()
  {
   return  this.http.get<Pagination<Product>>(this.baseUrl+ 'products?pageSize=20')
  }
  getTypes(){
    if(this.types.length > 0)return;
  return this.http.get<string[]>(this.baseUrl+ 'products/types').subscribe({
    next: response=> this.types = response,
    error: error => console.log(error)
  })
  }
  getBrands() {
    if(this.brands.length > 0)return;
return this.http.get<string[]>(this.baseUrl+'products/brands').subscribe({
    next: response=>this.brands = response,
    error:error=>console.log(error)
  })
  }
}
