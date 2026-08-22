import type { MessageFn, SelectOption } from "./select.types";

export function resolveMessage(
  msg: MessageFn | string | undefined,
): string {
  if (!msg) return "";
  return typeof msg === "function" ? (msg as MessageFn)() : (msg as string);
}

export function trackByValue(_: number, opt: SelectOption): unknown {
  return opt.value;
}