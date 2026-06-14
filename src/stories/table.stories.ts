// table.stories.ts — Table del design system

import { Component, Input, TemplateRef, ViewChild, signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { UiTableComponent } from '@ui/table';
import { TableCellContext, TableColumn } from '@ui/table/table.types';
import { IconProps } from '@ui/icon/icon.interface';

// ---------------------------------------------------------------------------
// Iconos stub (mismo patrón que las demás stories del DS).
// Cada stub respeta `IconProps` y renderiza un SVG simple.
// ---------------------------------------------------------------------------

@Component({
  selector: 'SearchIconLight',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth"
      [attr.height]="computedHeight"
      viewBox="0 0 20 20"
      fill="currentColor"
      [style.color]="color"
      style="display: inline-block; flex-shrink: 0;"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.04199 9.37381C3.04199 5.87712 5.87735 3.04218 9.37533 3.04218C12.8733 3.04218 15.7087 5.87712 15.7087 9.37381C15.7087 12.8705 12.8733 15.7055 9.37533 15.7055C5.87735 15.7055 3.04199 12.8705 3.04199 9.37381ZM9.37533 1.54218C5.04926 1.54218 1.54199 5.04835 1.54199 9.37381C1.54199 13.6993 5.04926 17.2055 9.37533 17.2055C11.2676 17.2055 13.0032 16.5346 14.3572 15.4178L17.1773 18.2381C17.4702 18.531 17.945 18.5311 18.2379 18.2382C18.5308 17.9453 18.5309 17.4704 18.238 17.1775L15.4182 14.3575C16.5367 13.0035 17.2087 11.2671 17.2087 9.37381C17.2087 5.04835 13.7014 1.54218 9.37533 1.54218Z"
      />
    </svg>
  `,
})
class SearchIconLightStubComponent implements IconProps {
  @Input() size: number | string = 16;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() color = 'currentColor';
  @Input() className?: string;
  @Input() dataTestId?: string;
  get computedWidth() {
    return this.width ?? this.size;
  }
  get computedHeight() {
    return this.height ?? this.size;
  }
}

@Component({
  selector: 'EditIconLight',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth"
      [attr.height]="computedHeight"
      viewBox="0 0 20 20"
      fill="currentColor"
      [style.color]="color"
      style="display: inline-block; flex-shrink: 0;"
    >
      <path
        d="M17.414 2.586a2 2 0 0 0-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 0 0 0-2.828ZM4 14v2h12v-2H4Z"
      />
    </svg>
  `,
})
class EditIconLightStubComponent implements IconProps {
  @Input() size: number | string = 16;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() color = 'currentColor';
  @Input() className?: string;
  get computedWidth() {
    return this.width ?? this.size;
  }
  get computedHeight() {
    return this.height ?? this.size;
  }
}

@Component({
  selector: 'TrashIconLight',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth"
      [attr.height]="computedHeight"
      viewBox="0 0 20 20"
      fill="currentColor"
      [style.color]="color"
      style="display: inline-block; flex-shrink: 0;"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.75 1A2.25 2.25 0 0 0 6.5 3.25v.443c-.57.057-1.13.13-1.682.232A1.5 1.5 0 0 0 3.5 5.404V6.5h13v-1.096a1.5 1.5 0 0 0-1.318-1.479 18.7 18.7 0 0 0-1.682-.232V3.25A2.25 2.25 0 0 0 11.25 1h-2.5ZM5 8.5v7A2.5 2.5 0 0 0 7.5 18h5a2.5 2.5 0 0 0 2.5-2.5v-7H5Z"
      />
    </svg>
  `,
})
class TrashIconLightStubComponent implements IconProps {
  @Input() size: number | string = 16;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() color = 'currentColor';
  @Input() className?: string;
  get computedWidth() {
    return this.width ?? this.size;
  }
  get computedHeight() {
    return this.height ?? this.size;
  }
}

// ---------------------------------------------------------------------------
// Datos de ejemplo.
// ---------------------------------------------------------------------------

interface User {
  id: number;
  name: string;
  role: 'Admin' | 'Member' | 'Owner';
  status: 'Active' | 'Pending' | 'Cancelled';
  amount: number;
}

const USERS: User[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Owner', status: 'Active', amount: 2499 },
  { id: 2, name: 'Alan Turing', role: 'Admin', status: 'Active', amount: 1840 },
  { id: 3, name: 'Grace Hopper', role: 'Member', status: 'Pending', amount: 920 },
  { id: 4, name: 'Linus Torvalds', role: 'Admin', status: 'Active', amount: 3200 },
  { id: 5, name: 'Margaret Hamilton', role: 'Member', status: 'Cancelled', amount: 410 },
  { id: 6, name: 'Donald Knuth', role: 'Admin', status: 'Active', amount: 2750 },
  { id: 7, name: 'Barbara Liskov', role: 'Member', status: 'Active', amount: 1640 },
  { id: 8, name: 'Tim Berners-Lee', role: 'Owner', status: 'Pending', amount: 5100 },
  { id: 9, name: 'Edsger Dijkstra', role: 'Member', status: 'Active', amount: 1820 },
  { id: 10, name: 'John von Neumann', role: 'Admin', status: 'Cancelled', amount: 980 },
  { id: 11, name: 'Claude Shannon', role: 'Member', status: 'Active', amount: 2200 },
  { id: 12, name: 'Dennis Ritchie', role: 'Owner', status: 'Active', amount: 4300 },
];

const BASE_COLUMNS: TableColumn<User>[] = [
  { key: 'id', header: 'ID', width: '64px' },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
  { key: 'amount', header: 'Amount', align: 'end' },
];

// ---------------------------------------------------------------------------
// Wrapper que arma la historia "FullFeatured" (con templates para status y
// name, además de search/select/paginate/actions).
// ---------------------------------------------------------------------------

@Component({
  selector: 'FullFeaturedTable',
  standalone: true,
  imports: [UiTableComponent],
  template: `
    <ng-template #statusTpl let-row>
      <span
        [class]="
          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ' +
          (row.status === 'Active'
            ? 'bg-success-50 text-success-600'
            : row.status === 'Pending'
              ? 'bg-warning-50 text-warning-600'
              : 'bg-error-50 text-error-600')
        "
      >
        {{ row.status }}
      </span>
    </ng-template>

    <ng-template #nameTpl let-row>
      <span class="font-medium text-gray-800 dark:text-white/90">
        {{ row.name }}
      </span>
    </ng-template>

    <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <UiTable
        title="Team members"
        description="Manage roles, statuses and permissions"
        [columns]="columns(statusTpl, nameTpl)"
        [data]="users"
        [searchable]="true"
        [searchIcon]="SearchIcon"
        [selectable]="true"
        [paginated]="true"
        [pageSize]="5"
        [actions]="rowActions(EditIcon, TrashIcon)"
        (rowSelect)="onRowSelect($event)"
        (pageChange)="onPageChange($event)"
        (searchChange)="onSearch($event)"
      />
      <p class="mt-4 text-sm text-gray-500">
        Selected: {{ selectedCount() }} · Page: {{ currentPage() }} · Search: "{{ searchTerm() }}"
      </p>
    </div>
  `,
})
class FullFeaturedUiTableComponent {
  @Input() SearchIcon!: typeof SearchIconLightStubComponent;
  @Input() EditIcon!: typeof EditIconLightStubComponent;
  @Input() TrashIcon!: typeof TrashIconLightStubComponent;

  @ViewChild('statusTpl') statusTpl!: TemplateRef<TableCellContext<User>>;
  @ViewChild('nameTpl') nameTpl!: TemplateRef<TableCellContext<User>>;

  users = USERS;
  selectedCount = signal(0);
  currentPage = signal(1);
  searchTerm = signal('');

  columns(
    statusTpl: TemplateRef<TableCellContext<User>>,
    nameTpl: TemplateRef<TableCellContext<User>>,
  ): TableColumn<User>[] {
    return [
      { key: 'id', header: 'ID', width: '64px' },
      { key: 'name', header: 'Name', cell: nameTpl, sortable: true },
      { key: 'role', header: 'Role' },
      { key: 'status', header: 'Status', cell: statusTpl },
      { key: 'amount', header: 'Amount', align: 'end' },
    ];
  }

  rowActions(EditIcon: unknown, TrashIcon: unknown) {
    return [
      {
        key: 'edit',
        label: 'Edit',
        icon: EditIcon as never,
        onClick: (row: User) => console.log('edit', row),
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: TrashIcon as never,
        onClick: (row: User) => console.log('delete', row),
      },
    ];
  }

  onRowSelect(evt: { rows: unknown[] }) {
    this.selectedCount.set(evt.rows.length);
  }
  onPageChange(evt: { page: number }) {
    this.currentPage.set(evt.page);
  }
  onSearch(term: string) {
    this.searchTerm.set(term);
  }
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta: Meta<UiTableComponent> = {
  title: 'DS/Table',
  component: UiTableComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        SearchIconLightStubComponent,
        EditIconLightStubComponent,
        TrashIconLightStubComponent,
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<UiTableComponent>;

// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => ({
    props: { columns: BASE_COLUMNS, data: USERS },
    template: `
      <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <UiTable title="Team members" [columns]="columns" [data]="data" />
      </div>
    `,
  }),
};

export const WithSearch: Story = {
  render: () => ({
    props: {
      columns: BASE_COLUMNS,
      data: USERS,
      SearchIcon: SearchIconLightStubComponent,
    },
    template: `
      <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <UiTable
          title="Team members"
          [columns]="columns"
          [data]="data"
          [searchable]="true"
          [searchPlaceholder]="'Search by name, role, status…'"
          [searchIcon]="SearchIcon"
        />
      </div>
    `,
  }),
};

export const WithSelection: Story = {
  render: () => ({
    props: { columns: BASE_COLUMNS, data: USERS },
    template: `
      <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <UiTable
          title="Team members"
          [columns]="columns"
          [data]="data"
          [selectable]="true"
        />
      </div>
    `,
  }),
};

export const WithPagination: Story = {
  render: () => ({
    props: { columns: BASE_COLUMNS, data: USERS },
    template: `
      <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <UiTable
          title="Transactions"
          [columns]="columns"
          [data]="data"
          [paginated]="true"
          [pageSize]="5"
        />
      </div>
    `,
  }),
};

export const WithRowActions: Story = {
  render: () => ({
    props: {
      columns: BASE_COLUMNS,
      data: USERS,
      EditIcon: EditIconLightStubComponent,
      TrashIcon: TrashIconLightStubComponent,
      onEdit: (row: User) => console.log('edit', row),
      onDelete: (row: User) => console.log('delete', row),
    },
    template: `
      <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <UiTable
          title="Team members"
          [columns]="columns"
          [data]="data"
          [actions]="[
            { key: 'edit', label: 'Edit', icon: EditIcon, onClick: onEdit },
            { key: 'delete', label: 'Delete', icon: TrashIcon, onClick: onDelete }
          ]"
        />
      </div>
    `,
  }),
};

export const FullFeatured: StoryObj = {
  render: () => ({
    moduleMetadata: {
      imports: [FullFeaturedUiTableComponent],
    },
    props: {
      SearchIcon: SearchIconLightStubComponent,
      EditIcon: EditIconLightStubComponent,
      TrashIcon: TrashIconLightStubComponent,
    },
    template: `
      <FullFeaturedTable
        [SearchIcon]="SearchIcon"
        [EditIcon]="EditIcon"
        [TrashIcon]="TrashIcon"
      />
    `,
  }),
};

export const EmptyState: Story = {
  render: () => ({
    props: { columns: BASE_COLUMNS, data: [] },
    template: `
      <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <UiTable
          title="Team members"
          [columns]="columns"
          [data]="data"
          [emptyText]="'No team members yet. Invite someone to get started.'"
        />
      </div>
    `,
  }),
};
