import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import { RouterModule } from "@angular/router";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiLinkComponent } from "@shared/ui/link";

import type { User } from "../../models/user";
import { USER_ROLE_LABELS } from "../../models/user";

const PAGE_SIZE = 6;

@Component({
  selector: "UsersTable",
  standalone: true,
  imports: [
    RouterModule,
    UiBadgeComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiLinkComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3"
    >
      @if (users().length === 0) {
        <div
          class="flex flex-col items-center justify-center px-5 py-16 text-center"
        >
          <div
            class="mb-4 flex h-13.5 w-13.5 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <span class="text-2xl text-gray-400">∅</span>
          </div>
          <UiLabel type="HeadingXs" color="textStrong" weight="semibold">
            No hay usuarios que coincidan con el filtro.
          </UiLabel>
          <UiLabel
            type="bodyS"
            color="textWeak"
            className="mt-2"
          >
            Prueba a limpiar la búsqueda o ajustar los filtros de rol y estado.
          </UiLabel>
          <UiFlex direction="row" alignItems="center" gap="8px" className="mt-4">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5"
              (click)="clearFilters.emit()"
            >
              Limpiar filtros
            </button>
          </UiFlex>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-700 dark:text-gray-300">
            <thead
              class="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400"
            >
              <tr>
                <th class="px-4 py-3 font-medium">Nombre completo</th>
                <th class="px-4 py-3 font-medium">Correo electrónico</th>
                <th class="px-4 py-3 font-medium">Rol</th>
                <th class="px-4 py-3 font-medium">Estado</th>
                <th class="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              @for (u of pagedUsers(); track u.id) {
                <tr class="hover:bg-gray-50 dark:hover:bg-white/3">
                  <td class="px-4 py-3.5">
                    <span class="text-sm font-semibold text-gray-800 dark:text-white/90">
                      {{ fullName(u) }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {{ u.email }}
                  </td>
                  <td class="px-4 py-3.5">
                    <UiBadge variant="light" color="primary" size="sm">
                      {{ roleLabel(u.role) }}
                    </UiBadge>
                  </td>
                  <td class="px-4 py-3.5">
                    @if (u.status === "active") {
                      <UiBadge variant="light" color="success" size="sm">
                        <span class="mr-1 text-success-500">●</span> Activo
                      </UiBadge>
                    } @else {
                      <UiBadge variant="light" color="error" size="sm">
                        <span class="mr-1 text-error-500">○</span> Inactivo
                      </UiBadge>
                    }
                  </td>
                  <td class="px-4 py-3.5">
                    <UiFlex
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      gap="10px"
                      className="whitespace-nowrap"
                    >
                      <UiLink
                        variant="primary"
                        size="sm"
                        (click)="edit.emit(u)"
                      >
                        Editar
                      </UiLink>
                      <span class="text-gray-300 dark:text-gray-600">·</span>
                      <UiLink
                        variant="primary"
                        size="sm"
                        (click)="resetPassword.emit(u)"
                      >
                        Restablecer contraseña
                      </UiLink>
                      <span class="text-gray-300 dark:text-gray-600">·</span>
                      <UiLink
                        variant="danger"
                        size="sm"
                        (click)="deactivate.emit(u)"
                      >
                        Dar de baja
                      </UiLink>
                    </UiFlex>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div
          class="mt-4 flex items-center justify-between border-t border-dashed border-gray-200 pt-3 dark:border-gray-800"
        >
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Mostrando {{ rangeStart() }}–{{ rangeEnd() }} de {{ users().length }}
          </span>
          <UiFlex direction="row" alignItems="center" gap="8px">
            <button
              type="button"
              class="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-white/5"
              [disabled]="currentPage() === 1"
              (click)="goToPrevious()"
            >
              ‹ Anterior
            </button>
            @for (p of pageNumbers(); track p) {
              <button
                type="button"
                class="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors"
                [class.bg-brand-500]="p === currentPage()"
                [class.text-white]="p === currentPage()"
                [class.text-gray-700]="p !== currentPage()"
                [class.dark:text-gray-300]="p !== currentPage()"
                [class.hover:bg-gray-100]="p !== currentPage()"
                [class.dark:hover:bg-white\/5]="p !== currentPage()"
                (click)="goToPage(p)"
              >
                {{ p }}
              </button>
            }
            <button
              type="button"
              class="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-white/5"
              [disabled]="currentPage() === totalPages()"
              (click)="goToNext()"
            >
              Siguiente ›
            </button>
          </UiFlex>
        </div>
      }
    </div>
  `,
})
export class UsersTableComponent {
  readonly users = input<User[]>([]);

  readonly edit = output<User>();
  readonly resetPassword = output<User>();
  readonly deactivate = output<User>();
  readonly clearFilters = output<void>();

  protected readonly currentPage = signal(1);

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.users().length / PAGE_SIZE)),
  );

  protected readonly pagedUsers = computed<User[]>(() => {
    const all = this.users();
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return all.slice(start, start + PAGE_SIZE);
  });

  protected readonly rangeStart = computed<number>(() => {
    const total = this.users().length;
    if (total === 0) return 0;
    return (this.currentPage() - 1) * PAGE_SIZE + 1;
  });

  protected readonly rangeEnd = computed<number>(() =>
    Math.min(this.currentPage() * PAGE_SIZE, this.users().length),
  );

  protected readonly pageNumbers = computed<number[]>(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  constructor() {
    effect(() => {
      this.users();
      this.currentPage.set(1);
    });
  }

  protected goToPage(p: number): void {
    this.currentPage.set(p);
  }

  protected goToPrevious(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((v) => v - 1);
    }
  }

  protected goToNext(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((v) => v + 1);
    }
  }

  protected fullName(u: User): string {
    return `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal}`.trim();
  }

  protected roleLabel(role: User["role"]): string {
    return USER_ROLE_LABELS[role];
  }
}