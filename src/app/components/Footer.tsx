import { Language } from "../classes/types";

import { footer_text as text } from "../lang/footer";
import { company, legalLinks } from "../legal/company";
import { site_link_groups } from "../data/site_links";
import { openCookiePreferences } from "../lib/consent";

interface FooterProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function Footer({ language, setLanguage }: FooterProps) {
  const footer_text = text[language];

  return (
    <footer className="bg-surface-hero border-t border-subtle py-12 md:py-16 text-xs text-on-surface-variant">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Card 1: Description */}
        <div className="md:col-span-12 lg:col-span-3 space-y-4">
          <img loading="lazy" decoding="async"
            alt="Ivana Academy"
            className="h-22 w-auto object-contain"
            src="/images/logo-square.png"
          />
          <p className="max-w-md leading-relaxed">{footer_text.about}</p>
          <p className="leading-relaxed">{footer_text.addressBR} · {footer_text.addressAR}</p>
        </div>

        {/* Grupos de links do projeto */}
        {site_link_groups.map((group) => (
          <nav key={group.title.pt} aria-label={group.title[language]} className="md:col-span-4 lg:col-span-3 space-y-3">
            <span className="font-bold text-gray-900 uppercase font-mono tracking-wider block">
              {group.title[language]}
            </span>
            <ul className="space-y-2">
              {group.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={language === "es" && l.hrefEs ? l.hrefEs : l.href}
                    {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {l.label[language]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="max-w-[1280px] mx-auto px-6 border-t border-muted mt-12 pt-6 text-center text-on-surface-variant text-[11px] space-y-3">
        <nav aria-label={language === "es" ? "Información legal" : "Informações legais"} className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
          {legalLinks.map((l) => (
            <a key={l.href} href={language === "es" ? l.hrefEs : l.href} className="underline hover:text-primary">{l.label[language]}</a>
          ))}
          {language === "es" && (
            <>
              <a href="/es-ar/arrepentimiento/" className="underline hover:text-primary">Botón de arrepentimiento</a>
              <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario" target="_blank" rel="noreferrer" className="underline hover:text-primary">
                Defensa de las y los Consumidores: para reclamos, ingresá acá
              </a>
            </>
          )}
          <button type="button" onClick={openCookiePreferences} className="underline hover:text-primary cursor-pointer">
            {language === "es" ? "Preferencias de cookies" : "Preferências de cookies"}
          </button>
        </nav>
        <p>
          {company.legalName} · CNPJ {company.cnpj} · {language === "es" ? company.ar.email : company.email}
        </p>
        <p>{footer_text.rights}</p>
      </div>
    </footer>
  );
}
