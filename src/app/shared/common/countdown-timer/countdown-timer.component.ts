import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { interval } from "rxjs";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;
const MS_PER_SECOND = 1000;

export interface CommonCountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

const ZERO_TIME: CommonCountdownTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  expired: false,
};

function computeTimeLeft(target: Date): CommonCountdownTime {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { ...ZERO_TIME, expired: true };
  }
  return {
    days: Math.floor(diff / MS_PER_DAY),
    hours: Math.floor((diff / MS_PER_HOUR) % 24),
    minutes: Math.floor((diff / MS_PER_MINUTE) % 60),
    seconds: Math.floor((diff / MS_PER_SECOND) % 60),
    expired: false,
  };
}

/**
 * `CommonCountdown`
 * -----------------
 * Cuenta regresiva reactiva hacia una fecha objetivo. Ticking cada
 * segundo, mantiene un signal interno con días / horas / minutos /
 * segundos y flag `expired`. El intervalo se libera automáticamente
 * en `destroy`.
 *
 * Renderiza su propio layout (tarjeta con bloques días / horas /
 * min / seg); el consumidor solo tiene que pasar la fecha objetivo.
 *
 * ```html
 * <CommonCountdown [targetDate]="deadline" />
 * ```
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "CommonCountdown",
  standalone: true,
  imports: [UiFlexComponent, UiLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiFlex
      [noWrap]="true"
      alignItems="center"
      [gap]="3"
      className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <UiFlex direction="column" alignItems="center" [gap]="0">
        <UiLabel type="HeadingL" color="textStrong" className="font-semibold">
          {{ timeLeft().days }}
        </UiLabel>
        <UiLabel type="bodyXs" color="textWeak">days</UiLabel>
      </UiFlex>
      <UiLabel type="HeadingM" color="textWeak">:</UiLabel>
      <UiFlex direction="column" alignItems="center" [gap]="0">
        <UiLabel type="HeadingL" color="textStrong" className="font-semibold">
          {{ timeLeft().hours }}
        </UiLabel>
        <UiLabel type="bodyXs" color="textWeak">hours</UiLabel>
      </UiFlex>
      <UiLabel type="HeadingM" color="textWeak">:</UiLabel>
      <UiFlex direction="column" alignItems="center" [gap]="0">
        <UiLabel type="HeadingL" color="textStrong" className="font-semibold">
          {{ timeLeft().minutes }}
        </UiLabel>
        <UiLabel type="bodyXs" color="textWeak">min</UiLabel>
      </UiFlex>
      <UiLabel type="HeadingM" color="textWeak">:</UiLabel>
      <UiFlex direction="column" alignItems="center" [gap]="0">
        <UiLabel type="HeadingL" color="textStrong" className="font-semibold">
          {{ timeLeft().seconds }}
        </UiLabel>
        <UiLabel type="bodyXs" color="textWeak">sec</UiLabel>
      </UiFlex>
    </UiFlex>
  `,
})
export class CommonCountdownTimerComponent {
  /** Fecha objetivo de la cuenta regresiva. */
  readonly targetDate = input.required<Date>();

  /** Estado actual de la cuenta regresiva. */
  protected readonly timeLeft = signal<CommonCountdownTime>(ZERO_TIME);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    effect(() => {
      this.timeLeft.set(computeTimeLeft(this.targetDate()));
    });
    interval(MS_PER_SECOND)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.tick());
  }

  private tick(): void {
    this.timeLeft.set(computeTimeLeft(this.targetDate()));
  }
}
