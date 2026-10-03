import { Language } from "../classes/types";

import { footer_text as text } from "../lang/footer";

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
        <div className="md:col-span-6 space-y-4">
          <img
            alt="Ivana Academy"
            className="h-22 w-auto object-contain"
            src="/images/logo-square.svg"
          />
          <p className="max-w-md leading-relaxed">{footer_text.about}</p>
        </div>

        {/* Card 2: Links */}
        <div className="md:col-span-3 space-y-3">
          <span className="font-bold text-gray-900 uppercase font-mono tracking-wider block">
            {footer_text.platformLinks}
          </span>
          <ul className="space-y-2">
            <li>
              <a
                href="#cursos"
                className="hover:text-primary transition-colors"
              >
                {footer_text.coursesLabel}
              </a>
            </li>
            <li>
              <a href="#sobre" className="hover:text-primary transition-colors">
                {footer_text.aboutLabel}
              </a>
            </li>
            <li>
              <a
                href="#contato"
                className="hover:text-primary transition-colors"
              >
                {footer_text.contactLabel}
              </a>
            </li>
          </ul>
        </div>

        {/* Card 3: Contact */}
        <div className="md:col-span-3 space-y-3">
          <span className="font-bold text-gray-900 uppercase font-mono tracking-wider block">
            {footer_text.contact}
          </span>
          <p className="leading-relaxed">
            {footer_text.addressBR} <br />
            {footer_text.addressAR} <br />
            <span className="font-bold text-primary mt-1 block">
              {footer_text.platform}
              <a href={footer_text.platformUrl} target="_blank">
                {footer_text.platformText}
              </a>
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 border-t border-muted mt-12 pt-6 text-center text-gray-500 text-[11px]">
        <span>{footer_text.rights}</span>
      </div>
    </footer>
  );
}
