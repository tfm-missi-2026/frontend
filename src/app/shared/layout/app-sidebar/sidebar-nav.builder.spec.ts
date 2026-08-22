import type { ModuloResponse } from "@core/modulos/modulo.models";

import { construirNavDesdeModulos } from "./sidebar-nav.builder";

const modulo = (overrides: Partial<ModuloResponse>): ModuloResponse => ({
  id: "uuid",
  codigo: "PROYECTOS",
  nombre: "Proyectos",
  icono: null,
  orden: 1,
  moduloPadreId: null,
  seccion: "OPERACION",
  tipo: "MENU",
  seccionTitulo: "Operacion",
  seccionOrden: 1,
  estado: 1,
  ...overrides,
});

describe("construirNavDesdeModulos", () => {
  it("agrupa items por la seccion (modulo tipo SECTION)", () => {
    const result = construirNavDesdeModulos([
      modulo({
        codigo: "OPERACION",
        nombre: "Operacion",
        seccion: "OPERACION",
        tipo: "SECTION",
      }),
      modulo({ codigo: "PROYECTOS", orden: 1 }),
      modulo({
        codigo: "ASIGNACIONES",
        nombre: "Asignaciones",
        orden: 2,
      }),
      modulo({
        codigo: "SEGUIMIENTO",
        nombre: "Seguimiento",
        seccion: "SEGUIMIENTO",
        tipo: "SECTION",
      }),
      modulo({
        codigo: "BITACORA",
        nombre: "Mi bitacora",
        seccion: "SEGUIMIENTO",
        orden: 1,
      }),
      modulo({
        codigo: "ADMINISTRACION",
        nombre: "Administracion",
        seccion: "ADMINISTRACION",
        tipo: "SECTION",
      }),
      modulo({
        codigo: "USUARIOS",
        nombre: "Usuarios",
        seccion: "ADMINISTRACION",
        orden: 1,
      }),
    ]);

    expect(result.map((s) => s.title)).toEqual([
      "Operacion",
      "Seguimiento",
      "Administracion",
    ]);
    expect(result[0].items.map((i) => i.name)).toEqual([
      "Proyectos",
      "Asignaciones",
    ]);
    expect(result[2].items[0].name).toBe("Usuarios");
  });

  it("los items SUBMENU se muestran como items planos en su seccion", () => {
    const result = construirNavDesdeModulos([
      modulo({
        codigo: "OPERACION",
        nombre: "Operacion",
        seccion: "OPERACION",
        tipo: "SECTION",
      }),
      modulo({ codigo: "PROYECTOS", orden: 1 }),
      modulo({
        id: "sub-variaciones",
        codigo: "VARIACIONES",
        nombre: "Variaciones",
        seccion: "OPERACION",
        tipo: "SUBMENU",
        orden: 2,
      }),
    ]);

    expect(result[0].items.map((i) => i.name)).toEqual([
      "Proyectos",
      "Variaciones",
    ]);
  });

  it("descarta registros inactivos o sin seccion", () => {
    const result = construirNavDesdeModulos([
      modulo({ codigo: "PROYECTOS", estado: 0 }),
      modulo({ codigo: "MODULOS", seccion: "ADMINISTRACION" }),
    ]);
    expect(result[0].items.length).toBe(1);
    expect(result[0].items[0].name).toBe("Modulos");
  });

  it("ordena las secciones por el orden del modulo SECTION", () => {
    const result = construirNavDesdeModulos([
      modulo({
        codigo: "ADMINISTRACION",
        nombre: "Administracion",
        seccion: "ADMINISTRACION",
        tipo: "SECTION",
        orden: 3,
      }),
      modulo({ codigo: "MODULOS", seccion: "ADMINISTRACION" }),
      modulo({
        codigo: "OPERACION",
        nombre: "Operacion",
        seccion: "OPERACION",
        tipo: "SECTION",
        orden: 1,
      }),
      modulo({ codigo: "INICIO", seccion: "OPERACION" }),
      modulo({
        codigo: "SEGUIMIENTO",
        nombre: "Seguimiento",
        seccion: "SEGUIMIENTO",
        tipo: "SECTION",
        orden: 2,
      }),
      modulo({ codigo: "BITACORA", seccion: "SEGUIMIENTO" }),
    ]);

    expect(result.map((s) => s.title)).toEqual([
      "Operacion",
      "Seguimiento",
      "Administracion",
    ]);
  });

  it("mapea iconKey del backend en cada item", () => {
    const result = construirNavDesdeModulos([
      modulo({
        codigo: "OPERACION",
        nombre: "Operacion",
        seccion: "OPERACION",
        tipo: "SECTION",
      }),
      modulo({ icono: "folder" }),
    ]);
    expect(result[0].items[0].iconKey).toBe("folder");
  });

  it("resuelve el path del item desde MODULO_REGISTRY por codigo", () => {
    const result = construirNavDesdeModulos([
      modulo({
        codigo: "OPERACION",
        nombre: "Operacion",
        seccion: "OPERACION",
        tipo: "SECTION",
      }),
      modulo({ codigo: "USUARIOS", seccion: "ADMINISTRACION" }),
    ]);
    expect(result[0].items[0].path).toBe("/app/administracion/usuarios");
  });

  it("omite modulos sin pagina registrada en MODULO_REGISTRY", () => {
    const result = construirNavDesdeModulos([
      modulo({ codigo: "FUTURO", nombre: "Futuro" }),
    ]);
    expect(result).toEqual([]);
  });

  it("usa el titulo de la seccion aunque no exista el modulo SECTION en la lista", () => {
    const result = construirNavDesdeModulos([
      modulo({
        codigo: "USUARIOS",
        seccion: "ADMINISTRACION",
        seccionTitulo: "Administracion",
      }),
    ]);
    expect(result[0].title).toBe("Administracion");
  });
});