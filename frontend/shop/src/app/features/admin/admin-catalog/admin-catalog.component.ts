import {Component, inject, OnInit} from '@angular/core';
import {Product} from '../../../shared/models/product';
import {ShopParams} from '../../../shared/models/shopParams';
import {ShopService} from '../../../core/services/shop.service';
import {PageEvent} from '@angular/material/paginator';
import {CustomTableComponent} from '../../../shared/components/custom-table/custom-table.component';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {ProductFormComponent} from '../product-form/product-form.component';

@Component({
  selector: 'app-admin-catalog',
  imports: [
    CustomTableComponent,
    MatButton
  ],
  templateUrl: './admin-catalog.component.html',
  styleUrl: './admin-catalog.component.scss'
})
export class AdminCatalogComponent implements OnInit {
  products: Product[] = [];
  private shopService = inject(ShopService);
  private dialog = inject(MatDialog);
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

  openCreateDialog() {
    const dialog = this.dialog.open(ProductFormComponent, {
      minWidth: '500px',
      data: {
        title: 'Create product'
      }
    });
    dialog.afterClosed().subscribe({
      next: async result => {
        if (result) {
          console.log(result)
        }
      }
    })
  }


}
