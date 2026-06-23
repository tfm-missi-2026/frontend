import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from "ng-apexcharts";

import {
  CHART_COLORS,
  CHART_DEFAULT_FONT,
  CHART_SERIES_PALETTE,
} from "../tokens/chart-tokens";
import type { AreaStrokeCurve } from "./types";

/**
 * `ChartArea`
 * -----------
 * Line chart con relleno degradado (`type: "area"`).
 *
 * Sucesor del `LineChartOneComponent` legacy (que internamente ya era area).
 *
 * Capacidades:
 *  - Multi-serie con relleno degradado configurable.
 *  - Curva `straight`, `smooth` o `stepline`.
 *  - Opacidades `gradientOpacityFrom` / `gradientOpacityTo` configurables.
 *
 * API signal-based.
 */
@Component({
  selector: "ChartArea",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./area-chart.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartAreaComponent {
  readonly series = input<ApexAxisChartSeries>([]);
  readonly categories = input<string[]>([]);
  readonly colors = input<string[]>(CHART_SERIES_PALETTE);
  readonly height = input<number>(310);
  readonly width = input<string | number | undefined>(undefined);
  readonly strokeWidth = input<number | number[]>(2);
  readonly strokeCurve = input<AreaStrokeCurve>("straight");
  readonly markerSize = input<number>(0);
  readonly gradientOpacityFrom = input<number>(0.55);
  readonly gradientOpacityTo = input<number>(0);
  readonly showLegend = input<boolean>(true);
  readonly showGrid = input<boolean>(true);
  readonly showToolbar = input<boolean>(false);
  readonly className = input<string>("");

  readonly chartConfig = computed<ApexChart>(() => ({
    type: "area",
    height: this.height(),
    width: this.width(),
    fontFamily: CHART_DEFAULT_FONT,
    toolbar: { show: this.showToolbar() },
  }));

  readonly stroke = computed<ApexStroke>(() => ({
    curve: this.strokeCurve(),
    width: this.strokeWidth(),
  }));

  readonly markers = computed<ApexMarkers>(() => ({
    size: this.markerSize(),
    strokeColors: "#fff",
    strokeWidth: 2,
    hover: { size: Math.max(6, this.markerSize()) },
  }));

  readonly dataLabels = computed<ApexDataLabels>(() => ({ enabled: false }));

  readonly tooltip = computed<ApexTooltip>(() => ({
    enabled: true,
    x: { format: "dd MMM yyyy" },
  }));

  readonly fill = computed<ApexFill>(() => ({
    type: "gradient",
    gradient: {
      opacityFrom: this.gradientOpacityFrom(),
      opacityTo: this.gradientOpacityTo(),
    },
  }));

  readonly xaxis = computed<ApexXAxis>(() => ({
    type: "category",
    categories: this.categories(),
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  }));

  readonly yaxis = computed<ApexYAxis>(() => ({
    labels: {
      style: {
        fontSize: "12px",
        colors: [CHART_COLORS.gray500],
      },
    },
    title: {
      text: "",
      style: { fontSize: "0px" },
    },
  }));

  readonly legend = computed<ApexLegend>(() => ({
    show: this.showLegend(),
    position: "top",
    horizontalAlign: "left",
    fontFamily: CHART_DEFAULT_FONT,
  }));

  readonly grid = computed<ApexGrid>(() => ({
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: this.showGrid() } },
  }));

  readonly wrapperClasses = computed<string>(() =>
    ["max-w-full overflow-x-auto custom-scrollbar", this.className()]
      .filter(Boolean)
      .join(" "),
  );

  readonly chartClasses = computed<string>(() => "min-w-full");
}
