import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { AuthService } from "@core/auth/auth.service";
import { ModulosService } from "@core/modulos/modulos.service";

import { moduloPermisoGuard } from "./modulo-permiso.guard";

type RouteLike = Parameters<typeof moduloPermisoGuard>[0];

const ruta = (moduloCodigo?: string): RouteLike =>
  ({ data: moduloCodigo ? { moduloCodigo } : {} }) as unknown as RouteLike;

describe("moduloPermisoGuard", () => {
  let router: Router;

  function configurar(
    rolId: string | null,
    tieneModulo: (codigo: string) => boolean,
  ): void {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            rolId: () => rolId,
            usuario: () => ({ rol: { paginaInicioCodigo: "INICIO" } }),
          } as unknown as AuthService,
        },
        {
          provide: ModulosService,
          useValue: {
            tieneDatos: () => true,
            cargar: jasmine.createSpy("cargar").and.resolveTo(),
            tieneModulo,
            modulos: () => [
              { codigo: "INICIO", estado: 1, tipo: "MENU" },
              { codigo: "PROYECTOS", estado: 1, tipo: "MENU" },
            ],
          } as unknown as ModulosService,
        },
      ],
    });
    router = TestBed.inject(Router);
  }

  it("permite rutas sin moduloCodigo", async () => {
    configurar("rol-1", () => true);
    const resultado = await moduloPermisoGuard(ruta(), {} as never);
    expect(resultado).toBe(true);
  });

  it("redirige a signin cuando no hay rol activo", async () => {
    configurar(null, () => true);
    const resultado = await moduloPermisoGuard(ruta("PROYECTOS"), {} as never);
    expect(router.serializeUrl(resultado as never)).toBe("/signin");
  });

  it("permite el acceso si el rol tiene el modulo", async () => {
    configurar("rol-1", (codigo) => codigo === "PROYECTOS");
    const resultado = await moduloPermisoGuard(ruta("PROYECTOS"), {} as never);
    expect(resultado).toBe(true);
  });

  it("redirige a la pagina de inicio del rol si no tiene el modulo", async () => {
    configurar("rol-1", (codigo) => codigo === "PROYECTOS");
    const resultado = await moduloPermisoGuard(ruta("MODULOS"), {} as never);
    expect(router.serializeUrl(resultado as never)).toBe(
      "/app/operacion/dashboard",
    );
  });
});