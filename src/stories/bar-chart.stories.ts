import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import type { ApexAxisChartSeries } from "ng-apexcharts";

import { ChartBarComponent } from "@shared/components/charts/bar-chart";
import { CHART_COLORS, CHART_SERIES_PALETTE } from "@shared/components/charts/tokens/chart-tokens";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const salesSeries: ApexAxisChartSeries = [
  { name: "Sales", data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112] },
];

const stackedSeries: ApexAxisChartSeries = [
  { name: "Sales", data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112] },
  { name: "Revenue", data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140] },
];

const meta: Meta<ChartBarComponent> = {
  title: "Shared/BarChart",
  component: ChartBarComponent,
  decorators: [
    moduleMetadata({ imports: [ChartBarComponent] }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    series: { control: "object" },
    categories: { control: "object" },
    colors: { control: "object" },
    height: { control: "number" },
    width: { control: "text" },
    horizontal: { control: "boolean" },
    stacked: { control: "boolean" },
    stackType: {
      control: "select",
      options: ["normal", "100%"],
    },
    columnWidth: { control: "text" },
    borderRadius: { control: "number" },
    showLegend: { control: "boolean" },
    showGrid: { control: "boolean" },
    showToolbar: { control: "boolean" },
    className: { control: "text" },
  },
  args: {
    series: salesSeries,
    categories: months,
    colors: [CHART_COLORS.brand500],
    height: 280,
    horizontal: false,
    stacked: false,
    stackType: "normal",
    columnWidth: "39%",
    borderRadius: 5,
    showLegend: true,
    showGrid: true,
    showToolbar: false,
    className: "",
  },
};

export default meta;

type Story = StoryObj<ChartBarComponent>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    horizontal: true,
    height: 360,
  },
};

export const Stacked: Story = {
  args: {
    series: stackedSeries,
    colors: CHART_SERIES_PALETTE,
    stacked: true,
    height: 320,
  },
};

export const CustomColors: Story = {
  args: {
    series: [
      { name: "Q1", data: [44, 55, 41, 67, 22, 43, 21, 49] },
      { name: "Q2", data: [13, 23, 20, 8, 13, 27, 33, 12] },
      { name: "Q3", data: [11, 17, 15, 15, 21, 14, 15, 13] },
    ],
    categories: ["A", "B", "C", "D", "E", "F", "G", "H"],
    colors: [CHART_COLORS.brand500, CHART_COLORS.brand200, CHART_COLORS.brandTeal],
    height: 320,
  },
};

export const Empty: Story = {
  args: {
    series: [],
    categories: [],
    height: 280,
  },
};
