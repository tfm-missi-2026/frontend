# Frontend — Angular 21 + TailAdmin + pnpm

## Bootstrap inicial (una sola vez)

El frontend se construye a partir del template **TailAdmin Angular**, ajustado al stack
del proyecto: Angular 21.2, Angular CDK 21.2, Tailwind 4.3, date-fns 4.3, TypeScript 5.9
y Storybook 10.4.

Esta carpeta contiene únicamente la documentación de arranque y los archivos
**override** que se aplican después del clonado. El clonado en sí lo realiza
el usuario manualmente para mantener el control del flujo de Git.

### Paso 1 — Verificar herramientas

**Versiones requeridas:**

| Herramienta | Versión     | Fuente en el repo                          |
| ----------- | ----------- | ------------------------------------------ |
| Node.js     | **24.18.0** | `.nvmrc`                                   |
| pnpm        | **11.3.0**  | campo `packageManager` del `package.json`  |

```powershell
node -v      # debe imprimir v24.18.0
pnpm -v      # debe imprimir 11.3.0
```

pnpm se obtiene con **corepack**, incluido con Node. Se habilita una sola vez:

```powershell
corepack enable
```

Con corepack activo, `pnpm` usa automáticamente la versión declarada en `packageManager`,
sin instalación global ni sincronización manual.

**Gestor de versiones de Node.** El repo fija la versión en `.nvmrc`, que leen tanto
`nvm-windows` como `fnm`. Con **fnm**, conviene activar el cambio automático al entrar a la
carpeta agregando esta línea al `$PROFILE` de PowerShell:

```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

En Git Bash, la equivalente en `~/.bashrc`:

```bash
eval "$(fnm env --use-on-cd --shell bash)"
```

Con eso configurado, `fnm install` sin argumentos instala la versión que indica el `.nvmrc`,
y `node -v` devuelve `v24.18.0` al posicionarse en la carpeta del proyecto.

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
pnpm add @angular/animations@^21.2 @angular/common@^21.2 \
         @angular/compiler@^21.2 @angular/core@^21.2 \
         @angular/forms@^21.2 @angular/platform-browser@^21.2 \
         @angular/platform-browser-dynamic@^21.2 @angular/router@^21.2 \
         @angular/cdk@^21.2 rxjs@~7.8.2 \
         tailwindcss@^4.3.0 @tailwindcss/postcss@^4.3.0 postcss@^8.5.9 \
         date-fns@^4.3.0

pnpm add -D @angular/cli@^21.2 @angular/compiler-cli@^21.2 typescript@~5.9.3
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

## Notas de seguridad

- **CVE-2025-66035** (XSRF en `@angular/common` < 20.3.14) → Angular 21.2 queda
  por encima del parche. Evitar URLs con `//` en el código.
- **CVE-2025-59052** (fuga SSR en `@angular/ssr` < 20.3.0) → no aplica porque
  el frontend es CSR, y Angular 21.2 está por encima del parche.
- **CVE-2025-69262 / 69263 / 69264** (pnpm < 10.27.0) → pnpm 11.3.0 las cubre.
- `pnpm-workspace.yaml` declara `onlyBuiltDependencies: [esbuild, sharp]`
  como hardening de supply chain.
