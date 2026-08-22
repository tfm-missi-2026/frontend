import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { AuthService } from "@core/auth/auth.service";
import { ModulosService } from "@core/modulos/modulos.service";

import { landingGuard } from "./landing.guard";

describe("landingGuard", () => {
  let router: Router;

  function configurar(
    rolId: string | null,
    paginaInicioCodigo: string | null,
    modulos: { codigo: string; estado?: number; tipo?: string }[],
  ): void {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            rolId: () => rolId,
            usuario: () => ({ rol: { paginaInicioCodigo } }),
          } as unknown as AuthService,
        },
        {
          provide: ModulosService,
          useValue: {
            tieneDatos: () => modulos.length > 0,
            cargar: jasmine.createSpy("cargar").and.resolveTo(),
            modulos: () => modulos,
          } as unknown as ModulosService,
        },
      ],
    });
    router = TestBed.inject(Router);
  }

  it("redirige a signin cuando no hay rol activo", async () => {
    configurar(null, "INICIO", []);
    const resultado = await landingGuard({} as never, {} as never);
    expect(router.serializeUrl(resultado as never)).toBe("/signin");
  });

  it("redirige a la pagina de inicio configurada del rol", async () => {
    configurar("rol-1", "PROYECTOS", [
      { codigo: "PROYECTOS", estado: 1, tipo: "MENU" },
    ]);
    const resultado = await landingGuard({} as never, {} as never);
    expect(router.serializeUrl(resultado as never)).toBe(
      "/app/operacion/proyectos",
    );
  });

  it("cae a la primera pagina implementada si el rol no tiene landing", async () => {
    configurar("rol-1", null, [
      { codigo: "BITACORA", estado: 1, tipo: "MENU" },
      { codigo: "AVANCE", estado: 1, tipo: "MENU" },
    ]);
    const resultado = await landingGuard({} as never, {} as never);
    expect(router.serializeUrl(resultado as never)).toBe(
      "/app/seguimiento/mi-bitacora",
    );
  });
});