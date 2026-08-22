// Re-export del helper de passwords temporales. Mantiene compatibilidad
// con consumers que importaban `generateTempPassword` desde aqui;
// la implementacion vive en `utils/random.ts`.

export { generateSecurePassword as generateTempPassword } from "@utils/random";
