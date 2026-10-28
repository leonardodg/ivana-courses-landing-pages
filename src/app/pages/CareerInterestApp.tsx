// Interés (Argentina): deja tus datos y te avisamos. Equivale a /pt-br/interesse/ (canal de contacto sin compra).
import SiteNavbar from '../components/SiteNavbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import { WHATSAPP_AR } from '../data/carreras_ar';
import { ContactCta, Section, SectionHeader } from '../ui';

export default function CareerInterestApp() {
  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <SiteNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <Section bg="cream" width="narrow" className="pt-28 md:pt-32">
          <SectionHeader
            kicker="INTERÉS"
            title="¿Querés que te avisemos?"
            sub="Dejanos tus datos y te escribimos con las novedades de las carreras online: fechas de inicio, cohortes e inscripción."
          />
        </Section>

        <ContactForm language="es" coursePage="carreras_ar" />

        <ContactCta
          id="contacto"
          title="¿Preferís hablar ya?"
          text="Escribinos por WhatsApp."
          action={{ label: 'Hablar por WhatsApp', href: WHATSAPP_AR }}
        />
      </main>

      <Footer />
    </div>
  );
}
