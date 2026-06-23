import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { ChartPieComponent } from "@shared/charts/pie-chart";
import {
  CHART_CIRCULAR_PALETTE,
  CHART_COLORS,
} from "@shared/charts/tokens/chart-tokens";

const defaultSeries = [44, 55, 41, 17];
const defaultLabels = ["Direct", "Referral", "Organic", "Social"];

const meta: Meta<ChartPieComponent> = {
  title: "Charts/PieChart",
  component: ChartPieComponent,
  decorators: [moduleMetadata({ imports: [CommonModule, ChartPieComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    series: { control: "object" },
    labels: { control: "object" },
    colors: { control: "object" },
    height: { control: "number" },
    showLegend: { control: "boolean" },
    dataLabelsEnabled: { control: "boolean" },
    showToolbar: { control: "boolean" },
    className: { control: "text" },
  },
  args: {
    series: defaultSeries,
    labels: defaultLabels,
    colors: CHART_CIRCULAR_PALETTE,
    height: 320,
    showLegend: true,
    dataLabelsEnabled: false,
  },
  render: (args) => ({
    props: args,
    template: `<ChartPie [series]="series" [labels]="labels" [colors]="colors" [height]="height" [showLegend]="showLegend" [dataLabelsEnabled]="dataLabelsEnabled" [showToolbar]="showToolbar" [className]="className" />`,
  }),
};

export default meta;

type Story = StoryObj<ChartPieComponent>;

export const Default: Story = {};

export const WithDataLabels: Story = {
  args: {
    dataLabelsEnabled: true,
  },
};

export const FiveCategories: Story = {
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

export const HideLegend: Story = {
  args: {
    showLegend: false,
    dataLabelsEnabled: true,
  },
};

export const Empty: Story = {
  args: {
    series: [],
    labels: [],
    height: 280,
  },
};
