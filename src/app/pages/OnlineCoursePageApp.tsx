// Páginas de venda dos cursos online e da apostila (/pt-br/cursos/online/velas-aromaticas/, /pt-br/cursos/online/saboaria-com-extratos-naturais/, /pt-br/apostilas/60-receitas-de-sabonetes/).
// Conteúdo em data/online_courses.ts; o visual vem só dos componentes de ui/ (mesmo padrão do resto do site).
// A compra é na Hotmart: o botão abre o checkout em nova aba.

import { useState } from 'react';
import {
  Check,
  FileText,
  Gift,
  ListChecks,
  MessageCircle,
  PlayCircle,
  Store,
  Users,
} from 'lucide-react';
import type { Language, FAQItem, Review } from '../classes/types';
import { online_courses, OnlineBlock } from '../data/online_courses';
import { WHATSAPP_URL } from '../data/presencial';
import CandlesNavbar from '../components/CandlesNavbar';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import ReviewsCarousel from '../components/ReviewsCarousel';
import {
  ContactCta,
  FeatureList,
  Gallery,
  Hero,
  HeroBadgeText,
  InfoGrid,
  PriceBlock,
  Profile,
  PurchaseCta,
  Section,
  SectionHeader,
  StatsBar,
  Steps,
  StickyBuyBar,
  emphasis,
} from '../ui';

const INCLUDED_ICONS = [PlayCircle, FileText, Store, Gift, MessageCircle, Users];

// Id da âncora de cada bloco (o botão secundário do herói leva ao primeiro conteúdo).
const ANCHOR: Partial<Record<OnlineBlock['type'], string>> = {
  learn: 'aprende',
  groups: 'receitas',
  modules: 'conteudo-do-curso',
  gallery: 'galeria',
  included: 'incluso',
  audience: 'para-quem',
  profile: 'professora',
};

const toReviews = (items: { text: string; cite: string }[]): Review[] =>
  items.map((it, i) => {
    const [name, course = ''] = it.cite.split(' · ');
    return {
      id: `online-${i}`,
      name,
      location: '',
      photoUrl: '/images/quote.png',
      courseName: { pt: course, es: course },
      text: { pt: it.text, es: it.text },
      stars: 0, // mensagens reais, sem nota
    };
  });

export default function OnlineCoursePageApp({ slug }: { slug: 'velas' | 'saboaria' | 'apostila' }) {
  const [language, setLanguage] = useState<Language>('pt');
  const c = online_courses[slug];

  const firstAnchor = c.sections.map((s) => ANCHOR[s.type]).find(Boolean);
  const final = c.sections.find((s) => s.type === 'final');
  const shortLabel = slug === 'apostila' ? 'Quero a apostila' : 'Quero entrar';

  // Fundos alternados (creme/branco), sem contar o carrossel de depoimentos (que tem fundo próprio).
  let n = 0;
  const next = () => (n++ % 2 === 0 ? 'cream' : 'white') as 'cream' | 'white';
  const opposite = (bg: 'cream' | 'white') => (bg === 'cream' ? 'white' : 'cream');

  const render = (b: OnlineBlock, i: number) => {
    switch (b.type) {
      case 'reviews':
        return <ReviewsCarousel key={i} language="pt" reviews={toReviews(b.items)} note={b.note} />;
      case 'faq': {
        const faqs: FAQItem[] = b.items.map((f, k) => ({ id: `f${k}`, question: { pt: f.q, es: f.q }, answer: { pt: f.a, es: f.a } }));
        next();
        return <FAQSection key={i} language="pt" faqs={faqs} />;
      }
      case 'final':
        return null; // renderizado depois, no bloco de compra
      default:
        break;
    }
    const bg = next();
    const id = ANCHOR[b.type];
    const head = <SectionHeader kicker={b.eyebrow} title={emphasis(b.title)} />;
    switch (b.type) {
      case 'learn':
        return (
          <Section key={i} id={id} bg={bg} border="top" width="narrow">
            {head}
            <FeatureList items={b.items} tone={opposite(bg)} icon={Check} />
          </Section>
        );
      case 'gallery':
        return (
          <Section key={i} id={id} bg={bg} border="top" width="mid">
            {head}
            <Gallery items={b.items} />
          </Section>
        );
      case 'modules':
        return (
          <Section key={i} id={id} bg={bg} border="top" width="mid">
            {head}
            <InfoGrid items={b.items.map((m) => ({ eyebrow: m.eyebrow, title: m.title, lessons: m.lessons }))} />
          </Section>
        );
      case 'groups':
        return (
          <Section key={i} id={id} bg={bg} border="top" width="mid">
            {head}
            <InfoGrid cols={3} items={b.groups.map((g) => ({ big: g.n, title: g.title, text: g.text }))} />
            <div className="mt-10">
              <FeatureList items={b.learn} tone={opposite(bg)} icon={Check} />
            </div>
          </Section>
        );
      case 'included':
        return (
          <Section key={i} id={id} bg={bg} border="top" width="mid">
            {head}
            <Steps
              numbered={false}
              tone={opposite(bg)}
              items={b.items.map((it, k) => ({ icon: INCLUDED_ICONS[k % INCLUDED_ICONS.length] ?? ListChecks, title: it.title, text: it.text }))}
            />
          </Section>
        );
      case 'audience':
        return (
          <Section key={i} id={id} bg={bg} border="top" width="narrow">
            {head}
            <FeatureList items={b.items} tone={opposite(bg)} icon={Check} />
          </Section>
        );
      case 'profile':
        return (
          <Section key={i} id={id} bg={bg} border="top" width="mid">
            <Profile img={b.img} kicker={b.eyebrow} title={emphasis(b.title)} text={b.text} />
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between pb-16 md:pb-0">
      <CandlesNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <Hero
          badge={<HeroBadgeText>{c.eyebrow}</HeroBadgeText>}
          title={emphasis(c.h1)}
          text={c.lead}
          primary={{ label: c.buy.label, href: c.buy.href, icon: ListChecks, external: true }}
          secondary={{ label: 'Ver o conteúdo', href: firstAnchor ? `#${firstAnchor}` : '#cursos', icon: ListChecks }}
          photo={{ src: c.hero_img.src, alt: c.hero_img.alt, position: 'top' }}
          stats={
            <div className="space-y-2">
              <PriceBlock main={c.price_label.main} sub={c.price_label.sub} />
              <p className="text-xs text-on-surface-variant">{c.guarantee}</p>
            </div>
          }
        />
        <StatsBar items={c.stats} />

        {c.sections.map(render)}

        <PurchaseCta
          id="cursos"
          title={final ? emphasis(final.title) : c.name}
          price={c.price_label}
          buy={c.buy}
          small={final?.small}
        />
        <ContactCta
          id="contato"
          title="Ficou com alguma dúvida?"
          text="Fale com a gente pelo WhatsApp."
          action={{ label: 'Chamar no WhatsApp', href: WHATSAPP_URL }}
        />
      </main>

      <StickyBuyBar price={c.price_label.main} buy={c.buy} shortLabel={shortLabel} />
      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
