import type { Environment } from "./environment.types";

// Environment de produccion. Se activa con:
//   pnpm build
//   ng build --configuration=production
// El swap lo hace angular.json via fileReplacements.

export const environment: Environment = {
  production: true,
  name: "production",

  apiGatewayUrl: "https://api.spsrt.unir.edu.pe",
  apiPrefix: "/api",

  httpTimeoutMs: 20000,
  httpRetryCount: 2,

  swagger: {
    enabled: false,
    url: "",
  },
};
