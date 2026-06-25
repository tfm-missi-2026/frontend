import { Component } from '@angular/core';
import {
  IconCheckSmallComponent,
  IconMastercardComponent,
  IconPaypalComponent,
  IconPlusSimpleComponent,
  IconVisaComponent,
} from '@shared/icons';

@Component({
  selector: 'app-payment-method',
  imports: [
    IconCheckSmallComponent,
    IconMastercardComponent,
    IconPaypalComponent,
    IconPlusSimpleComponent,
    IconVisaComponent,
  ],
  templateUrl: './payment-method.component.html',
  styles: ``
})
export class PaymentMethodComponent {

}
