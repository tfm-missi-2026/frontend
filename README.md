<<<<<<< Updated upstream
# Frontend — Angular 21 + TailAdmin + pnpm

## Bootstrap inicial (una sola vez)

El frontend se construye a partir del template **TailAdmin Angular**, ajustado
a las versiones que cierra el `Reporte_Stack_Frontend.pdf` (Angular 21.3.18,
pnpm 10.33.0, Tailwind 4.2.2, Angular CDK 20, date-fns 4.1.0).

Esta carpeta contiene únicamente la documentación de arranque y los archivos
**override** que se aplican después del clonado. El clonado en sí lo realiza
el usuario manualmente para mantener el control del flujo de Git.

### Paso 1 — Verificar herramientas

**Versiones requeridas (fijadas por `Reporte_Stack_Frontend.pdf`):**

| Herramienta | Versión          | Notas                                                                                          |
|-------------|------------------|------------------------------------------------------------------------------------------------|
| Node.js     | **20.19.x LTS**  | Soporte LTS hasta abril 2026. No usar Node 22 ni 24 — fuera del stack declarado del TFM.       |
| pnpm        | **10.33.0**      | Cubre CVE-2025-69262 / 69263 / 69264.                                                          |

```powershell
node -v      # debe imprimir v20.19.x
pnpm -v      # debe imprimir 10.33.0
```

Si pnpm no está instalado o está desactualizado:

```powershell
npm install -g pnpm@10.33.0
```

**Si tenés otra versión de Node activa** (por ejemplo Node 22 o 24 para otros proyectos), usá un gestor de versiones (`nvm-windows`, `fnm` o `volta`) y posicioná Node 20.19.x antes de continuar. Con `nvm-windows` en PowerShell:

```powershell
nvm install 20.19.0
nvm use 20.19.0
```

Para evitar tener que tipear `nvm use 20.19.0` cada vez, podés definir una función en tu `$PROFILE` de PowerShell:

```powershell
function nvm-tfm { nvm use 20.19.0 }
```

Después con `nvm-tfm` cambiás la versión activa de la consola en un único comando.

> Nota: `pnpm` queda asociado a la versión de Node activa en nvm-windows. Si cambiás a otra versión de Node en otra consola y `pnpm -v` no responde, reinstalalo con `npm install -g pnpm@10.33.0` en esa consola.

### Paso 2 — Clonar el template TailAdmin

Desde una terminal posicionada en `Development/`:

```bash
git clone https://github.com/TailAdmin/free-angular-tailwind-dashboard.git tailadmin-temp
# mover el contenido del clon a Frontend/ (preservando overrides/ y este README)
robocopy tailadmin-temp Frontend /E /MOVE /XF README.md /XD overrides
# si quedó tailadmin-temp vacío:
rmdir tailadmin-temp
```

> En macOS/Linux: `rsync -av --exclude='Frontend/README.md' tailadmin-temp/ Frontend/`
> y luego `rm -rf tailadmin-temp`.

### Paso 3 — Aplicar los overrides

```bash
cd Frontend
# Reemplazar configuración PostCSS y entry CSS con los archivos de overrides/
cp overrides/.postcssrc.json .
cp overrides/pnpm-workspace.yaml .
cp overrides/src/styles.css src/styles.css
```

### Paso 4 — Forzar las versiones del stack

```bash
pnpm add @angular/animations@21.0.0 @angular/common@21.0.0 \
         @angular/compiler@21.0.0 @angular/core@21.0.0 \
         @angular/forms@21.0.0 @angular/platform-browser@21.0.0 \
         @angular/platform-browser-dynamic@21.0.0 @angular/router@21.0.0 \
         @angular/cdk@21 rxjs@^7.8.0 \
         tailwindcss@4.2.2 @tailwindcss/postcss@4.2.2 postcss@^8.5.9 \
         date-fns@4.1.0

pnpm add -D @angular/cli@21.0.0 @angular/compiler-cli@21.0.0 typescript@~5.8.0
```

### Paso 5 — Instalación limpia y arranque

```bash
pnpm install
pnpm audit          # revisar advertencias CVE; comparar contra el PDF
pnpm start          # o `pnpm ng serve`
```

`http://localhost:4200` debe mostrar la home de TailAdmin.

### Paso 6 — Limpieza inicial (opcional pero recomendado)

Antes de M5 conviene eliminar del template las páginas demo que no se van a
usar (ecommerce, calendar, profile, charts demo, blank). Mantener únicamente
el layout principal, sidebar y la página de login.

## Estructura objetivo después del clonado

```
Frontend/
├── package.json                # versiones fijadas según paso 4
├── pnpm-lock.yaml              # commiteado al repo
├── pnpm-workspace.yaml         # con allowBuilds: esbuild, sharp
├── .postcssrc.json
├── angular.json
├── tsconfig.json
├── overrides/                  # se conserva como referencia
└── src/
    ├── styles.css              # `@import "tailwindcss";`
    └── app/
        ├── core/               # interceptors, guards, services
        ├── shared/             # ui-shell, ui-page-header, ui-card, ui-table…
        └── features/
            ├── auth/
            ├── usuarios/
            ├── proyectos/
            └── planificacion-seguimiento/
```

## Notas de seguridad (del Reporte_Stack_Frontend.pdf)

- **CVE-2025-66035** (XSRF en `@angular/common` < 20.3.14) → al fijar 21.0.0
  queda cubierto. Evitar URLs con `//` en el código.
- **CVE-2025-59052** (fuga SSR en `@angular/ssr` < 20.3.0) → no aplica porque
  estamos en CSR, pero la versión 21.0.0 ya está por encima del parche.
- **CVE-2025-69262 / 69263 / 69264** (pnpm < 10.27.0) → pnpm 10.33.0 las cubre.
- `pnpm-workspace.yaml` declara `onlyBuiltDependencies: [esbuild, sharp]`
  como hardening de supply chain.
=======
>>>>>>> Stashed changes
