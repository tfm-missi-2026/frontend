import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconChevronRightSmallComponent } from '@shared/icons';

@Component({
  selector: 'app-page-breadcrumb',
  imports: [
    RouterModule,
    IconChevronRightSmallComponent,
  ],
  templateUrl: './page-breadcrumb.component.html',
  styles: ``
})
export class PageBreadcrumbComponent {
  @Input() pageTitle = '';
}
