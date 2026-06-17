
import { Component } from '@angular/core';
import { InvoiceTableComponent } from '../invoice-table/invoice-table.component';
import { UiButtonComponent } from '@shared/ui/button';

@Component({
  selector: 'app-invoice-main',
  imports: [
    InvoiceTableComponent,
    UiButtonComponent,
  ],
  templateUrl: './invoice-main.component.html',
  styles: ``
})
export class InvoiceMainComponent {

}
