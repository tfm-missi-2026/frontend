import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { ChartRadialBarComponent } from "@shared/components/charts/radial-bar-chart";
import { CHART_CIRCULAR_PALETTE } from "@shared/components/charts/tokens/chart-tokens";

const defaultSeries = [76, 67, 61, 90];
const defaultLabels = ["Sales", "Marketing", "Support", "Engineering"];

const meta: Meta<ChartRadialBarComponent> = {
  title: "Shared/RadialBarChart",
  component: ChartRadialBarComponent,
  decorators: [
    moduleMetadata({ imports: [CommonModule, ChartRadialBarComponent] }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    series: { control: "object" },
    labels: { control: "object" },
    colors: { control: "object" },
    height: { control: "number" },
    startAngle: { control: "number" },
    endAngle: { control: "number" },
    hollowSize: { control: "text" },
    showLegend: { control: "boolean" },
    showToolbar: { control: "boolean" },
    className: { control: "text" },
  },
  args: {
    series: defaultSeries,
    labels: defaultLabels,
    colors: CHART_CIRCULAR_PALETTE,
    height: 360,
    startAngle: -135,
    endAngle: 225,
    hollowSize: "40%",
    showLegend: true,
  },
  render: (args) => ({
    props: args,
    template: `<ChartRadialBar [series]="series" [labels]="labels" [colors]="colors" [height]="height" [startAngle]="startAngle" [endAngle]="endAngle" [hollowSize]="hollowSize" [showLegend]="showLegend" [showToolbar]="showToolbar" [className]="className" />`,
  }),
};

export default meta;

type Story = StoryObj<ChartRadialBarComponent>;

export const Default: Story = {};

export const ThreeMetrics: Story = {
  args: {
    series: [82, 55, 47],
    labels: ["Conversion", "Retention", "Engagement"],
  },
};

export const FullCircle: Story = {
  args: {
    startAngle: 0,
    endAngle: 360,
    series: [65, 80, 72, 91, 58],
    labels: ["Q1", "Q2", "Q3", "Q4", "Q5"],
  },
};

export const HalfCircle: Story = {
  args: {
    startAngle: -90,
    endAngle: 90,
    series: [78],
    labels: ["Progress"],
    showLegend: false,
    hollowSize: "60%",
  },
};

export const Empty: Story = {
  args: {
    series: [],
    labels: [],
    height: 280,
  },
};
