// Página de interesse: UM arquivo para as duas versões (/pt-br/interesse/ e /es-ar/interes/).
// O que muda por país (idioma, navbar e rodapé, áreas de interesse, curso x carrera, WhatsApp, localização)
// vem de data/interest_options.ts e dos textos de lang/lead_form.ts; o layout é o mesmo.
import type { InterestCountry } from '../data/interest_options';
import SiteNavbar from '../components/SiteNavbar';
import LeadForm from '../components/LeadForm';
import AboutSection from '../components/AboutSection';
import WhyUsSection from '../components/WhyUsSection';
import Footer from '../components/Footer';

export default function InterestApp({ country }: { country: InterestCountry }) {
  const language = country === 'BR' ? 'pt' : 'es';

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <SiteNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <LeadForm country={country} formSource="interest" />
        <AboutSection language={language} />
        <WhyUsSection language={language} />
      </main>

      <Footer />
    </div>
  );
}
