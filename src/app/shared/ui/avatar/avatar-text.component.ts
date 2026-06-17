import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

/**
 * Paleta de fondos que se asigna de forma determinística según el
 * `name` provisto (hash estable por la suma de char codes).
 */
const COLOR_CLASSES = [
  "bg-brand-100 text-brand-600",
  "bg-pink-100 text-pink-600",
  "bg-cyan-100 text-cyan-600",
  "bg-orange-100 text-orange-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-yellow-100 text-yellow-600",
  "bg-error-100 text-error-600",
] as const;

/**
 * `UiAvatarText`
 * Avatar circular con iniciales calculadas a partir del `name`.
 * El color de fondo se deriva de forma estable del nombre, así dos
 * personas con el mismo `name` siempre obtienen la misma paleta.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiAvatarText",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex h-10 w-10 items-center justify-center rounded-full"
      [class]="colorClass() + ' ' + className()"
    >
      <span class="text-sm font-medium">{{ initials() }}</span>
    </div>
  `,
})
export class UiAvatarTextComponent {
  /** Nombre completo del usuario. Se usan las iniciales (máx. 2 letras). */
  readonly name = input.required<string>();
  /** Clases extra para el contenedor. */
  readonly className = input<string>("");

  readonly initials = computed<string>(() => {
    const value = this.name();
    if (!value) return "";
    return value
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  });

  readonly colorClass = computed<string>(() => {
    const sum = this.name()
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return COLOR_CLASSES[sum % COLOR_CLASSES.length];
  });
}
