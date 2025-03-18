import {Component, Input, Self} from '@angular/core';
import {NgControl} from '@angular/forms';
import {MatFormField, MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {MatLabel} from '@angular/material/form-field';

@Component({
  selector: 'app-select-input',
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel
  ],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss'
})
export class SelectInputComponent {
  @Input() label = '';
  @Input() options: string[] = [];

  value: string = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  onSelect(event: MatSelectChange) {
    this.value = event.value;
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
