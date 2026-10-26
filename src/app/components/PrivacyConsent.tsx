// Caixa de consentimento exigida nos formulários que coletam dados pessoais (LGPD art. 7º I e 8º).
// Não vem marcada; o envio só é liberado depois que a pessoa marca.
import type { Language } from '../classes/types';

interface Props {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  language?: Language;
}

export const CONSENT_TEXT_VERSION = 'privacidade-2026-10-25';

export default function PrivacyConsent({ id, checked, onChange, language = 'pt' }: Props) {
  const es = language === 'es';
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#805252]"
      />
      <label htmlFor={id} className="text-xs leading-relaxed text-on-surface-variant">
        {es ? 'Acepto el uso de mis datos para recibir respuesta y novedades de los cursos, según la ' : 'Concordo em usar meus dados para receber resposta e novidades dos cursos, conforme a '}
        <a href={es ? '/es_ar/privacidad/' : '/pt_br/privacidade/'} target="_blank" rel="noreferrer" className="underline text-primary">
          {es ? 'Política de Privacidad' : 'Política de Privacidade'}
        </a>
        . {es ? 'Podés retirar el consentimiento cuando quieras.' : 'Posso retirar o consentimento quando quiser.'}
      </label>
    </div>
  );
}
