# Reglas del proyecto `tfm-frontend`

Convenciones que aplican a todo el código Angular de este workspace.
Lo que está aquí escrito **prevalece** sobre cualquier default del agente.

> Si una decisión contradice este archivo, este archivo gana.
> Si hay ambigüedad, preguntar antes de implementar.

---

## 1. Stack obligatorio

- **Angular 21+** con componentes **standalone** (sin `NgModule` salvo
  para `RoutingModule` de features).
- **Tailwind CSS** para todo styling.
- **TypeScript estricto** (`pnpm exec tsc --noEmit -p tsconfig.app.json`).

---

## 2. Signals para todo

**Prohibido** en código nuevo:

| Concepto | Prohibido | Usar en su lugar |
|---|---|---|
| Inputs | `@Input()` decorator | `input<T>()` signal |
| Outputs | `@Output()` + `EventEmitter` | `output<T>()` signal |
| Estado interno | `BehaviorSubject`, `Subject` | `signal<T>()` |
| Estado derivado | getter, pipe manual | `computed<T>()` |
| Side effects | lifecycle hooks | `effect()` |
| Change detection manual | `ChangeDetectorRef.detectChanges()` | signals + `OnPush` |
| Control flow viejo | `*ngIf`, `*ngFor`, `*ngSwitch` | `@if`, `@for`, `@switch` |

**Excepciones a `effect()` / lifecycle hooks** (cuando no haya
alternativa signal):

- `ControlValueAccessor` (necesita `ngOnInit`/`ngOnDestroy`).
- `OnDestroy` para cleanup. Usar `inject(DestroyRef).onDestroy(...)`.

Forma correcta:

```ts
@Component({
  selector: "UiMiComponente",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./mi-componente.component.html",
})
export class UiMiComponenteComponent {
  readonly variant = input<MiVariant>("primary");
  readonly disabled = input<boolean>(false);
  readonly valueChange = output<string>();

  readonly containerClasses = computed<string>(() =>
    [/* ... */].join(" "),
  );
}
```

Forma prohibida:

```ts
// ❌ NO
@Component({ ... })
export class UiMiComponente {
  @Input() variant: MiVariant = "primary";
  @Output() valueChange = new EventEmitter<string>();
}
```

---

## 3. Estructura de archivos por componente

Cada componente vive en su propia carpeta bajo `shared/ui/<nombre>/`:

```
shared/ui/<nombre>/
  <nombre>.component.ts        # clase, decorador, lógica
  <nombre>.component.html      # template
  <nombre>.component.spec.ts   # tests (cuando aplique)
  <nombre>.types.ts            # tipos/interfaces del componente
  <nombre>.utils.ts            # helpers puros (sin DI)
  index.ts                     # barrel público: { Component, ...types }
```

**Reglas**:

- HTML y TS van en **archivos separados**. Nada de `template:` inline
  en el decorador.
- El barrel `index.ts` es el único punto de entrada. Los consumers
  importan desde `@shared/ui/<nombre>`, nunca del archivo interno.
- Tipos públicos (`*types.ts`) se exportan desde el barrel.
- `*.utils.ts` solo para funciones puras. Si necesita DI, va en el
  `.component.ts`.

---

## 4. Design system: usar siempre primitivas de `@shared/*`

**Nunca** escribas HTML crudo con clases Tailwind para una primitiva que ya
existe en `@shared/ui` o `@shared/common`. Esta es la regla más importante
del repositorio.

### Primitivas de layout

| Necesito… | Uso | NO uso |
|---|---|---|
| Flex con dirección, gap, align, justify | `UiFlex` | `<div class="flex flex-col gap-4">` |
| Grid de columnas | `UiGrid` | `<div class="grid grid-cols-2">` |
| Wrapper estructural sin estilo visual | `<div>` con clases de **solo layout** (`flex`, `grid`, `relative`, `absolute`, `h-full`, `w-full`) | `<div>` con `class="bg-white p-4 rounded"` |

### Primitivas visuales

| Necesito… | Uso | NO uso |
|---|---|---|
| Tipografía, texto, énfasis | `UiLabel` | `<p>`, `<span>`, `<strong>` con Tailwind |
| Botón | `UiButton` | `<button>` con `class="bg-…"` |
| Enlace navegable | `UiLink` | `<a>` con clases de color |
| Input de texto/email/password | `UiInput` | `<input>` con clases crudas |
| Checkbox | `UiInput` con `type="checkbox"` | `<input type="checkbox">` |
| Form (contenedor de submit) | `UiForm` | `<form>` crudo |
| Label de form | `UiFormLabel` | `<label>` con clases |
| Banner contextual inline (info/error/éxito/warning) | `UiAlert` | `<div class="bg-error-50 border-error-200 …">` |
| Notificación flotante | `UiToast` | `<div class="fixed top-4 …">` |
| Modal / diálogo | `UiModal` | `<div class="fixed inset-0 …">` |
| Imagen decorativa | `UiImage` | `<img>` con clases Tailwind |
| Icono | `UiIcon` + primitivas en `@shared/icons` | `<svg>` inline con clases |
| Tooltip | `UiTooltip` | divs absolutos con Tailwind |
| Tabla | `UiTable` | `<table>` con clases |
| Tarjeta (padding + borde + fondo + sombra) | `UiCard` o `UiSurface` | `<div class="rounded-lg border bg-white p-4 shadow">` |
| Solo contenedor con variante semántica (sin sombra) | `UiSurface` | `<div class="bg-error-100 border-error-500 …">` |
| Toggle de tema | `CommonThemeToggle` (`@shared/common/theme-toggle`) | botón custom con ícono sol/luna |
| Fondo decorativo de grid | `CommonGridShape` (`@shared/common/grid-shape`) | SVGs posicionados a mano |

### `UiSurface` vs `UiCard` vs `UiFlex`

- `UiSurface`: contenedor **visual** con variante semántica
  (success/error/warning/info) + padding + border. NO hace layout.
- `UiCard`: similar a `UiSurface` pero con sombra y radio. Más
  "elevado". NO hace layout.
- `UiFlex`: contenedor de **layout** flex. NO tiene colores
  semánticos.

**`UiSurface` nunca reemplaza al `<div>` cuando el `<div>` sirve
para layout.** Si necesitás ambos (color + flex), componé:
`UiFlex > UiSurface > contenido` o `UiSurface > UiFlex > contenido`.

### Excepciones permitidas (HTML crudo)

Solo en estas situaciones, con clases **únicamente de layout
estructural**:

- **Layouts**: `<div>` sin clases (para `router-outlet`, slots, wrappers),
  o con clases Tailwind de **layout estructural** (`flex`, `grid`,
  `relative`, `absolute`, `inset-0`, `z-*`, `min-h-screen`, `h-full`,
  `w-full`, `overflow-hidden`, `pointer-events-none`, responsive `sm:`,
  `lg:`, etc.).
- **`<form>`**: solo como contenedor HTML real del submit. El contenido
  del form se construye con `UiInput`, `UiButton`, etc.
- **`<button type="submit">`**: solo lo emite `UiButton` cuando
  `isSubmit="true"`. Nunca a mano.
- **Iconos SVG inline** dentro de un componente `@shared/icons/*` ya
  existente. Si necesitas un icono nuevo, créalo en `@shared/icons/`.
- **Prohibido** en HTML crudo: `bg-*`, `text-*`, `font-*`,
  `rounded-*`, `shadow-*`, `border-*` (cuando tienen valor visual,
  no de layout), `p-*`, `m-*`, `gap-*`, `space-*`, `uppercase`,
  `italic`.

### Cómo detectar violaciones

Antes de cerrar un cambio, busca en los archivos tocados:

```bash
# En *.html: raw HTML visual con Tailwind
grep -nE '<(button|a|p|span|strong|div)[^>]*(class=.*\b(bg-|text-[a-z]+-[0-9]|font-(bold|medium|semibold)|rounded-(md|lg|xl|full)|shadow-(sm|md|lg)|border-[a-z])' src/

# En *.html: <input> o <button> directos (no deberían existir fuera de shared/ui)
grep -nE '<(input|button|select|textarea)( |>)' src/app/features src/app/pages 2>/dev/null
```

Si aparece un hit, hay que migrar a la primitiva correspondiente.

---

## 5. Tokens semánticos, no colores hardcoded

- Tipografía/colores vía `@styles/constants`, `@styles/types/colors`,
  `@styles/types/typography`.
- No hardcodear `text-brand-500` si existe un token semántico
  (`textAction`, `textError`, `textSuccess`, `textWarning`,
  `textStrong`, `textWeak`, `textWeakest`).
- Cada primitiva aplica color vía `[class]="classes()"` computado,
  **nunca** vía `style.color` (bloquearía las variantes `dark:`).

---

## 6. Layout: alineación vertical entre columnas

Cuando un layout tenga **dos columnas lado a lado** (form + imagen, sidebar
+ content, etc.), ambas deben estar **verticalmente alineadas a la misma
altura lógica**. El caso canónico es `AuthLayoutComponent`:

- La columna del contenido va con `flex items-center justify-center` para
  que su hijo quede centrado vertical y horizontalmente.
- La columna decorativa (imagen, illustration, grid) también usa
  `flex`/`grid` con `items-center` (o `grid place-items-center`).
- El contenedor padre usa `lg:flex-row` con `items-stretch` (default) y
  `h-screen` / `min-h-screen` para que ambas columnas midan lo mismo.
- **Nunca** dejes una columna con `flex-1 w-full` sin `flex` propio: su
  hijo se quedará pegado al top y la columna decorativa quedará
  desfasada al centro (especialmente visible cuando aparece un
  `UiAlert` que cambia la altura del form).

Anti-patrón conocido: envolver el contenido en un `UiFlex justify-center`
anidado sin darle altura al padre — el centrado no surte efecto y el
hijo se pega arriba.

---

## 7. Convenciones de código Angular

- **Standalone components** en todos los archivos nuevos. Sin `NgModule`
  salvo para `RoutingModule` de features (`AuthRoutingModule`,
  `CoreRoutingModule`, etc.).
- **API signal-based** (`input()`, `output()`, `signal()`, `computed()`,
  `effect()`). Nada de `@Input()` / `@Output()` decorators ni
  `EventEmitter` en código nuevo.
- **`ChangeDetectionStrategy.OnPush`** en todos los componentes.
- **Sin NgClass / NgStyle**: las variantes se aplican vía
  `[class]="classes()"` computado. Las primitivas ya lo hacen así.
- **Host class** vía `host: { class: "..." }` cuando el componente
  necesita estilos propios. Si es `display: contents`, declararlo
  explícitamente (`host: { class: "contents" }`).
- **Imports** desde los barrel `@shared/...` / `@core/...` / `@app/...`
  configurados en `tsconfig.json`, **no** paths relativos largos.
- **Tipografía/colores** vía los tokens `@styles/constants`,
  `@styles/types/colors`, `@styles/types/typography`. No hardcodear
  clases `text-brand-500` si existe un token semántico
  (`textAction`, `textError`, etc.).

---

## 8. Imports disciplinados

- Usar los barrel aliases de `tsconfig.json`: `@shared/...`,
  `@core/...`, `@app/...`.
- **Prohibido** importar archivos internos directamente
  (`@shared/ui/button/button.component`). Usar el barrel
  (`@shared/ui/button`).
- **Prohibido** paths relativos largos (`../../features/auth/...`).
  Usar el alias del feature.
- `import type { ... }` para tipos. `import { ... }` para valores.

---

## 9. Red, reintentos y loops: nunca bombardear al backend

**Prohibido**:

- Reintentos infinitos o `while`/`setInterval` que repitan requests.
  Todo reintento debe ser **finito** (`httpRetryCount`) y con **backoff**
  (espera mínima de 5s), nunca inmediato en cadena.
- Llamar a una API dentro de un `computed()` o en un `effect()` que
  dependa de señales que esa misma llamada modifica — eso produce un
  loop: la llamada setea una signal, el `computed()`/`effect()` se
  reevalúa y vuelve a llamar. Las cargas HTTP se disparan una sola vez
  (`ngOnInit` / constructor / evento de usuario), nunca desde un
  derivado reactivo.
- Efectos que se auto-disparan (`effect(() => void servicio.cargar())`
  sin guard de idempotencia). Si es inevitable, proteger con
  `if (loading()) return` + cache por clave (ej. `_rolActivo` en
  `ModulosService`) + `count() > 0` antes de re-consultar.
- Hacer N peticiones idénticas en paralelo desde varios componentes.
  Los datos compartidos viven en un servicio singleton con cache; los
  componentes consumen la signal, no disparan su propia carga.
- Loggear o reintentar errores de red (status 0) como si fueran
  errores de negocio. El `retryInterceptor` (espera 5s, max
  `httpRetryCount`) reintenta solo lecturas; el `errorInterceptor`
  muestra **un** toast "Sin conexión" cuando se agotan los reintentos.
  No duplicar ese toast en los services.

**Regla de oro**: si ante una falla de red se ven más de 1 request por
endpoint en DevTools, el código está mal. El flujo correcto es:
1 request → espera 5s → 1 reintento → toast "Sin conexión" → stop.

---

## 10. Naming conventions

- Selectores con prefijo semántico: `Ui*` para primitivas de
  `@shared/ui`, `Common*` para `@shared/common`, sin prefijo para
  componentes de feature (`SigninForm`, `ManagerDashboardPage`).
- Archivos en kebab-case con sufijo de rol: `*.component.ts`,
  `*.component.html`, `*.component.spec.ts`, `*.types.ts`,
  `*.utils.ts`, `*.service.ts`, `*.guard.ts`.
- Clases en `PascalCase` con sufijo de rol: `UiButtonComponent`,
  `UiToastComponent`, `AuthService`, `SignInComponent`.
- Signals en `camelCase`, sin prefijo (`loading`, `errorMessage`).
- Outputs (`output<T>()`) en `camelCase`, sin sufijo `Change`
  (`dismissed`, `submitForm`).

---

## 11. Light / dark mode: cualquier cambio visual debe sobrevivir al toggle de tema

**Regla**: al modificar un componente de `@shared/ui*` o cualquier cosa
visual (clases de color, tipografía, backgrounds, borders, sombras,
estados de focus/hover/disabled), **asumir que el componente se ve en
ambos temas** y validar mentalmente las dos variantes antes de cerrar
el cambio. No dar por hecho que un color "siempre será X" porque en
light funciona — en dark puede invertirse, perderse contraste o
desaparecer texto.

### Decisiones que requieren validación en ambos temas

- **Color de texto** sobre un background fijo: si el texto depende de
  `color: textStrong` (gray-800 light / white dark) sobre un fondo que
  es siempre `brand-500`, el contraste falla en light. Usar
  `text-current` para heredar el color del padre, o exponer el color
  semántico vía prop.
- Una primitiva cuyo color de texto sale del wrapper (`text-current`)
  debe declarar explícitamente esa decisión.
- **Borders y outlines**: las primitivas que muestran `border` con
  color semántico deben incluir su contraparte `dark:`.
- **Sombras (`shadow-*`)**: muchas sombras no son visibles en dark
  mode porque el fondo ya es oscuro. Considerar `dark:`.
- **Estados focus / hover / disabled**: validar que el cambio de
  contraste sigue siendo WCAG-AA en ambos temas.
- **Loading states** (progress bars, spinners): un `bg-current` o
  `text-white` sin variante dark puede quedar invisible si el wrapper
  cambia su `color` en dark mode.

### Cómo verificarlo

- Hay un `CommonThemeToggle` en `AuthLayout` (esquina inferior
  derecha). Levantá `ng serve`, hacé click en él y revisá el cambio en
  light y dark.
- Si tocás `styles.css`, agregás tokens nuevos o cambiás clases de
  cualquier primitiva de `@shared/ui/*`, este toggle es el smoke test
  mínimo. No cerrar el cambio sin haberlo clickeado al menos una vez.

---

## 12. Mensajes de commit

Heredado del `AGENTS.md` raíz (§Reglas de git):

- **Nunca** agregar `Co-Authored-By` ni atribuir coautoría a herramientas
  de IA en los commits.
- Mensajes claros y específicos. Si un commit toca varios temas,
  título conciso + cuerpo con el detalle.

---

## 13. Antes de cerrar cualquier cambio

Checklist mínimo:

1. `pnpm exec tsc --noEmit -p tsconfig.app.json` sin errores.
2. Si tocaste HTML: ejecutar el grep de la §4 y resolver hits.
3. Si tocaste un layout con columnas: verificar alineación vertical
   con y sin contenido variable (ej. con y sin `UiAlert`).
4. **Si tocaste algo visual**: togglear el tema con `CommonThemeToggle`
   y verificar light + dark.
5. Si agregaste una primitiva nueva en `@shared/ui/*`:
   - Exportarla desde su `index.ts`.
   - Spec (`*.spec.ts`) cuando aplique.
   - Tipos en `*.types.ts` exportados.
6. `pnpm build` limpio, sin warnings de template/AOT.
7. **Si tocaste red**: verificar en DevTools que ante una caída del
   backend no haya más de 1 reintento por endpoint (ver §9).

---

## 14. Navegación y sidebar (híbrido frontend ↔ backend)

**Regla de oro**: el **frontend** define las rutas reales
(`app.routes.ts`: URL → componente lazy, guards, titles) y el **backend**
define el menú y la visibilidad por rol (`GET /api/modulos/por-rol/{rolId}`
sobre `msa_modulo`, con RBAC por `msa_rol_modulo`). El puente entre ambos
es el **`codigo`** del módulo, nunca la ruta.

- `MODULO_REGISTRY` (`@core/modulos/modulo.registry.ts`) es la **única
  fuente de navegabilidad**: mapea `codigo → path`. Los módulos cuyo
  `codigo` no está en el registry se omiten del sidebar (con `console.warn`
  en dev).
- `sidebar-nav.builder.ts` agrupa por sección (`tipo: "SECTION"`) y
  resuelve cada item por `codigo`, **no** por un campo `ruta` del backend
  (ese campo ya no existe en `msa_modulo`).
- Cada ruta protegida de `app` declara `data: { moduloCodigo }` y un
  `canMatch: [moduloPermisoGuard]`. El guard asegura que los módulos del
  rol estén cargados (`ModulosService.cargar`) y bloquea el acceso si el
  rol no tiene el módulo (`fail-closed` → redirige a la página de inicio
  del rol, nunca a una pantalla "sin acceso").
- **Página de inicio por rol**: `msa_rol.pagina_inicio_id` (referencia a
  `msa_modulo`) se configura en la UI de Roles (select obligatorio). El
  `landingGuard` (ruta raíz de `/app`) resuelve `codigo → path` vía
  `MODULO_REGISTRY`; `computarRutaLanding` es el helper compartido con
  el guard de permisos y el CTA de las páginas stub. La página de inicio
  siempre queda otorgada al rol (auto-RBAC al guardar) y no se puede
  quitar desde la matriz de permisos ni deshabilitar el módulo.
- **Al agregar una página nueva**: (1) crear la feature y su ruta en
  `app.routes.ts` con `data.moduloCodigo`; (2) registrar el `codigo` en
  `MODULO_REGISTRY`; (3) si el módulo no existe en la BD, crearlo vía la
  feature `administracion/modulos`. El spec `modulo.registry.spec.ts`
  valida la consistencia registry ↔ rutas.
- `extractPathsFromRoutes` (`@core/routes`) se usa solo en specs para
  validar que los paths del registry existen en el router.
