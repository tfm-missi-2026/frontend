import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTableComponent } from './table';
import { TableColumn } from './table.types';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

const SAMPLE_DATA: User[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@math.io', role: 'admin' },
  { id: 2, name: 'Alan Turing', email: 'alan@cs.io', role: 'member' },
  { id: 3, name: 'Grace Hopper', email: 'grace@navy.io', role: 'admin' },
];

const SAMPLE_COLUMNS: TableColumn<User>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
];

describe('Table', () => {
  let fixture: ComponentFixture<UiTableComponent>;
  let component: UiTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTableComponent);
    component = fixture.componentInstance;
    component.columns = SAMPLE_COLUMNS;
    component.data = SAMPLE_DATA;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one row per data item by default', () => {
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    // 3 data rows + 0 empty row (only renders when there are zero rows)
    expect(rows.length).toBe(3);
  });

  it('renders the empty state when data is empty', () => {
    component.data = [];
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector(
      'tbody tr td[colspan]',
    );
    expect(empty).toBeTruthy();
    expect(empty.textContent.trim()).toContain('No results found');
  });

  describe('search', () => {
    beforeEach(() => {
      component.searchable = true;
    });

    it('filters rows by the search term', () => {
      fixture.detectChanges();
      component['searchTerm'].set('ada');
      fixture.detectChanges();
      const visibleRows = component['filteredData']();
      expect(visibleRows.length).toBe(1);
      expect((visibleRows[0] as User).name).toBe('Ada Lovelace');
    });

    it('is case-insensitive', () => {
      fixture.detectChanges();
      component['searchTerm'].set('GRACE');
      fixture.detectChanges();
      expect(component['filteredData']().length).toBe(1);
    });

    it('returns all rows when term is empty', () => {
      fixture.detectChanges();
      component['searchTerm'].set('');
      fixture.detectChanges();
      expect(component['filteredData']().length).toBe(SAMPLE_DATA.length);
    });
  });

  describe('selection', () => {
    beforeEach(() => {
      component.selectable = true;
      fixture.detectChanges();
    });

    it('toggles a single row in and out of selectedRows', () => {
      const row = SAMPLE_DATA[0];
      component.onRowToggle(row, true);
      expect(component['selectedRows']()).toContain(row);
      component.onRowToggle(row, false);
      expect(component['selectedRows']()).not.toContain(row);
    });

    it('emits rowSelect with rows and keys', () => {
      const spy = spyOn(component.rowSelect, 'emit');
      component.onRowToggle(SAMPLE_DATA[0], true);
      expect(spy).toHaveBeenCalledWith({
        rows: [SAMPLE_DATA[0]],
        keys: [1],
      });
    });

    it('select-all adds every visible row to selection', () => {
      const spy = spyOn(component.rowSelect, 'emit');
      component.onSelectAllToggle(true);
      expect(component['selectedRows']().length).toBe(SAMPLE_DATA.length);
      expect(spy).toHaveBeenCalled();
    });

    it('select-all removes only the visible rows', () => {
      component['selectedRows'].set([...SAMPLE_DATA]);
      component.onSelectAllToggle(false);
      expect(component['selectedRows']().length).toBe(0);
    });
  });

  describe('pagination', () => {
    beforeEach(() => {
      component.paginated = true;
      component.pageSize = 2;
    });

    it('paginates filtered data', () => {
      fixture.detectChanges();
      expect(component['pagedData']().length).toBe(2);
      expect(component['totalPages']()).toBe(2);
    });

    it('moves to next page and emits pageChange', () => {
      fixture.detectChanges();
      const spy = spyOn(component.pageChange, 'emit');
      component.onNextPage();
      expect(component['currentPage']()).toBe(2);
      expect(spy).toHaveBeenCalledWith({ page: 2, pageSize: 2 });
    });

    it('does not go below page 1', () => {
      fixture.detectChanges();
      const spy = spyOn(component.pageChange, 'emit');
      component.onPrevPage();
      expect(component['currentPage']()).toBe(1);
      expect(spy).not.toHaveBeenCalled();
    });

    it('does not go beyond totalPages', () => {
      fixture.detectChanges();
      component['currentPage'].set(2);
      const spy = spyOn(component.pageChange, 'emit');
      component.onNextPage();
      expect(component['currentPage']()).toBe(2);
      expect(spy).not.toHaveBeenCalled();
    });

    it('computes the correct rangeLabel', () => {
      fixture.detectChanges();
      expect(component['rangeLabel']()).toBe('Showing 1–2 of 3');
      component['currentPage'].set(2);
      expect(component['rangeLabel']()).toBe('Showing 3–3 of 3');
    });
  });

  describe('cell rendering', () => {
    it('getCellValue returns string for known key', () => {
      expect(component.getCellValue(SAMPLE_DATA[0], 'name')).toBe(
        'Ada Lovelace',
      );
    });

    it('getCellValue returns "" for null/undefined value', () => {
      expect(component.getCellValue(SAMPLE_DATA[0], 'missing')).toBe('');
    });

    it('getCellValue returns "" for null row', () => {
      expect(component.getCellValue(null, 'name')).toBe('');
    });
  });

  describe('trackBy', () => {
    it('uses the configured trackByKey by default', () => {
      component.trackByKey = 'id';
      expect(component.trackByRow(0, SAMPLE_DATA[0])).toBe(1);
    });

    it('falls back to row reference when trackByKey is not in row', () => {
      component.trackByKey = 'unknown';
      expect(component.trackByRow(0, SAMPLE_DATA[0])).toBe(SAMPLE_DATA[0]);
    });
  });

  describe('custom cell templates', () => {
    @Component({
      standalone: true,
      imports: [UiTableComponent],
      template: `
        <ng-template #badgeTpl let-row>
          <span data-testid="custom-cell">[{{ row.role }}]</span>
        </ng-template>
      `,
    })
    class HostComponent {
      @ViewChild('badgeTpl') badgeTpl!: TemplateRef<unknown>;
    }

    it('renders custom templates for cells with a `cell` field', () => {
      const hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();
      const tpl = hostFixture.componentInstance.badgeTpl;

      component.columns = [
        ...SAMPLE_COLUMNS.slice(0, 3),
        { key: 'role', header: 'Role', cell: tpl as TableColumn['cell'] },
      ];
      fixture.detectChanges();

      const customCell = fixture.nativeElement.querySelector(
        '[data-testid="custom-cell"]',
      );
      expect(customCell).toBeTruthy();
      expect(customCell.textContent).toBe('[admin]');
    });
  });
});
