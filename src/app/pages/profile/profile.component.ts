import { Component } from '@angular/core';

import { CommonBreadcrumbComponent } from '@shared/common/page-breadcrumb';
import {
  UserProfileMetaCardComponent,
  UserProfileInfoCardComponent,
  UserProfileAddressCardComponent,
} from '@shared/user-profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    UserProfileMetaCardComponent,
    UserProfileInfoCardComponent,
    UserProfileAddressCardComponent,
  ],
  templateUrl: './profile.component.html',
  styles: ``,
})
export class ProfileComponent {}
