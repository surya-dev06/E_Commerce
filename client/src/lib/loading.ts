import { useSyncExternalStore } from "react";

/**
 * Global "network is busy" tracker.
 * Every Supabase / API request goes through trackedFetch(), so the whole app
 * knows when something is still loading (top progress bar + page gate).
 */
let pending = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((fn) => fn());

export const getPending = () => pending;

export function trackedFetch(input: RequestInfo | URL, init?: RequestInit) {
  pending++;
  emit();
  return fetch(input, init).finally(() => {
    pending = Math.max(0, pending - 1);
    emit();
  });
}

export function usePending() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => pending,
  );
}
