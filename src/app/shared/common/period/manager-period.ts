export interface ManagerPeriod {
  id: string;
  label: string;
  startIso: string;
  endIso: string;
}

export const DEFAULT_PERIODS: ManagerPeriod[] = [
  {
    id: "2026-q2",
    label: "2T 2026 · abr–jun",
    startIso: "2026-04-01",
    endIso: "2026-06-30",
  },
  {
    id: "2026-q1",
    label: "1T 2026 · ene–mar",
    startIso: "2026-01-01",
    endIso: "2026-03-31",
  },
  {
    id: "2026-q3",
    label: "3T 2026 · jul–sep",
    startIso: "2026-07-01",
    endIso: "2026-09-30",
  },
];

export const DEFAULT_PERIOD_ID = "2026-q2";
