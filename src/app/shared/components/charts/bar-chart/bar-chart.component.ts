import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
} from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from "ng-apexcharts";

import {
  CHART_COLORS,
  CHART_DEFAULT_FONT,
} from "../tokens/chart-tokens";
import type { BarStackType } from "./types";

/**
 * `ChartBar`
 * ---------
 * Bar chart (columnas por defecto, horizontal con `horizontal = true`)
 * construido sobre `apexcharts`.
 *
 * Capacidades:
 *  - Multi-serie con stacking opcional.
 *  - Barras redondeadas en el tope (`borderRadius`).
 *  - Grid, leyenda y toolbar configurables vía flags.
 *  - Reactive: cualquier cambio en los `input()` se refleja en el chart
 *    (ApexCharts v2.4 es signal-input nativo).
 *
 * API signal-based.
 */
@Component({
  selector: "ChartBar",
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: "./bar-chart.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBarComponent implements AfterViewInit {
  readonly series = input<ApexAxisChartSeries>([]);
  readonly categories = input<string[]>([]);
  readonly colors = input<string[]>([CHART_COLORS.brand500]);
  readonly height = input<number>(180);
  readonly width = input<string | number | undefined>(undefined);
  readonly horizontal = input<boolean>(false);
  readonly stacked = input<boolean>(false);
  readonly stackType = input<BarStackType>("normal");
  readonly columnWidth = input<string>("39%");
  readonly borderRadius = input<number>(5);
  readonly showLegend = input<boolean>(true);
  readonly showGrid = input<boolean>(true);
  readonly showToolbar = input<boolean>(false);
  readonly className = input<string>("");

  readonly chartConfig = computed<ApexChart>(() => ({
    type: "bar",
    height: this.height(),
    width: this.width() ?? "100%",
    fontFamily: CHART_DEFAULT_FONT,
    toolbar: { show: this.showToolbar() },
  }));

  readonly plotOptions = computed<ApexPlotOptions>(() => ({
    bar: {
      horizontal: this.horizontal(),
      columnWidth: this.columnWidth(),
      borderRadius: this.borderRadius(),
      borderRadiusApplication: "end",
    },
  }));

  readonly dataLabels = computed<ApexDataLabels>(() => ({ enabled: false }));

  readonly stroke = computed<ApexStroke>(() => ({
    show: true,
    width: 4,
    colors: ["transparent"],
  }));

  readonly xaxis = computed<ApexXAxis>(() => ({
    categories: this.categories(),
    axisBorder: { show: false },
    axisTicks: { show: false },
  }));

  readonly yaxis = computed<ApexYAxis>(() => ({
    title: { text: undefined },
  }));

  readonly legend = computed<ApexLegend>(() => ({
    show: this.showLegend(),
    position: "top",
    horizontalAlign: "left",
    fontFamily: CHART_DEFAULT_FONT,
  }));

  readonly grid = computed<ApexGrid>(() => ({
    yaxis: { lines: { show: this.showGrid() } },
  }));

  readonly fill = computed<ApexFill>(() => ({ opacity: 1 }));

  readonly wrapperClasses = computed<string>(() =>
    ["w-full max-w-full overflow-x-auto custom-scrollbar", this.className()]
      .filter(Boolean)
      .join(" "),
  );

  readonly chartClasses = computed<string>(() => "min-w-full");

  // Re-medir el chart cuando el contenedor cambia de tamaño
  // (iframe de Storybook, sidebar colapsable, tabs, dialogs).
  private readonly host = inject(ElementRef<HTMLElement>);
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => {
        window.dispatchEvent(new Event("resize"));
      });
      this.resizeObserver.observe(this.host.nativeElement);
    }
    setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
  }
}
