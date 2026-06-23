import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import { RouterModule } from "@angular/router";

import { IconBellComponent, IconCloseLargeComponent } from "@shared/icons";
import { UiAvatarComponent } from "@shared/ui/avatar";
import {
  UiDropdownComponent,
  UiDropdownItemComponent,
} from "@shared/ui/dropdown";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";

import {
  HeaderNotificationItem,
  HeaderNotificationViewAll,
} from "./header.types";

const TRIGGER_BUTTON_CLASS =
  "relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white";

const TRIGGER_BADGE_CLASS =
  "absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400";

const TRIGGER_BADGE_PING_CLASS =
  "absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping";

const PANEL_CLASS =
  "absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0";

const HEADER_BAR_CLASS =
  "flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700";

const CLOSE_BUTTON_CLASS =
  "text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200";

const LIST_CLASS = "flex flex-col h-auto overflow-y-auto custom-scrollbar";

const ITEM_CLASS =
  "w-full text-left text-sm text-gray-700 hover:text-gray-900 flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5";

const ITEM_META_ROW_CLASS =
  "flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400";

const ITEM_META_DOT_CLASS = "w-1 h-1 bg-gray-400 rounded-full";

const VIEW_ALL_CLASS =
  "block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700";

/**
 * `HeaderNotificationDropdown`
 * ----------------------------
 * Dropdown del header para notificaciones (bell + badge animado). El
 * panel muestra una lista de items (actor + acción + target + meta)
 * con scroll y un enlace al pie para ver todas las notificaciones.
 *
 * Es 100% data-driven: el consumidor pasa el array de notificaciones
 * y la configuración del "view all" a través de inputs. No contiene
 * datos hardcoded.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "HeaderNotificationDropdown",
  standalone: true,
  imports: [
    IconBellComponent,
    IconCloseLargeComponent,
    RouterModule,
    UiAvatarComponent,
    UiDropdownComponent,
    UiDropdownItemComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <button
        type="button"
        (click)="toggleDropdown()"
        [class]="TRIGGER_BUTTON_CLASS"
      >
        @if (showBadge()) {
          <span [class]="TRIGGER_BADGE_CLASS">
            <span [class]="TRIGGER_BADGE_PING_CLASS"></span>
          </span>
        }
        <IconBell className="fill-current" />
      </button>

      <UiDropdown
        [isOpen]="isOpen()"
        (close)="closeDropdown()"
        [className]="PANEL_CLASS"
      >
        <div [class]="HEADER_BAR_CLASS">
          <UiHeader
            [level]="5"
            [text]="title()"
            className="text-lg font-semibold text-gray-800 dark:text-gray-200"
          />
          <button
            type="button"
            (click)="toggleDropdown()"
            [class]="CLOSE_BUTTON_CLASS"
          >
            <IconCloseLarge className="fill-current" />
          </button>
        </div>

        <ul [class]="LIST_CLASS">
          @for (item of items(); track $index) {
            <li>
              <UiDropdownItem
                (itemClick)="closeDropdown()"
                [to]="item.to"
                [className]="ITEM_CLASS"
              >
                <UiAvatar
                  [src]="item.actor.avatar"
                  [alt]="item.actor.name"
                  size="medium"
                  [status]="item.status"
                />
                <UiFlex direction="column" gap="0.375rem">
                  <UiLabel
                    type="bodyS"
                    color="textWeak"
                    className="mb-1.5 block"
                  >
                    <span class="font-medium text-gray-800 dark:text-white/90">
                      {{ item.actor.name }}
                    </span>
                    <span> {{ item.action }} </span>
                    <span class="font-medium text-gray-800 dark:text-white/90">
                      {{ item.target }}
                    </span>
                  </UiLabel>
                  <div [class]="ITEM_META_ROW_CLASS">
                    <span>{{ item.category }}</span>
                    <span [class]="ITEM_META_DOT_CLASS"></span>
                    <span>{{ item.time }}</span>
                  </div>
                </UiFlex>
              </UiDropdownItem>
            </li>
          }
        </ul>

        <a [routerLink]="viewAll().to" [class]="VIEW_ALL_CLASS">
          {{ viewAll().label }}
        </a>
      </UiDropdown>
    </div>
  `,
})
export class HeaderNotificationDropdownComponent {
  /** Lista de notificaciones renderizadas en el panel. */
  readonly items = input.required<HeaderNotificationItem[]>();
  /**
   * Si `true`, muestra el badge naranja con animación `ping` en el
   * trigger (indica notificaciones sin leer). Se desactiva
   * automáticamente al abrir el dropdown.
   */
  readonly notifying = input<boolean>(false);
  /** Título del panel. Default: `"Notification"`. */
  readonly title = input<string>("Notification");
  /**
   * Configuración del enlace "view all" al pie del panel.
   * Default: `{ to: "/", label: "View All Notifications" }`.
   */
  readonly viewAll = input<HeaderNotificationViewAll>({
    to: "/",
    label: "View All Notifications",
  });

  /** Estado interno de visibilidad del dropdown. */
  protected readonly isOpen = signal(false);

  /**
   * Estado interno del badge naranja. Se inicializa con el valor del
   * input `notifying` y se desactiva al abrir el dropdown (UX:
   * "notificaciones sin leer" se limpian al verlas).
   */
  protected readonly showBadge = signal(false);

  protected readonly TRIGGER_BUTTON_CLASS = TRIGGER_BUTTON_CLASS;
  protected readonly TRIGGER_BADGE_CLASS = TRIGGER_BADGE_CLASS;
  protected readonly TRIGGER_BADGE_PING_CLASS = TRIGGER_BADGE_PING_CLASS;
  protected readonly PANEL_CLASS = PANEL_CLASS;
  protected readonly HEADER_BAR_CLASS = HEADER_BAR_CLASS;
  protected readonly CLOSE_BUTTON_CLASS = CLOSE_BUTTON_CLASS;
  protected readonly LIST_CLASS = LIST_CLASS;
  protected readonly ITEM_CLASS = ITEM_CLASS;
  protected readonly ITEM_META_ROW_CLASS = ITEM_META_ROW_CLASS;
  protected readonly ITEM_META_DOT_CLASS = ITEM_META_DOT_CLASS;
  protected readonly VIEW_ALL_CLASS = VIEW_ALL_CLASS;

  constructor() {
    this.showBadge.set(this.notifying());
  }

  protected toggleDropdown(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.showBadge.set(false);
    }
  }

  protected closeDropdown(): void {
    this.isOpen.set(false);
  }
}