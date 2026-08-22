import { routes } from "@app/app.routes";
import { extractPathsFromRoutes } from "@core/routes";

import { MODULO_REGISTRY, type ModuloCodigo } from "./modulo.registry";

function recolectarModuloCodigos(routeList: typeof routes): Set<string> {
  const codigos = new Set<string>();
  const walk = (rs: typeof routes): void => {
    for (const r of rs) {
      const codigo = r.data?.["moduloCodigo"];
      if (codigo) codigos.add(String(codigo));
      if (r.children) walk(r.children);
    }
  };
  walk(routeList);
  return codigos;
}

describe("MODULO_REGISTRY", () => {
  const rutasSpa = extractPathsFromRoutes(routes);

  it("cada path del registry existe entre las rutas de app.routes.ts", () => {
    for (const registro of Object.values(MODULO_REGISTRY)) {
      expect(rutasSpa.has(registro.path))
        .withContext(`path sin ruta: ${registro.path}`)
        .toBe(true);
    }
  });

  it("cada ruta protegida declara un moduloCodigo valido en el registry", () => {
    const codigos = recolectarModuloCodigos(routes);
    expect(codigos.size).toBeGreaterThan(0);
    for (const codigo of codigos) {
      expect(MODULO_REGISTRY[codigo as ModuloCodigo])
        .withContext(`codigo sin registro: ${codigo}`)
        .toBeDefined();
    }
  });
});