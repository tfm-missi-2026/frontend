import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import type { ApexAxisChartSeries } from "ng-apexcharts";

import { ChartLineComponent } from "@shared/charts/line-chart";
import {
  CHART_COLORS,
  CHART_SERIES_PALETTE,
} from "@shared/charts/tokens/chart-tokens";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const twoSeries: ApexAxisChartSeries = [
  {
    name: "Sales",
    data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
  },
  {
    name: "Revenue",
    data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
  },
];

const singleSeries: ApexAxisChartSeries = [
  { name: "Sessions", data: [30, 40, 35, 50, 49, 60, 70, 91, 125] },
];

const meta: Meta<ChartLineComponent> = {
  title: "Charts/LineChart",
  component: ChartLineComponent,
  decorators: [moduleMetadata({ imports: [ChartLineComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    series: { control: "object" },
    categories: { control: "object" },
    colors: { control: "object" },
    height: { control: "number" },
    width: { control: "text" },
    strokeWidth: { control: "number" },
    strokeCurve: {
      control: "select",
      options: ["straight", "smooth", "stepline"],
    },
    markerSize: { control: "number" },
    showLegend: { control: "boolean" },
    showGrid: { control: "boolean" },
    showToolbar: { control: "boolean" },
    className: { control: "text" },
  },
  args: {
    series: twoSeries,
    categories: months,
    colors: CHART_SERIES_PALETTE,
    height: 320,
    width: undefined,
    strokeWidth: 2,
    strokeCurve: "straight",
    markerSize: 0,
    showLegend: true,
    showGrid: true,
    showToolbar: false,
    className: "",
  },
};

export default meta;

type Story = StoryObj<ChartLineComponent>;

export const Default: Story = {};

export const SingleSeries: Story = {
  args: {
    series: singleSeries,
    colors: [CHART_COLORS.brand500],
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"],
    height: 280,
  },
};

export const SmoothCurve: Story = {
  args: {
    strokeCurve: "smooth",
  },
};

export const WithMarkers: Story = {
  args: {
    markerSize: 4,
  },
};

export const Stepline: Story = {
  args: {
    strokeCurve: "stepline",
    markerSize: 4,
  },
};

export const Empty: Story = {
  args: {
    series: [],
    categories: [],
    height: 280,
  },
};
