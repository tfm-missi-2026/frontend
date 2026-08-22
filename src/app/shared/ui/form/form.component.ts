import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

/**
 * `UiForm`
 * --------
 * Wrapper del elemento HTML `<form>` con `noValidate` por defecto.
 *
 * Previene el comportamiento nativo de envío y emite el evento
 * `submit` para que el consumidor gestione la lógica desde el
 * contenedor. Soporta children vía `ng-content` y clases extra
 * vía `className`.
 */
@Component({
  selector: "UiForm",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      (submit)="onSubmit($event)"
      novalidate
      [attr.class]="className()"
    >
      <ng-content />
    </form>
  `,
  host: { class: "contents" },
})
export class UiFormComponent {
  readonly className = input<string>("");
  readonly submit = output<Event>();

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submit.emit(event);
  }
}
