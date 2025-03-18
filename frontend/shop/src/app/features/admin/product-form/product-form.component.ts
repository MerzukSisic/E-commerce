import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Product} from '../../../shared/models/product';
import {TextInputComponent} from '../../../shared/components/text-input/text-input.component';
import {MatButton} from '@angular/material/button';
import {TextAreaComponent} from '../../../shared/components/text-area/text-area.component';
import {ShopService} from '../../../core/services/shop.service';
import {SelectInputComponent} from '../../../shared/components/select-input/select-input.component';

@Component({
  selector: 'app-product-form',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    TextInputComponent,
    MatButton,
    MatDialogClose,
    TextAreaComponent,
    SelectInputComponent
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  shopService = inject(ShopService);
  productForm!: FormGroup;
  data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProductFormComponent>);


  ngOnInit() {
    this.initializeForm();
    setTimeout(()=>{
      this.loadBrandsAndTypesAndPlatforms();
    })
  }

  initializeForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      pictureUrl: ['', [Validators.required]],
      type: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      platformType: ['', [Validators.required]],
      quantityInStock: [0, [Validators.required, Validators.min(0)]]
    })
  }

  onSubmit() {
    if (this.productForm.invalid) {
      let product: Product = this.productForm.value;
      this.dialogRef.close({product});
    }
  }

  loadBrandsAndTypesAndPlatforms() {
    this.shopService.getTypes();
    this.shopService.getBrands();
    this.shopService.getPlatforms();
  }
}
