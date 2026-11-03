import { formatShortDate, parseIsoDate, toIsoDate } from "@utils/date";

import type { Assignment } from "../models/assignment";

const DAY_MS = 1000 * 60 * 60 * 24;

export function countBusinessDays(
  isoStart: string,
  isoEnd: string,
): number {
  return listBusinessDays(isoStart, isoEnd).length;
}

export function listBusinessDays(isoStart: string, isoEnd: string): string[] {
  const start = parseIsoDate(isoStart);
  const end = parseIsoDate(isoEnd);
  if (!start || !end) return [];
  if (end < start) return [];

  const days: string[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  while (cursor <= end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      days.push(toIsoDate(cursor));
    }
    cursor.setTime(cursor.getTime() + DAY_MS);
  }
  return days;
}

export function isBusinessDay(isoDate: string): boolean {
  return countBusinessDays(isoDate, isoDate) === 1;
}

export function computeEndDate(isoStart: string, days: number): string {
  const start = parseIsoDate(isoStart);
  if (!start || days <= 0) return "";
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  let remaining = days - 1;
  while (remaining > 0) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) remaining--;
  }
  return toIsoDate(cursor);
}

export function computeCapacityHours(
  isoStart: string,
  isoEnd: string,
  hoursPerDay = 8,
): number {
  return countBusinessDays(isoStart, isoEnd) * hoursPerDay;
}

function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export function computeCommittedHours(
  assignments: readonly Assignment[],
  resourceId: string,
  periodStart: string,
  periodEnd: string,
  excludingAssignmentId?: string,
): number {
  return assignments
    .filter(
      (a) =>
        a.active &&
        a.resourceId === resourceId &&
        a.id !== excludingAssignmentId &&
        rangesOverlap(a.startDate, a.endDate, periodStart, periodEnd),
    )
    .reduce((acc, a) => acc + a.plannedHours, 0);
}

export interface DayLoad {
  hours: number;
  names: string[];
}

export function computeDayLoads(
  assignments: readonly Assignment[],
  taskNames: ReadonlyMap<string, string>,
): Map<string, DayLoad> {
  const loads = new Map<string, DayLoad>();
  for (const a of assignments) {
    const days = listBusinessDays(a.startDate, a.endDate);
    for (const day of days) {
      const load = loads.get(day) ?? { hours: 0, names: [] };
      load.hours += a.plannedHours / days.length;
      load.names.push(taskNames.get(a.taskId) ?? "Tarea");
      loads.set(day, load);
    }
  }
  return loads;
}

export function dayLoadMark(
  loads: ReadonlyMap<string, DayLoad>,
  iso: string,
  hoursPerDay = 8,
): { className: string; title: string } | null {
  const load = loads.get(iso);
  if (!load) return null;
  const hours = Math.round(load.hours * 100) / 100;
  return {
    className: hours >= hoursPerDay ? "ui-day-full" : "ui-day-partial",
    title: `${formatShortDate(iso)}: ${hours} h · ${load.names.join(", ")}`,
  };
}

export function findFirstDate(
  fromIso: string,
  matches: (iso: string) => boolean,
  searchDays = 365,
): string | null {
  const cursor = parseIsoDate(fromIso);
  if (!cursor) return null;
  for (let i = 0; i < searchDays; i++) {
    const iso = toIsoDate(cursor);
    if (matches(iso)) return iso;
    cursor.setDate(cursor.getDate() + 1);
  }
  return null;
}

export function isOverload(
  committedHours: number,
  newHours: number,
  capacityHours: number,
): boolean {
  return committedHours + newHours > capacityHours;
}
