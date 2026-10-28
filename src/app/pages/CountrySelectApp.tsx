// Raiz do site (/): escolha de país e idioma. Sem redirecionamento automático por IP ou idioma do navegador:
// cada país tem a sua home em /pt-br/ e /es-ar/. Esta página é o x-default do hreflang.
import { SectionHeader, Section, LinkCard, BrazilFlag, ArgentinaFlag } from './../ui';

export default function CountrySelectApp() {
  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col">
      <header className="px-6 py-6 flex justify-center">
        <img alt="Ivana Academy" className="h-12 md:h-14 w-auto object-contain" src="/images/logo.svg" />
      </header>

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none flex items-center">
        <Section bg="cream" width="narrow" className="w-full">
          <SectionHeader
            kicker="IVANA ACADEMY"
            title="Escolha seu país · Elegí tu país"
            sub="Cada país tem a sua oferta de cursos. / Cada país tiene su propia oferta."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <LinkCard
              href="/pt-br/"
              lang="pt-BR"
              icon={<BrazilFlag />}
              title="Brasil"
              text="Cursos presenciais e online de velas, saboaria, aromas e resina. Português do Brasil."
              cta="Entrar"
            />
            <LinkCard
              href="/es-ar/"
              lang="es-AR"
              icon={<ArgentinaFlag />}
              title="Argentina"
              text="Carreras online con título del Conservatorio Grassi: tecnicaturas y profesorados. Español."
              cta="Entrar"
            />
          </div>
        </Section>
      </main>
    </div>
  );
}
