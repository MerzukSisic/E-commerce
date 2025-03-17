import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pagination} from '../../shared/models/pagination';
import {Product} from '../../shared/models/product';
import {ShopParams} from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'http://localhost:5000/api/'
  private http = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();
    if (shopParams.platform) {
      params = params.append('platform', shopParams.platform);
    }
    if (shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','));
    }
    if (shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','));
    }
    if(shopParams.sort){
      params = params.append('sort', shopParams.sort);
    }
    if(shopParams.search){
      params = params.append('search', shopParams.search);
    }
    if (shopParams.minPrice != null) {
      params = params.append('minPrice', shopParams.minPrice.toString());
    }
    if (shopParams.maxPrice != null) {
      params = params.append('maxPrice', shopParams.maxPrice.toString());
    }

    params = params.append('pageSize', shopParams.pageSize);
    params = params.append('pageIndex', shopParams.pageNumber);
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {params})
  }

  getProduct(id:number) {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  getTypes() {
    if (this.types.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: response => this.types = response,
      error: error => console.log(error)
    })
  }

  getBrands() {
    if (this.brands.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: response => this.brands = response,
      error: error => console.log(error)
    })
  }
}
