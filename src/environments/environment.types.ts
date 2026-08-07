// Tipo compartido por todos los archivos environment*.ts.
// Si agregas un campo nuevo aca, TS rompe el build hasta que
// lo completes en cada environment*.ts. Es la red de seguridad
// para que no se nos pase ninguno.

export type EnvironmentName =
  | "development"
  | "staging"
  | "production"
  | "storybook";

export interface Environment {
  production: boolean;
  name: EnvironmentName;

  apiGatewayUrl: string;
  apiPrefix: string;

  httpTimeoutMs: number;
  httpRetryCount: number;

  swagger: {
    enabled: boolean;
    url: string;
  };
}
