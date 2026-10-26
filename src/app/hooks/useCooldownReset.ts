import { useEffect } from 'react';
import type { SubmitStatus } from './useSubmitContact';

/**
 * Quando o envio cai em "rate_limited", conta o cooldown regressivamente e, ao zerar, volta o
 * formulário para "idle" (pode enviar de novo sem recarregar a página).
 */
export function useCooldownReset(
  status: SubmitStatus,
  cooldown: number,
  setCooldown: (n: number) => void,
  setStatus: (s: SubmitStatus) => void,
) {
  useEffect(() => {
    if (status !== 'rate_limited') return;
    if (cooldown <= 0) {
      setStatus('idle');
      return;
    }
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [status, cooldown, setCooldown, setStatus]);
}
