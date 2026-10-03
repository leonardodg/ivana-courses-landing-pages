// src/hooks/useRateLimit.ts
import { useRef } from "react";

const MAX_SUBMISSIONS = 3;
const WINDOW_MS = 60_000; // 1 minuto

export function useRateLimit() {
  const history = useRef<number[]>([]);

  function check(): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    // remove submissões fora da janela
    history.current = history.current.filter((t) => now - t < WINDOW_MS);

    if (history.current.length >= MAX_SUBMISSIONS) {
      const resetIn = Math.ceil(
        (WINDOW_MS - (now - history.current[0])) / 1000,
      );
      return { allowed: false, remaining: 0, resetIn };
    }

    history.current.push(now);
    return {
      allowed: true,
      remaining: MAX_SUBMISSIONS - history.current.length,
      resetIn: 0,
    };
  }

  return { check };
}
