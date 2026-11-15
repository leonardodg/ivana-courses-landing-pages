// Conteúdo gratuito: UM arquivo para as duas versões (/pt-br/conteudo-gratuito/ e /es-ar/contenido-gratuito/).
// Página simples de propósito: só os cards (o mesmo Card das páginas de curso) e os filtros por categoria e tipo
// (mesma barra de ferramentas da home). O conteúdo vive em data/free_content.ts. Clicar no botão do card pede o e-mail
// uma vez (EmailGateModal); depois o navegador lembra e o vídeo abre num modal / a apostila abre em outra aba.
import { useMemo, useState } from 'react';
import { Mail, Play } from 'lucide-react';
import SiteNavbar from '../components/SiteNavbar';
import Footer from '../components/Footer';
import { Card, CardGrid, EmailGateModal, Section, SectionHeader, VideoModal, btnPrimary } from '../ui';
import { free_categories, free_items, free_text, free_types, type FreeCategory, type FreeCountry, type FreeItem, type FreeType } from '../data/free_content';
import { requestFreeAccess, resetFreeAccess, useFreeAccess } from '../lib/freeAccess';
import { useSegmentFilter } from '../hooks/useSegmentFilter';
import { trackEvent } from '../lib/analytics';

export default function FreeContentApp({ country }: { country: FreeCountry }) {
  const language = country === 'BR' ? 'pt' : 'es';
  const t = free_text[language];
  const unlocked = useFreeAccess();

  const items = useMemo(() => free_items.filter((i) => i.country === country), [country]);
  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const types = useMemo(() => [...new Set(items.map((i) => i.type))], [items]);

  // #macrame, #resinas… filtram por categoria; #porta-macetas (id de um card) mostra a categoria dele e rola até o card.
  const [category, setCategory] = useSegmentFilter({
    keys: categories,
    cardSegment: (id) => items.find((i) => i.id === id)?.category,
    sectionId: 'conteudo-gratuito',
  });
  const [type, setType] = useState<FreeType | ''>('');

  const shown = items.filter((i) => (!category || i.category === category) && (!type || i.type === type));

  const [gate, setGate] = useState<FreeItem | null>(null);
  const [playing, setPlaying] = useState<FreeItem | null>(null);
  const [sent, setSent] = useState(false);
  const closeGate = () => {
    setGate(null);
    setSent(false);
  };

  const open = (item: FreeItem) => {
    trackEvent('free_content_open', { item: item.id, type: item.type, country });
    if (item.type === 'video') setPlaying(item);
  };
  // Vídeo: depois do primeiro e-mail o navegador lembra e abre direto. Apostila/recurso: SEMPRE pede o e-mail,
  // porque o link vai por e-mail (o n8n envia), o que também confirma que o endereço existe.
  const onCta = (item: FreeItem) => (unlocked && item.type === 'video' ? open(item) : setGate(item));

  const submitEmail = async (email: string): Promise<string | null> => {
    if (!gate) return null;
    const result = await requestFreeAccess(email, country, gate.id);
    if (result === 'rate_limited') return t.limited;
    if (result === 'error') return t.failed;
    if (gate.type === 'video') {
      const item = gate;
      setGate(null);
      open(item);
    } else {
      trackEvent('free_content_open', { item: gate.id, type: gate.type, country });
      setSent(true);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-surface-cream text-gray-900 font-sans flex flex-col justify-between">
      <SiteNavbar />
      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <Section id="conteudo-gratuito" width="wide" pad="md">
          <SectionHeader as="h1" title={t.title} sub={t.subtitle} />
          {unlocked && (
            <p className="text-xs text-on-surface-variant text-center -mt-6 mb-8">
              {t.unlocked} ·{' '}
              <button type="button" onClick={resetFreeAccess} className="underline text-primary cursor-pointer min-h-11">
                {t.change}
              </button>
            </p>
          )}
          <CardGrid
            count={shown.length}
            filter={[
              { value: category, onChange: (v) => setCategory(v), options: categories.map((c: FreeCategory) => ({ value: c, label: free_categories[c][language] })), label: t.filterCategory, allLabel: t.allCategories },
              { value: type, onChange: (v) => setType(v as FreeType | ''), options: types.map((x) => ({ value: x, label: free_types[x][language] })), label: t.filterType, allLabel: t.allTypes },
            ]}
          >
            {shown.map((item) => {
              const Icon = item.type === 'video' ? Play : Mail;
              return (
                <Card
                  key={item.id}
                  id={item.id}
                  image={item.image}
                  alt=""
                  tag={free_types[item.type][language]}
                  title={item.title}
                  bullets={item.summary ? [item.summary] : undefined}
                  meta={<span>{free_categories[item.category][language]}</span>}
                  cta={
                    <button type="button" onClick={() => onCta(item)} className={`${btnPrimary} w-full`}>
                      <Icon className="w-4 h-4" aria-hidden />
                      {free_types[item.type].cta[language]}
                    </button>
                  }
                />
              );
            })}
          </CardGrid>
          {shown.length === 0 && <p className="text-center text-sm text-on-surface-variant mt-8">{t.empty}</p>}
        </Section>
      </main>
      <Footer />

      {gate && <EmailGateModal sent={sent ? { title: t.sentTitle, text: t.sentText } : null} text={{ title: gate.type === 'video' ? t.gateTitle : t.mailTitle, text: gate.type === 'video' ? t.gateText : t.mailText, email: t.email, submit: t.submit, sending: t.sending, close: t.close, invalid: t.invalid }} language={language} onClose={closeGate} onSubmit={submitEmail} />}
      {playing?.youtubeId && <VideoModal youtubeId={playing.youtubeId} title={playing.title} closeLabel={t.close} onClose={() => setPlaying(null)} />}
    </div>
  );
}
