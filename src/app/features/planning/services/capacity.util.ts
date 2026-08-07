import { parseIsoDate, toIsoDate } from "@utils/date";

import type { Assignment } from "../models/assignment";

const DAY_MS = 1000 * 60 * 60 * 24;

export function countBusinessDays(
  isoStart: string,
  isoEnd: string,
): number {
  const start = parseIsoDate(isoStart);
  const end = parseIsoDate(isoEnd);
  if (!start || !end) return 0;
  if (end < start) return 0;

  const days: string[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  while (cursor <= end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) {
      days.push(toIsoDate(cursor));
    }
    cursor.setTime(cursor.getTime() + DAY_MS);
  }
  return days.length;
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

export function isOverload(
  committedHours: number,
  newHours: number,
  capacityHours: number,
): boolean {
  return committedHours + newHours > capacityHours;
}
