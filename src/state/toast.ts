import { useSyncExternalStore } from "react";

export interface ToastMessage {
  id: number;
  text: string;
}

let current: ToastMessage | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function showToast(text: string): void {
  current = { id: (current?.id ?? 0) + 1, text };
  for (const listener of listeners) listener();
}

export function useToast(): ToastMessage | null {
  return useSyncExternalStore(subscribe, () => current);
}
