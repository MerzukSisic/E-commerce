import {Component, inject, OnInit} from '@angular/core';
import {OrderSummaryComponent} from '../../shared/components/order-summary/order-summary.component';
import {MatStepperModule} from '@angular/material/stepper';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {StripeService} from '../../core/services/stripe.service';
import {StripeAddressElement, StripePaymentElement} from '@stripe/stripe-js';
import {SnackbarService} from '../../core/services/snackbar.service';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {Address} from '../../shared/models/user';
import {firstValueFrom} from 'rxjs';
import {AccountService} from '../../core/services/account.service';
import {CheckoutDeliveryComponent} from './checkout-delivery/checkout-delivery.component';
import {CheckoutReviewComponent} from './checkout-review/checkout-review.component';
import {CartService} from '../../core/services/cart.service';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    RouterLink,
    MatButton,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CurrencyPipe
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private stripeService = inject(StripeService);
  private snackBar = inject(SnackbarService);
  private accountService = inject(AccountService);
  cartService = inject(CartService);
  addressElement?: StripeAddressElement;
//  paymentElement?: StripePaymentElement;
  saveAddress = false;

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.CreateAddressElement();
      this.addressElement.mount('#address-element');

//      this.paymentElement = await this.stripeService.createPaymentElement();
//      this.paymentElement.mount('#payment-element');
    } catch (error: any) {
      this.snackBar.error(error.message);
    }
  }

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress();
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
  }

  private async getAddressFromStripeAddress(): Promise<Address | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if (address) {
      return {
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postal_code,
      }
    } else return null;

  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }


}
