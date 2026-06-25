import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { ChartDonutComponent } from "@shared/charts/donut-chart";
import {
  CHART_CIRCULAR_PALETTE,
  CHART_COLORS,
} from "@shared/charts/tokens/chart-tokens";

const defaultSeries = [44, 55, 41, 17];
const defaultLabels = ["Desktop", "Mobile", "Tablet", "Smart TV"];

const meta: Meta<ChartDonutComponent> = {
  title: "Charts/DonutChart",
  component: ChartDonutComponent,
  decorators: [
    moduleMetadata({ imports: [CommonModule, ChartDonutComponent] }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    series: { control: "object" },
    labels: { control: "object" },
    colors: { control: "object" },
    height: { control: "number" },
    innerRadius: { control: "number", min: 0, max: 100 },
    showLegend: { control: "boolean" },
    showTotal: { control: "boolean" },
    showToolbar: { control: "boolean" },
    className: { control: "text" },
  },
  args: {
    series: defaultSeries,
    labels: defaultLabels,
    colors: CHART_CIRCULAR_PALETTE,
    height: 320,
    innerRadius: 65,
    showLegend: true,
    showTotal: false,
  },
  render: (args) => ({
    props: args,
    template: `<ChartDonut [series]="series" [labels]="labels" [colors]="colors" [height]="height" [innerRadius]="innerRadius" [showLegend]="showLegend" [showTotal]="showTotal" [showToolbar]="showToolbar" [className]="className" />`,
  }),
};

export default meta;

type Story = StoryObj<ChartDonutComponent>;

export const Default: Story = {};

export const WithTotal: Story = {
  args: {
    showTotal: true,
    series: [1860, 7050, 1025, 415],
    labels: ["Q1", "Q2", "Q3", "Q4"],
  },
};

export const ThinDonut: Story = {
  args: {
    innerRadius: 85,
    series: [60, 25, 15],
    labels: ["Completed", "Pending", "Cancelled"],
  },
};

export const CustomColors: Story = {
  args: {
    series: [12, 18, 9, 25, 14],
    labels: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"],
    colors: [
      CHART_COLORS.brand500,
      CHART_COLORS.brand200,
      CHART_COLORS.brandTeal,
      CHART_COLORS.gray400,
      CHART_COLORS.gray500,
    ],
  },
};

export const Empty: Story = {
  args: {
    series: [],
    labels: [],
    height: 280,
  },
};
