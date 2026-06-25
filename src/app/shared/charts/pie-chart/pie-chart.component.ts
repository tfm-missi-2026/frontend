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
  ApexStroke,
  NgApexchartsModule,
} from "ng-apexcharts";

import {
  CHART_CIRCULAR_PALETTE,
  CHART_DEFAULT_FONT,
} from "../tokens/chart-tokens";

/**
 * `ChartPie`
 * ----------
 * Pie chart sin hueco central, construido sobre `apexcharts`.
 *
 * A diferencia del `ChartDonut`, no tiene radio interno. Útil para
 * distribuciones donde se quiere ver el círculo completo.
 *
 * API signal-based.
 */
@Component({
  selector: "ChartPie",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./pie-chart.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPieComponent {
  readonly series = input<number[]>([]);
  readonly labels = input<string[]>([]);
  readonly colors = input<string[]>(CHART_CIRCULAR_PALETTE);
  readonly height = input<number>(280);
  readonly width = input<string | number | undefined>(undefined);
  readonly showLegend = input<boolean>(true);
  readonly dataLabelsEnabled = input<boolean>(false);
  readonly showToolbar = input<boolean>(false);
  readonly className = input<string>("");

  readonly chartConfig = computed<ApexChart>(() => ({
    type: "pie",
    height: this.height(),
    width: this.width(),
    fontFamily: CHART_DEFAULT_FONT,
    toolbar: { show: this.showToolbar() },
  }));

  readonly dataLabels = computed<ApexDataLabels>(() => ({
    enabled: this.dataLabelsEnabled(),
  }));

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
