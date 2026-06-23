import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import type { ApexAxisChartSeries } from "ng-apexcharts";

import { ChartAreaComponent } from "@shared/charts/area-chart";
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

const defaultSeries: ApexAxisChartSeries = [
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
  {
    name: "Sessions",
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 150, 130, 140],
  },
];

const meta: Meta<ChartAreaComponent> = {
  title: "Charts/AreaChart",
  component: ChartAreaComponent,
  decorators: [moduleMetadata({ imports: [ChartAreaComponent] })],
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
    gradientOpacityFrom: { control: "number", min: 0, max: 1, step: 0.05 },
    gradientOpacityTo: { control: "number", min: 0, max: 1, step: 0.05 },
    showLegend: { control: "boolean" },
    showGrid: { control: "boolean" },
    showToolbar: { control: "boolean" },
    className: { control: "text" },
  },
  args: {
    series: defaultSeries,
    categories: months,
    colors: CHART_SERIES_PALETTE,
    height: 320,
    width: undefined,
    strokeWidth: 2,
    strokeCurve: "straight",
    markerSize: 0,
    gradientOpacityFrom: 0.55,
    gradientOpacityTo: 0,
    showLegend: true,
    showGrid: true,
    showToolbar: false,
    className: "",
  },
};

export default meta;

type Story = StoryObj<ChartAreaComponent>;

export const Default: Story = {};

export const SingleSeries: Story = {
  args: {
    series: singleSeries,
    colors: [CHART_COLORS.brand500],
    height: 280,
  },
};

export const CustomGradient: Story = {
  args: {
    gradientOpacityFrom: 0.8,
    gradientOpacityTo: 0.1,
  },
};

export const Smooth: Story = {
  args: {
    strokeCurve: "smooth",
  },
};

export const Empty: Story = {
  args: {
    series: [],
    categories: [],
    height: 280,
  },
};
