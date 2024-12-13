import {Component, inject} from '@angular/core';
import {ShopService} from '../../../core/services/shop.service';
import {MatDivider} from '@angular/material/divider';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-filters-dialog',
  imports: [
    MatDivider,
    MatSelectionList,
    MatListOption,
    MatButton,
    FormsModule
  ],
  templateUrl: './filters-dialog.component.html',
  standalone: true,
  styleUrl: './filters-dialog.component.scss'
})
export class FiltersDialogComponent {
  shopservice = inject(ShopService);
  private DialogRef = inject(MatDialogRef<FiltersDialogComponent>);
  data = inject(MAT_DIALOG_DATA);


  selectedBrands: string[] = this.data.selectedBrands;
  selectedTypes: string[] = this.data.selectedTypes;

  applyFilters() {

    this.DialogRef.close({
      selectedBrands: this.selectedBrands,
      selectedTypes: this.selectedTypes

    })
  }


}
