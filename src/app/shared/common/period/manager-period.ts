import { formatDateRange } from "@utils/date";

export interface ManagerPeriod {
  id: string;
  label: string;
  startIso: string;
  endIso: string;
}

function trimestreDe(trimestreActual: number, anio: number, offset: number): ManagerPeriod {
  const t = trimestreActual - offset;
  const ajusteAnio = Math.floor(t / 4);
  const tAbs = ((t % 4) + 4) % 4;
  const y = anio + ajusteAnio;
  const inicioMes = tAbs * 3;
  const finMes = inicioMes + 2;
  const mesInicio = String(inicioMes + 1).padStart(2, "0");
  const mesFin = String(finMes + 1).padStart(2, "0");
  const finDia = new Date(y, finMes + 1, 0).getDate();
  const nombreTrimestre = ["1T", "2T", "3T", "4T"][tAbs];
  const startIso = `${y}-${mesInicio}-01`;
  const endIso = `${y}-${mesFin}-${String(finDia).padStart(2, "0")}`;
  return {
    id: `${y}-q${tAbs + 1}`,
    label: `${nombreTrimestre} ${y} · ${formatDateRange(startIso, endIso)}`,
    startIso,
    endIso,
  };
}

/**
 * Trimestre actual, el anterior y el previo a ese (dos trimestres atras),
 * ordenados de forma ascendente en el tiempo. Nunca incluye un trimestre
 * futuro: son los unicos con actividad real que reportar.
 */
function trimestresCercanos(): ManagerPeriod[] {
  const hoy = new Date();
  const trimestreActual = Math.floor(hoy.getMonth() / 3);
  const anio = hoy.getFullYear();

  return [2, 1, 0].map((offset) => trimestreDe(trimestreActual, anio, offset));
}

export const DEFAULT_PERIODS: ManagerPeriod[] = trimestresCercanos();

// El trimestre anterior al actual: el mas probable de tener datos completos
// para reportar (el actual recien esta en curso).
const DEFAULT_OFFSET_FROM_LAST = 1;
export const DEFAULT_PERIOD_ID =
  DEFAULT_PERIODS[DEFAULT_PERIODS.length - 1 - DEFAULT_OFFSET_FROM_LAST].id;
