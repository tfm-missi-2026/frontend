import { Component } from '@angular/core';
import { UiButtonComponent } from '@shared/ui/button';

@Component({
  selector: 'app-billing-plan',
  imports: [
    UiButtonComponent,
  ],
  templateUrl: './billing-plan.component.html',
  host:{
    class:'rounded-2xl border border-gray-200 bg-white xl:w-4/6 dark:border-gray-800 dark:bg-white/[0.03]'
  }
})
export class BillingPlanComponent {

}
