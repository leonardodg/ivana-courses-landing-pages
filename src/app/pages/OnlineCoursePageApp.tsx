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
import SiteNavbar from '../components/SiteNavbar';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import ReviewsCarousel from '../components/ReviewsCarousel';
import {
  ContactCta,
  Gallery,
  Hero,
  HeroBadgeText,
  InfoBlocks,
  PriceBlock,
  Profile,
  PurchaseCta,
  Section,
  SectionHeader,
  StickyBuyBar,
  WhatsAppFab,
  whatsappHref,
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
  const language: Language = 'pt';
  const c = online_courses[slug];

  const firstAnchor = c.sections.map((s) => ANCHOR[s.type]).find(Boolean);
  const final = c.sections.find((s) => s.type === 'final');
  const shortLabel = slug === 'apostila' ? 'Quero a apostila' : 'Quero entrar';

  // Fundos alternados (creme/branco), sem contar o carrossel de depoimentos (que tem fundo próprio).
  let n = 0;
  const next = () => (n++ % 2 === 0 ? 'cream' : 'white') as 'cream' | 'white';

  // Depoimentos ficam no fim da página, logo antes das perguntas frequentes (a ordem em online_courses.ts não importa).
  const rest = c.sections.filter((b) => b.type !== 'reviews');
  const reviews = c.sections.filter((b) => b.type === 'reviews');
  const faqAt = rest.findIndex((b) => b.type === 'faq');
  const ordered = faqAt < 0 ? [...rest, ...reviews] : [...rest.slice(0, faqAt), ...reviews, ...rest.slice(faqAt)];

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
            <InfoBlocks layout="compact" tone={bg === 'cream' ? 'white' : 'stone'} items={b.items.map((title) => ({ icon: Check, title }))} />
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
            <InfoBlocks tone={bg === 'cream' ? 'white' : 'stone'} items={b.items.map((m) => ({ tile: m.eyebrow.match(/\d+/)?.[0], kicker: m.eyebrow, title: m.title, list: m.lessons }))} />
          </Section>
        );
      case 'groups':
        return (
          <Section key={i} id={id} bg={bg} border="top" width="mid">
            {head}
            <InfoBlocks layout="stack" columns={3} tone={bg === 'cream' ? 'white' : 'stone'} items={b.groups.map((g) => ({ tile: g.n, tint: 'gold', title: g.title, text: g.text }))} />
            <div className="mt-10">
              <InfoBlocks layout="compact" tone={bg === 'cream' ? 'white' : 'stone'} items={b.learn.map((title) => ({ icon: Check, title }))} />
            </div>
          </Section>
        );
      case 'included':
        return (
          <Section key={i} id={id} bg={bg} border="top" width="mid">
            {head}
            <InfoBlocks
              tone={bg === 'cream' ? 'white' : 'stone'}
              items={b.items.map((it, k) => ({ icon: INCLUDED_ICONS[k % INCLUDED_ICONS.length] ?? ListChecks, tint: k % 2 ? 'gold' : 'rose', title: it.title, text: it.text }))}
            />
          </Section>
        );
      case 'audience':
        return (
          <Section key={i} id={id} bg={bg} border="top" width="narrow">
            {head}
            <InfoBlocks layout="compact" tone={bg === 'cream' ? 'white' : 'stone'} items={b.items.map((title) => ({ icon: Check, title }))} />
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
      <SiteNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <Hero
          badge={<HeroBadgeText>{c.eyebrow}</HeroBadgeText>}
          title={emphasis(c.h1)}
          text={c.lead}
          primary={{ label: c.buy.label, href: c.buy.href, icon: ListChecks, external: true }}
          secondary={{ label: 'Ver o conteúdo', href: firstAnchor ? `#${firstAnchor}` : '#cursos', icon: ListChecks }}
          photo={{ src: c.hero_img.src, alt: c.hero_img.alt, position: 'top' }}
          backdrop={{ src: c.slug === 'velas' ? '/images/courses/velas-pavio-madeira.webp' : '/images/courses/saboaria.webp', alt: c.name }}
          stats={c.stats}
          extra={
            <div className="space-y-2">
              <PriceBlock main={c.price_label.main} sub={c.price_label.sub} />
              <p className="text-xs text-on-surface-variant">{c.guarantee}</p>
            </div>
          }
        />

        {ordered.map(render)}

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
      <WhatsAppFab href={whatsappHref(WHATSAPP_URL, `Oi! Vim pela página do ${c.name} e quero tirar uma dúvida.`)} label="Falar no WhatsApp" raised />
      <Footer />
    </div>
  );
}
