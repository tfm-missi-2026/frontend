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
import { range } from "@utils/collections";

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
  templateUrl: "./users-table.component.html",
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
    return range(this.totalPages());
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
