import {Component, inject} from '@angular/core';
import {Product} from '../../../shared/models/product';
import {ShopParams} from '../../../shared/models/shopParams';
import {ShopService} from '../../../core/services/shop.service';
import {PageEvent} from '@angular/material/paginator';
import {CustomTableComponent} from '../../../shared/components/custom-table/custom-table.component';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-admin-catalog',
  imports: [
    CustomTableComponent,
    MatButton
  ],
  templateUrl: './admin-catalog.component.html',
  styleUrl: './admin-catalog.component.scss'
})
export class AdminCatalogComponent {
  products: Product[] = [];
  private shopService = inject(ShopService);
  productParams = new ShopParams();
  totalItems = 0;

  columns = [
    {field: 'id', header: 'No.'},
    {field: 'name', header: 'Product name'},
    {field: 'type', header: 'Type'},
    {field: 'brand', header: 'Brand'},
    {field: 'platformType', header: 'Platform'},
    {field: 'quantityInStock', header: 'Quantity'},
    {field: 'price', header: 'Price', pipe: 'currency', pipeArgs: 'USD'}
  ];

  actions = [
    {
      label: 'Edit',
      icon: 'edit',
      tooltip: 'Edit product',
      action: (row: any) => {
        console.log(row)
      }
    },
    {
      label: 'Delete',
      icon: 'delete',
      tooltip: 'Delete product',
      action: (row: any) => {
        console.log(row)
      }
    },
    {
      label: 'Update quantity',
      icon: 'add_circle',
      tooltip: 'Update quantity in stock',
      action: (row: any) => {
        console.log(row)
      }
    },
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.shopService.getProducts(this.productParams).subscribe({
      next: response => {
        if (response.data) {
          this.products = response.data;
          this.totalItems = response.count;
        }
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.productParams.pageNumber = event.pageIndex + 1;
    this.productParams.pageSize = event.pageSize;
    this.loadProducts();
  }




}
