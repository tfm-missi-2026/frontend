import { Component } from '@angular/core';
import {
  IconCardComponent,
  IconEnvelopeStrokeComponent,
  IconShoppingCartComponent,
} from '@shared/icons';

@Component({
  selector: 'app-order-history',
  imports: [
    IconShoppingCartComponent,
    IconCardComponent,
    IconEnvelopeStrokeComponent,
  ],
  templateUrl: './order-history.component.html',
  styles: ``
})
export class OrderHistoryComponent {

}
