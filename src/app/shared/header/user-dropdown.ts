import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";
import { NgComponentOutlet } from "@angular/common";

import { IconChevronDownComponent } from "@shared/icons";
import { UiAvatarComponent } from "@shared/ui/avatar";
import {
  UiDropdownComponent,
  UiDropdownItemComponent,
} from "@shared/ui/dropdown";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";

import {
  HeaderUserInfo,
  HeaderUserMenuItem,
} from "./header.types";

const TRIGGER_BUTTON_CLASS =
  "flex items-center text-gray-700 dropdown-toggle dark:text-gray-400";

const CHEVRON_BASE_CLASS =
  "stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200";

const PANEL_CLASS =
  "absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark";

const HEADER_CLASS = "pb-3 border-b border-gray-200 dark:border-gray-800";

const MENU_LIST_CLASS =
  "flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800";

const MENU_ITEM_CLASS =
  "flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300";

const ACTION_CLASS =
  "flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300";

/**
 * `HeaderUserDropdown`
 * -------------------
 * Dropdown del header para el menú de usuario (avatar + nombre +
 * chevron). Renderiza un panel con datos del usuario, una lista de
 * items del menú (ruteables) y, opcionalmente, una acción al pie
 * (e.g. "Sign out").
 *
 * Es 100% data-driven: el consumidor pasa el usuario, los items del
 * menú y la acción opcional a través de inputs. No contiene datos
 * hardcoded.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "HeaderUserDropdown",
  standalone: true,
  imports: [
    IconChevronDownComponent,
    NgComponentOutlet,
    UiAvatarComponent,
    UiDropdownComponent,
    UiDropdownItemComponent,
    UiFlexComponent,
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
        <UiAvatar
          [src]="user().avatar"
          alt="User"
          size="large"
          className="mr-3"
        />
        <UiLabel
          type="bodyS"
          color="textStrong"
          weight="medium"
          className="block mr-1"
        >
          {{ triggerName() }}
        </UiLabel>
        <IconChevronDown
          [width]="18"
          [height]="20"
          [className]="chevronClass()"
        />
      </button>

      <UiDropdown
        [isOpen]="isOpen()"
        (close)="closeDropdown()"
        [className]="PANEL_CLASS"
      >
        <UiFlex direction="column" gap="0.125rem" [className]="HEADER_CLASS">
          <UiLabel
            type="bodyS"
            color="textStrong"
            weight="medium"
            className="block"
          >
            {{ user().name }}
          </UiLabel>
          <UiLabel
            type="bodyXs"
            color="textWeak"
            className="block mt-0.5"
          >
            {{ user().email }}
          </UiLabel>
        </UiFlex>

        <ul [class]="MENU_LIST_CLASS">
          @for (item of menuItems(); track item.label) {
            <li>
              <UiDropdownItem
                (itemClick)="closeDropdown()"
                [to]="item.to"
                [className]="MENU_ITEM_CLASS"
              >
                <ng-container
                  *ngComponentOutlet="item.icon"
                ></ng-container>
                {{ item.label }}
              </UiDropdownItem>
            </li>
          }
        </ul>

        @if (actionItem(); as action) {
          <UiDropdownItem
            (itemClick)="closeDropdown()"
            [to]="action.to"
            [className]="ACTION_CLASS"
          >
            <ng-container
              *ngComponentOutlet="action.icon"
            ></ng-container>
            {{ action.label }}
          </UiDropdownItem>
        }
      </UiDropdown>
    </div>
  `,
})
export class HeaderUserDropdownComponent {
  /** Información del usuario mostrado en el trigger y cabecera del panel. */
  readonly user = input.required<HeaderUserInfo>();
  /**
   * Texto del trigger junto al avatar. Si se omite, usa `user().name`.
   */
  readonly triggerLabel = input<string | undefined>(undefined);
  /**
   * Items del menú (ruteables) renderizados dentro del panel.
   */
  readonly menuItems = input.required<HeaderUserMenuItem[]>();
  /**
   * Acción al pie del panel (e.g. "Sign out"). Si se omite, no se
   * renderiza ninguna acción.
   */
  readonly actionItem = input<HeaderUserMenuItem | undefined>(undefined);

  /** Estado interno de visibilidad del dropdown. */
  protected readonly isOpen = signal(false);

  protected readonly TRIGGER_BUTTON_CLASS = TRIGGER_BUTTON_CLASS;
  protected readonly PANEL_CLASS = PANEL_CLASS;
  protected readonly HEADER_CLASS = HEADER_CLASS;
  protected readonly MENU_LIST_CLASS = MENU_LIST_CLASS;
  protected readonly MENU_ITEM_CLASS = MENU_ITEM_CLASS;
  protected readonly ACTION_CLASS = ACTION_CLASS;

  /** Nombre mostrado en el trigger (override o `user.name`). */
  protected readonly triggerName = computed<string>(
    () => this.triggerLabel() ?? this.user().name,
  );

  /** Clase del chevron: rota 180° cuando el panel está abierto. */
  protected readonly chevronClass = computed<string>(() =>
    [this.isOpen() ? "rotate-180" : "", CHEVRON_BASE_CLASS]
      .filter(Boolean)
      .join(" "),
  );

  protected toggleDropdown(): void {
    this.isOpen.update((v) => !v);
  }

  protected closeDropdown(): void {
    this.isOpen.set(false);
  }
}