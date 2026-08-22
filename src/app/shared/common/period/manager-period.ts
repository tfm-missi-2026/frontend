export interface ManagerPeriod {
  id: string;
  label: string;
  startIso: string;
  endIso: string;
}

function trimestresCercanos(): ManagerPeriod[] {
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const trimestreActual = Math.floor(mesActual / 3);
  const anio = hoy.getFullYear();

  const rangos = [1, 0, 2].map((offset) => {
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
    return {
      id: `${y}-q${tAbs + 1}`,
      label: `${nombreTrimestre} ${y} · ${mesInicio}–${mesFin}`,
      startIso: `${y}-${mesInicio}-01`,
      endIso: `${y}-${mesFin}-${String(finDia).padStart(2, "0")}`,
    };
  });

  return rangos;
}

export const DEFAULT_PERIODS: ManagerPeriod[] = trimestresCercanos();

export const DEFAULT_PERIOD_ID = DEFAULT_PERIODS[0].id;
