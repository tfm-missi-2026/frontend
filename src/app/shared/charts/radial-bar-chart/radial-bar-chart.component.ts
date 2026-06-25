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
 * `ChartRadialBar`
 * ----------------
 * Radial bar chart (medidor de progreso multi-arc), construido sobre
 * `apexcharts`.
 *
 * Útil para dashboards de KPIs: muestra varios indicadores como arcos
 * concéntricos con su porcentaje.
 *
 * Capacidades:
 *  - Ángulos de inicio y fin configurables (`startAngle`, `endAngle`).
 *  - Hueco central ajustable vía `hollowSize`.
 *  - Labels y colores por anillo.
 *
 * API signal-based.
 */
@Component({
  selector: "ChartRadialBar",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./radial-bar-chart.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartRadialBarComponent {
  readonly series = input<number[]>([]);
  readonly labels = input<string[]>([]);
  readonly colors = input<string[]>(CHART_CIRCULAR_PALETTE);
  readonly height = input<number>(280);
  readonly width = input<string | number | undefined>(undefined);
  readonly startAngle = input<number>(-135);
  readonly endAngle = input<number>(225);
  readonly hollowSize = input<string>("40%");
  readonly showLegend = input<boolean>(true);
  readonly showToolbar = input<boolean>(false);
  readonly className = input<string>("");

  readonly chartConfig = computed<ApexChart>(() => ({
    type: "radialBar",
    height: this.height(),
    width: this.width(),
    fontFamily: CHART_DEFAULT_FONT,
    toolbar: { show: this.showToolbar() },
  }));

  readonly plotOptions = computed<ApexPlotOptions>(() => ({
    radialBar: {
      startAngle: this.startAngle(),
      endAngle: this.endAngle(),
      hollow: {
        size: this.hollowSize(),
      },
      track: {
        background: "#E5E7EB",
        strokeWidth: "100%",
      },
      dataLabels: {
        name: {
          fontSize: "14px",
        },
        value: {
          fontSize: "24px",
          formatter: (val: number) => `${Math.round(val)}%`,
        },
        total: {
          show: true,
          label: "Total",
          formatter: () =>
            `${Math.round(
              this.series().reduce((acc, value) => acc + value, 0) /
                Math.max(this.series().length, 1),
            )}%`,
        },
      },
    },
  }));

  readonly dataLabels = computed<ApexDataLabels>(() => ({ enabled: true }));

  readonly stroke = computed<ApexStroke>(() => ({
    lineCap: "round",
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
