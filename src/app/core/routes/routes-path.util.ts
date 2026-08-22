import type { Routes } from "@angular/router";

export function extractPathsFromRoutes(routes: Routes): Set<string> {
  const paths = new Set<string>();
  for (const route of routes) {
    if (route.path && route.path !== "**") {
      paths.add(normalizePath(route.path));
    }
    if (route.children) {
      const childPaths = extractPathsFromRoutes(route.children);
      const prefix = route.path ? normalizePath(route.path) : "";
      for (const child of childPaths) {
        paths.add(prefix ? `${prefix}${child}`.replace(/\/+/g, "/") : child);
      }
    }
  }
  return paths;
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}