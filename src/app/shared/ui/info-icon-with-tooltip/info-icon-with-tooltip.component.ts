import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { IconCircleInfoLightComponent } from "@shared/icons/circle-info-icon-light";
import { UiTooltipComponent } from "@shared/ui/tooltip/tooltip.component";

// Info icon (i) con tooltip — wrapper sobre UiTooltip + IconCircleInfoLight.
@Component({
  selector: "InfoIconWithTooltip",
  standalone: true,
  imports: [UiTooltipComponent, IconCircleInfoLightComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      "inline-flex cursor-pointer transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
  },
  template: `
    <UiTooltip
      [content]="tooltip()"
      [variant]="variant()"
      [side]="side()"
      [sideOffset]="sideOffset()"
      [align]="align()"
      [delayDuration]="delayDuration()"
      [className]="className()"
    >
      <IconCircleInfoLight
        [size]="size()"
        [color]="color()"
        [dataTestId]="dataTestId()"
      />
    </UiTooltip>
  `,
})
export class UiInfoIconWithTooltipComponent {
  readonly tooltip = input<string>("");
  readonly color = input<string>("currentColor");
  readonly size = input<number | string>(12);
  readonly dataTestId = input<string | undefined>(undefined);
  readonly className = input<string>("");
  readonly variant = input<"light" | "dark">("light");
  readonly side = input<"top" | "right" | "bottom" | "left">("bottom");
  readonly sideOffset = input<number>(8);
  readonly align = input<"start" | "center" | "end">("start");
  readonly delayDuration = input<number>(200);
}
