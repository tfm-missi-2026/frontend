import type { Environment } from "./environment.types";

// Environment default (development). Se reemplaza en build time
// segun la configuration de angular.json (fileReplacements):
//   production -> environment.prod.ts
//   staging    -> environment.staging.ts (si se agrega)
//   storybook  -> environment.storybook.ts (si se agrega)

export const environment: Environment = {
  production: false,
  name: "development",

  apiGatewayUrl: "http://localhost:8080",
  apiPrefix: "/api",

  httpTimeoutMs: 15000,
  httpRetryCount: 1,

  swagger: {
    enabled: true,
    url: "http://localhost:8080",
  },
};
