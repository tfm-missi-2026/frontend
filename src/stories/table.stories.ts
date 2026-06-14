import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  signal,
} from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiTableComponent } from "@ui/table";
import { TableCellContext, TableColumn } from "@ui/table/table.types";
import { IconSearchLightComponent } from "@ui/icon/search-icon-light";
import { IconEditLightComponent } from "@ui/icon/edit-icon-light";
import { IconTrashLightComponent } from "@ui/icon/trash-icon-light";

interface User {
  id: number;
  name: string;
  role: "Admin" | "Member" | "Owner";
  status: "Active" | "Pending" | "Cancelled";
  amount: number;
}

const USERS: User[] = [
  {
    id: 1,
    name: "Ada Lovelace",
    role: "Owner",
    status: "Active",
    amount: 2499,
  },
  { id: 2, name: "Alan Turing", role: "Admin", status: "Active", amount: 1840 },
  {
    id: 3,
    name: "Grace Hopper",
    role: "Member",
    status: "Pending",
    amount: 920,
  },
  {
    id: 4,
    name: "Linus Torvalds",
    role: "Admin",
    status: "Active",
    amount: 3200,
  },
  {
    id: 5,
    name: "Margaret Hamilton",
    role: "Member",
    status: "Cancelled",
    amount: 410,
  },
  {
    id: 6,
    name: "Donald Knuth",
    role: "Admin",
    status: "Active",
    amount: 2750,
  },
  {
    id: 7,
    name: "Barbara Liskov",
    role: "Member",
    status: "Active",
    amount: 1640,
  },
  {
    id: 8,
    name: "Tim Berners-Lee",
    role: "Owner",
    status: "Pending",
    amount: 5100,
  },
  {
    id: 9,
    name: "Edsger Dijkstra",
    role: "Member",
    status: "Active",
    amount: 1820,
  },
  {
    id: 10,
    name: "John von Neumann",
    role: "Admin",
    status: "Cancelled",
    amount: 980,
  },
  {
    id: 11,
    name: "Claude Shannon",
    role: "Member",
    status: "Active",
    amount: 2200,
  },
  {
    id: 12,
    name: "Dennis Ritchie",
    role: "Owner",
    status: "Active",
    amount: 4300,
  },
];

const BASE_COLUMNS: TableColumn<User>[] = [
  { key: "id", header: "ID", width: "64px" },
  { key: "name", header: "Name", sortable: true },
  { key: "role", header: "Role" },
  { key: "status", header: "Status" },
  { key: "amount", header: "Amount", align: "end" },
];

@Component({
  selector: "FullFeaturedTable",
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
        Selected: {{ selectedCount() }} · Page: {{ currentPage() }} · Search:
        "{{ searchTerm() }}"
      </p>
    </div>
  `,
})
class FullFeaturedUiTableComponent {
  @Input() SearchIcon!: typeof IconSearchLightComponent;
  @Input() EditIcon!: typeof IconEditLightComponent;
  @Input() TrashIcon!: typeof IconTrashLightComponent;

  @ViewChild("statusTpl") statusTpl!: TemplateRef<TableCellContext<User>>;
  @ViewChild("nameTpl") nameTpl!: TemplateRef<TableCellContext<User>>;

  users = USERS;
  selectedCount = signal(0);
  currentPage = signal(1);
  searchTerm = signal("");

  columns(
    statusTpl: TemplateRef<TableCellContext<User>>,
    nameTpl: TemplateRef<TableCellContext<User>>,
  ): TableColumn<User>[] {
    return [
      { key: "id", header: "ID", width: "64px" },
      { key: "name", header: "Name", cell: nameTpl, sortable: true },
      { key: "role", header: "Role" },
      { key: "status", header: "Status", cell: statusTpl },
      { key: "amount", header: "Amount", align: "end" },
    ];
  }

  rowActions(EditIcon: unknown, TrashIcon: unknown) {
    return [
      {
        key: "edit",
        label: "Edit",
        icon: EditIcon as never,
        onClick: (row: User) => console.log("edit", row),
      },
      {
        key: "delete",
        label: "Delete",
        icon: TrashIcon as never,
        onClick: (row: User) => console.log("delete", row),
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

const meta: Meta<UiTableComponent> = {
  title: "Shared/Table",
  component: UiTableComponent,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        IconSearchLightComponent,
        IconEditLightComponent,
        IconTrashLightComponent,
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<UiTableComponent>;

// Default
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

// Búsqueda
export const WithSearch: Story = {
  render: () => ({
    props: {
      columns: BASE_COLUMNS,
      data: USERS,
      SearchIcon: IconSearchLightComponent,
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

// Selección
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

// Paginación
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

// Acciones
export const WithRowActions: Story = {
  render: () => ({
    props: {
      columns: BASE_COLUMNS,
      data: USERS,
      EditIcon: IconEditLightComponent,
      TrashIcon: IconTrashLightComponent,
      onEdit: (row: User) => console.log("edit", row),
      onDelete: (row: User) => console.log("delete", row),
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

// Full featured
export const FullFeatured: StoryObj = {
  render: () => ({
    moduleMetadata: {
      imports: [FullFeaturedUiTableComponent],
    },
    props: {
      SearchIcon: IconSearchLightComponent,
      EditIcon: IconEditLightComponent,
      TrashIcon: IconTrashLightComponent,
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

// Empty state
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
