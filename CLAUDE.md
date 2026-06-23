# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Regla crítica

Nunca generar comentarios decorativos.

Prohibido:

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

// ===== Helpers =====

Permitido:

// Helpers

## Project Overview

This is the frontend for a Master's thesis (TFM) project, built as an Angular 21 application bootstrapped from the **TailAdmin Angular** template. The codebase is being progressively refactored from the original TailAdmin structure (pages/components folders) to a **feature-based architecture** (auth, users, etc.) backed by a custom **design system** (DS).

The user-defined workflow rules in `~/.claude/CLAUDE.md` apply here: keep comments brief and meaningful, run `lint` and `build` after changes, **never** run tests/typecheck automatically (only when explicitly requested), and always use `pnpm` for commands.

## Stack & Versions

- **Node.js** 20.19.x LTS (do not use Node 22/24)
- **pnpm** 10.33.0 (CVE hardening)
- **Angular** 21.2.x with standalone components, signals, control-flow blocks (`@if/@for`)
- **Tailwind CSS** 4.3.x (PostCSS plugin)
- **TypeScript** 5.9.x with `strict: true`, `strictTemplates: true`
- **Storybook** 10.4.x for DS documentation
- **ApexCharts / ng-apexcharts**, **amCharts 5**, **FullCalendar**, **Swiper**, **ngx-toastr** for visualizations and UI

## Common Commands

All commands must be run with `pnpm` (per global rules).

```bash
pnpm dev                       # ng serve, dev server on http://localhost:4200
pnpm build                     # production build (default config)
pnpm watch                     # development build in watch mode
pnpm test                      # ng test (Karma) — only when explicitly requested
pnpm storybook                 # launch Storybook on :6006
pnpm build-storybook           # build static Storybook to dist/storybook/static
pnpm ng <command>              # passthrough to Angular CLI
```

After modifying code, the user expects you to run `pnpm build` (lint and typecheck are not separate scripts — `build` is the validation step). Tests, `typecheck`, and Storybook smoke tests are **not** run automatically.

## Directory Layout

```
src/
├── main.ts                          # bootstrapApplication + Swiper registration
├── index.html
├── styles.css                       # @import "tailwindcss"; global styles
├── stories/                         # Storybook *.stories.ts for DS primitives
└── app/
    ├── app.component.ts             # root, hosts <router-outlet>
    ├── app.config.ts                # provideZoneChangeDetection + provideRouter
    ├── app.routes.ts                # top-level routes (lazy auth, eager app)
    ├── core/                        # (reserved) interceptors, guards, app-level services
    ├── features/                    # feature modules (auth, users, …)
    │   └── auth/
    │       ├── auth.module.ts       # NgModule shell (re-exports AuthRoutingModule)
    │       ├── auth-routing.module.ts
    │       ├── pages/               # route components (sign-in, sign-up)
    │       ├── components/          # feature-local components (signin-form, signup-form)
    │       ├── services/            # (reserved) auth API services
    │       └── models/              # (reserved) feature DTOs / interfaces
    ├── pages/                       # legacy TailAdmin demo pages (to be removed per README)
    ├── shared/
    │   ├── ui/                      # design system primitives (see "Design System")
    │   ├── icons/                   # standalone icon components + barrel index.ts
    │   ├── layout/                  # AppLayoutComponent, AuthLayoutComponent, AppHeader, AppSidebar, Backdrop
    │   ├── components/              # common widgets (theme-toggle, grid-shape, header dropdowns…)
    │   ├── services/                # SidebarService (BehaviorSubject state), ModalService, ThemeService
    │   └── pipe/                    # SafeHtmlPipe
    ├── styles/
    │   ├── constants.ts             # designConstants default export (typography + colors)
    │   └── types/                   # colors.ts, typography.ts
    └── utils/                       # styling.ts (getFocusStyling), type-helpers.ts (TransientProps)
```

## Path Aliases (tsconfig.json)

The following path mappings are configured and are the **preferred** way to import:

- `@core/*` → `./src/app/core/*`
- `@shared/*` → `./src/app/shared/*`
- `@features/*` → `./src/app/features/*`
- `@layout/*` → `./src/app/layout/*`
- `@styles/*` → `./src/app/styles/*`
- `@utils/*` → `./src/app/utils/*`
- `@env/*` → `./src/environments/*`

Always use these aliases in new code instead of deep relative paths.

## Design System Conventions

The DS lives under `src/app/shared/ui/` with **one folder per primitive**. Each primitive exposes a public API through an `index.ts` barrel.

Key conventions visible across `ui/button`, `ui/modal`, `ui/tooltip`, etc.:

- **Standalone components** with `OnPush` change detection and signal-based `input()` / `output()`.
- One folder per primitive containing: `*.component.ts`, `*.component.html` (or inline `template:`), `types.ts` (props/interfaces), `variants.ts` (class-string builders), `*.component.spec.ts`, `index.ts` (barrel re-export).
- Selectors follow the `Ui*` pattern (e.g. `UiButton`, `UiInput`, `UiModal`, `UiFlex`, `UiHeader`).
- Tailwind classes are composed via helper functions in `variants.ts` (mirroring the React project's `getVariantClasses` pattern). Use `getFocusStyling()` from `@utils/styling` for the focus outline.
- Icon components (`@shared/icons`) are standalone with signal inputs (`size`, `color`, `className`, `dataTestId`, `style`) — they are passed to slots like `LeftIcon`/`RightIcon` as `Type<unknown>` and rendered via `NgComponentOutlet` (see `ui/button/types.ts`).
- Typography & colors come from `@styles/constants` (re-exports `ColorType`, `TypographyType`, `FontWeightType`).

## Feature Architecture

Features are being introduced under `src/app/features/<name>/` with a consistent structure:

```
features/<name>/
├── <name>.module.ts                # NgModule shell (currently just re-exports the routing module)
├── <name>-routing.module.ts        # RouterModule.forChild(routes)
├── pages/                          # route components (one folder per route)
│   └── sign-in/
│       ├── sign-in.component.ts    # standalone + OnPush
│       └── sign-in.component.html  # composes AuthLayout + <feature>-form
├── components/                     # feature-local presentational components
│   └── signin-form/
│       ├── signin-form.component.ts
│       └── signin-form.component.html
├── services/                       # feature API / state services (reserved)
└── models/                         # feature DTOs and interfaces (reserved)
```

Pattern to follow when adding a feature:

1. Create a `pages/<route>/` with a standalone `OnPush` component that imports the appropriate `Layout` component and a feature-local form/widget component.
2. The form component should hold local form state with `signal()` and expose `output()` emitters (`submitForm`, `signUpRequested`, etc.) — it must not perform navigation or call services directly. The page component handles routing and (future) service calls.
3. The page uses `Router.navigateByUrl` for navigation. Form submit handlers in pages currently `console.log` — wire them to a service when the backend is available.
4. Register the feature in `app.routes.ts` via `loadChildren: () => import('./features/<name>/<name>.module').then(m => m.<Name>Module)`.

## Auth Feature Reference Implementation

The `auth` feature is the canonical example of the new architecture:

- `AuthModule` (`features/auth/auth.module.ts`) is a thin `NgModule` whose only job is to re-export `AuthRoutingModule`.
- `AuthRoutingModule` declares routes for `signin` (default redirect) and `signup`, each with a `title:` for the document title.
- `SignInComponent` / `SignUpComponent` are `OnPush` standalone pages. Their templates are 3 lines: an `AuthLayout` wrapper containing the corresponding form component with `(submitForm)` and navigation request outputs.
- `SigninFormComponent` / `SignupFormComponent` build their UI **exclusively from DS primitives** (`UiFlex`, `UiHeader`, `UiLabel`, `UiInput`, `UiButton`, `UiLink`, `UiGrid`). They hold form state in `signal()` fields, expose `output()` emitters, and own pure presentation logic (e.g. `togglePasswordVisibility`).

## Layouts

Two layout components wrap routed pages:

- `AppLayoutComponent` (`shared/layout/app-layout/`) — the main authenticated shell. Composes `AppHeaderComponent`, `AppSidebarComponent`, `BackdropComponent`, and the router outlet. Consumes `SidebarService` to apply responsive sidebar/margin classes.
- `AuthLayoutComponent` (`shared/layout/auth-layout/`) — the unauthenticated shell. Composes `GridShapeComponent`, `ThemeToggleTwoComponent`, `UiLinkComponent`, `UiImageComponent`. Used by sign-in/sign-up pages.

`SidebarService` (`shared/services/sidebar.service.ts`) is the canonical pattern for cross-component UI state: `BehaviorSubject` for `isExpanded`, `isMobileOpen`, `isHovered` exposed as observables.

## Routing

- The top-level `app/` segment mounts `AppLayoutComponent` with eager children (legacy TailAdmin demo routes: dashboard, calendar, profile, form-elements, blank, invoice, line-chart, bar-chart, alerts, avatars, badge, buttons, images, videos). These are scheduled for removal per the README ("Paso 6 — Limpieza inicial").
- The empty path `""` lazy-loads `AuthModule`.
- The wildcard `**` route renders `NotFoundComponent` from `pages/other-page/not-found/`.
- Each route defines a `title:` for the document title.
- Note the existing routes use `path: "app"` and the auth routes are at root, so URLs look like `http://localhost:4200/app/...` and `http://localhost:4200/signin`.

## Storybook

Storybook stories live in `src/stories/` and follow the `<primitive>.stories.ts` naming pattern (e.g. `button.stories.ts`, `modal.stories.ts`). They document every DS primitive. When adding a new DS primitive, add a matching stories file in the same location.

## Testing & Validation

- The `test` target uses Karma (`@angular/build:karma` builder, `tsconfig.spec.json`). Specs sit next to source as `*.spec.ts`.
- Per the global rules in `~/.claude/CLAUDE.md`, **do not run tests or `typecheck` automatically** — only when the user explicitly asks. After code changes, run `pnpm build` to validate.

## Lint / Typecheck

There is no separate `lint` script in `package.json`. The `build` command is the primary validation step (TypeScript + Angular template type-check + production budgets). Run `pnpm build` after making non-trivial changes.

## Security Notes (from the original Reporte_Stack_Frontend.pdf)

- Avoid URLs containing `//` (XSRF, CVE-2025-66035).
- pnpm 10.33.0 covers CVE-2025-69262/69263/69264.
- `pnpm-workspace.yaml` declares `onlyBuiltDependencies: [esbuild, sharp]` for supply-chain hardening.

## Common Pitfalls

- The `pages/` directory still contains legacy TailAdmin demo pages referenced from `app.routes.ts` under the `app/` segment. These are candidates for removal per the README and should not be used as a reference for new work — use the `features/auth` tree instead.
- `core/` is reserved (currently empty) for interceptors/guards. Don't put feature-specific code there.
- New feature forms must use `signal()` for state and `output()` for events — do not bind to two-way `ngModel` or call services from inside the form component.
- When passing icons to DS components like `UiButton`, pass the component class (`Type<unknown>`), not an instance, and rely on `NgComponentOutlet` rendering.
