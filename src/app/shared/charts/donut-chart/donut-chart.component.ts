import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  NgApexchartsModule,
} from "ng-apexcharts";

import {
  CHART_CIRCULAR_PALETTE,
  CHART_DEFAULT_FONT,
} from "../tokens/chart-tokens";

/**
 * `ChartDonut`
 * ------------
 * Donut chart (pie con hueco central) construido sobre `apexcharts`.
 *
 * Capacidades:
 *  - Categorías con labels y colores por sector.
 *  - Radio interno configurable (`innerRadius`, default 65 para donut).
 *  - Total central opcional (`showTotal`) para KPIs.
 *
 * API signal-based.
 */
@Component({
  selector: "ChartDonut",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./donut-chart.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartDonutComponent {
  readonly series = input<number[]>([]);
  readonly labels = input<string[]>([]);
  readonly colors = input<string[]>(CHART_CIRCULAR_PALETTE);
  readonly height = input<number>(280);
  readonly width = input<string | number | undefined>(undefined);
  readonly innerRadius = input<number>(65);
  readonly showLegend = input<boolean>(true);
  readonly showTotal = input<boolean>(false);
  readonly showToolbar = input<boolean>(false);
  readonly className = input<string>("");

  readonly total = computed<number>(() =>
    this.series().reduce((acc, value) => acc + value, 0),
  );

  readonly chartConfig = computed<ApexChart>(() => ({
    type: "donut",
    height: this.height(),
    width: this.width(),
    fontFamily: CHART_DEFAULT_FONT,
    toolbar: { show: this.showToolbar() },
  }));

  readonly plotOptions = computed<ApexPlotOptions>(() => ({
    pie: {
      donut: {
        size: `${this.innerRadius()}%`,
        labels: {
          show: this.showTotal(),
          total: {
            show: true,
            label: "Total",
            color: CHART_DEFAULT_FONT,
            formatter: () => this.total().toString(),
          },
        },
      },
    },
  }));

  readonly dataLabels = computed<ApexDataLabels>(() => ({ enabled: false }));

  readonly stroke = computed<ApexStroke>(() => ({
    width: 2,
    colors: ["#fff"],
  }));

  readonly fill = computed<ApexFill>(() => ({ opacity: 1 }));

  readonly legend = computed<ApexLegend>(() => ({
    show: this.showLegend(),
    position: "bottom",
    fontFamily: CHART_DEFAULT_FONT,
  }));

  readonly wrapperClasses = computed<string>(() =>
    ["max-w-full overflow-x-auto custom-scrollbar", this.className()]
      .filter(Boolean)
      .join(" "),
  );

  readonly chartClasses = computed<string>(() => "min-w-full");
}
