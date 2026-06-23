import { Component } from '@angular/core';
import { EcommerceMetricsComponent } from '../../../shared/ecommerce/ecommerce-metrics/ecommerce-metrics.component';
import { MonthlySalesChartComponent } from '../../../shared/ecommerce/monthly-sales-chart/monthly-sales-chart.component';
import { MonthlyTargetComponent } from '../../../shared/ecommerce/monthly-target/monthly-target.component';
import { StatisticsChartComponent } from '../../../shared/ecommerce/statics-chart/statics-chart.component';
import { DemographicCardComponent } from '../../../shared/ecommerce/demographic-card/demographic-card.component';
import { RecentOrdersComponent } from '../../../shared/ecommerce/recent-orders/recent-orders.component';

@Component({
  selector: 'app-ecommerce',
  imports: [
    EcommerceMetricsComponent,
    MonthlySalesChartComponent,
    MonthlyTargetComponent,
    StatisticsChartComponent,
    DemographicCardComponent,
    RecentOrdersComponent,
  ],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent {}
