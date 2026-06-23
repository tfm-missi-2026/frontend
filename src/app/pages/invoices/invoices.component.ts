import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/common/page-breadcrumb/page-breadcrumb.component';
import { InvoiceSidebarComponent } from '../../shared/invoice/invoice-sidebar/invoice-sidebar.component';
import { InvoiceMainComponent } from '../../shared/invoice/invoice-main/invoice-main.component';

@Component({
  selector: 'app-invoices',
  imports: [
    PageBreadcrumbComponent,
    InvoiceSidebarComponent,
    InvoiceMainComponent
  ],
  templateUrl: './invoices.component.html',
  styles: ``
})
export class InvoicesComponent {

}
