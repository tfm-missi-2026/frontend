import { Component } from '@angular/core';
import { CommonBreadcrumbComponent } from '../../shared/common/page-breadcrumb';
import { InvoiceSidebarComponent } from '../../shared/invoice/invoice-sidebar/invoice-sidebar.component';
import { InvoiceMainComponent } from '../../shared/invoice/invoice-main/invoice-main.component';

@Component({
  selector: 'app-invoices',
  imports: [
    CommonBreadcrumbComponent,
    InvoiceSidebarComponent,
    InvoiceMainComponent
  ],
  templateUrl: './invoices.component.html',
  styles: ``
})
export class InvoicesComponent {

}
