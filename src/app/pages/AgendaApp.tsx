import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CalendarPlus, Clock, ExternalLink, MapPin, MessageCircle } from "lucide-react";
import Footer from "../components/Footer";
import SiteNavbar from "../components/SiteNavbar";
import { AgendaEvent, useAgenda } from "../hooks/useAgenda";
import { useDensity } from "../hooks/useDensity";
import { eventJsonLd } from "../seo/events";
import { monthTitle, useMonthPager } from "../hooks/useMonthPager";
import { AgendaLayout, DensityToggle, EventBadge, Density, EventCard, FilterChips, MonthNav, WhatsAppFab, btnOutline, btnPrimary } from "../ui";

const WHATSAPP = "5548991671659";
const SP = { timeZone: "America/Sao_Paulo" } as const;

const parseDay = (date: string) => new Date(`${date}T12:00:00-03:00`);
const todayIso = () => new Date().toLocaleDateString("en-CA", SP);

const shortDate = (date: string) =>
  parseDay(date).toLocaleDateString("pt-BR", { ...SP, day: "2-digit", month: "2-digit" });

function daysUntil(date: string): number {
  return Math.round((parseDay(date).getTime() - parseDay(todayIso()).getTime()) / 86400000);
}

function countdown(date: string): string {
  const d = daysUntil(date);
  if (d <= 0) return "Hoje";
  if (d === 1) return "Amanhã";
  return `Em ${d} dias`;
}

const whatsappLink = (e: AgendaEvent) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Oi! Quero saber sobre ${e.title}${e.city ? ` em ${e.city}` : ""} no dia ${shortDate(e.date)}.`,
  )}`;

function calendarLink(e: AgendaEvent): string | null {
  if (e.all_day) return null;
  const stamp = (iso: string) => iso.replace(/[-:]/g, "").slice(0, 15);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.title} - Ivana Academy`,
    dates: `${stamp(e.start)}/${stamp(e.end)}`,
    ctz: "America/Sao_Paulo",
    location: [e.venue, e.address].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function EventItem({ event, featured, density }: { event: AgendaEvent; featured: boolean; density: Density }) {
  const soldOut = event.status === "esgotado";
  const cta = event.link ?? whatsappLink(event);
  const addToCalendar = calendarLink(event);
  const timeLabel = event.time
    ? `${event.time}${event.end_time && event.end_time !== event.time ? ` às ${event.end_time}` : ""}`
    : "Dia todo";
  const badges: EventBadge[] = [
    { label: countdown(event.date), tone: featured ? "accent" : "neutral" },
    ...(event.free ? [{ label: "Gratuito" }] : []),
    ...(event.status === "ultimas-vagas" ? [{ label: "Últimas vagas", tone: "accent" as const }] : []),
    ...(soldOut ? [{ label: "Esgotado", tone: "alert" as const }] : []),
  ];

  const reserve = (
    <a href={cta} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
      {event.link ? <ExternalLink className="h-4 w-4" aria-hidden /> : <MessageCircle className="h-4 w-4" aria-hidden />}
      Quero minha vaga
      <span className="sr-only">: {event.title}, {shortDate(event.date)}</span>
    </a>
  );

  return (
    <EventCard
      date={event.date}
      locale="pt-BR"
      density={density}
      featured={featured}
      badges={badges}
      title={event.title}
      ariaTitle={event.title}
      lines={[
        <>
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span>
            <span className="font-semibold text-gray-900">{timeLabel}</span>
            {event.price ? ` · ${event.price}` : ""}
            {event.seats ? ` · ${event.seats} vagas` : ""}
          </span>
        </>,
        ...(event.venue || event.address || event.city
          ? [
              <>
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                <span>
                  {event.venue && <strong className="font-semibold text-gray-900">{event.venue}</strong>}
                  {event.venue && (event.address || event.city) ? " · " : ""}
                  {event.address || event.city}
                  {event.maps_url && (
                    <>
                      {" "}
                      <a href={event.maps_url} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap font-semibold text-primary underline underline-offset-2">
                        Ver no mapa<span className="sr-only"> de {event.title}</span>
                      </a>
                    </>
                  )}
                </span>
              </>,
            ]
          : []),
      ]}
      summary={[timeLabel, event.venue || event.city].filter(Boolean).join(" · ")}
      note={event.note}
      quickAction={!soldOut && reserve}
      actions={
        !soldOut && (
          <>
            {reserve}
            {addToCalendar && (
              <a href={addToCalendar} target="_blank" rel="noopener noreferrer" className={btnOutline}>
                <CalendarPlus className="h-4 w-4" aria-hidden />
                Adicionar ao calendário
              </a>
            )}
          </>
        )
      }
    />
  );
}

export default function AgendaApp() {
  const [city, setCity] = useState<string>("");
  const agenda = useAgenda();

  const cities = useMemo(
    () => Array.from(new Set(agenda.events.map((e) => e.city).filter(Boolean))).sort(),
    [agenda.events],
  );

  const visible = useMemo(
    () => (city ? agenda.events.filter((e) => e.city === city) : agenda.events),
    [agenda.events, city],
  );

  const pager = useMonthPager(visible, todayIso());
  const { density, setDensity } = useDensity();

  useEffect(() => {
    if (agenda.status !== "ready" || agenda.events.length === 0) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(eventJsonLd(agenda.events));
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [agenda.status, agenda.events]);

  const nextId = visible[0]?.id;
  const whatsappGeneral = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "Oi! Vim pela agenda do site e quero saber as próximas turmas.",
  )}`;
  const emptyBox = "space-y-4 rounded-2xl border border-muted bg-white p-8 text-center shadow-sm";

  return (
    <div className="flex min-h-screen flex-col justify-between bg-surface-cream font-sans text-gray-900">
      <SiteNavbar />

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <AgendaLayout
          kicker={<><CalendarDays className="h-4 w-4" aria-hidden /> Cursos presenciais</>}
          title="Agenda de cursos e oficinas"
          sub="Datas, horários e endereços sempre atualizados. Escolha a sua turma e garanta a vaga pelo WhatsApp."
          aside={
            <>
              {/* Ação principal visível sem rolar, também no celular */}
              <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className={`${btnOutline} inline-flex`}>
                <MessageCircle className="h-4 w-4" aria-hidden /> Falar com a Ivana
              </a>
              {cities.length > 1 && (
                <FilterChips
                  options={cities.map((c) => ({ value: c, label: c }))}
                  value={city}
                  onChange={setCity}
                  allLabel="Todas as cidades"
                  ariaLabel="Filtrar por cidade"
                />
              )}
            </>
          }
        >
          {agenda.status === "loading" && (
            <ul className="space-y-4" aria-busy="true" aria-label="Carregando agenda">
              {[0, 1, 2].map((i) => (
                <li key={i} className="h-40 rounded-2xl bg-white border border-muted motion-safe:animate-pulse" />
              ))}
            </ul>
          )}

          {agenda.status === "error" && (
            <div className={emptyBox}>
              <p className="font-serif text-2xl text-gray-900">Não consegui carregar a agenda agora.</p>
              <p className="text-base text-on-surface-variant">Confira sua conexão e tente de novo, ou chame a Ivana no WhatsApp.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => window.location.reload()} className={btnPrimary}>Tentar de novo</button>
                <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className={btnOutline}>Chamar no WhatsApp</a>
              </div>
            </div>
          )}

          {agenda.status === "ready" && agenda.stale && (
            <p className="rounded-lg bg-secondary-container px-4 py-3 text-sm text-on-secondary-container">
              Mostrando a última agenda salva neste aparelho. Pode haver novidades, confirme pelo WhatsApp.
            </p>
          )}

          {agenda.status === "ready" && visible.length === 0 && (
            <div className={emptyBox}>
              <p className="font-serif text-2xl text-gray-900">Novas datas em breve.</p>
              <p className="text-base text-on-surface-variant">Fale com a Ivana e seja avisada assim que abrir a próxima turma.</p>
              <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} inline-flex`}>
                <MessageCircle className="h-4 w-4" aria-hidden /> Quero ser avisada
              </a>
            </div>
          )}

          {pager.month && (
            <>
              <div className="flex justify-end">
                <DensityToggle value={density} onChange={setDensity} labels={{ group: "Tamanho dos cards", full: "Completo", compact: "Resumido" }} />
              </div>
              <MonthNav
                label={monthTitle(pager.month, "pt-BR")}
                count={`${pager.items.length} ${pager.items.length === 1 ? "turma" : "turmas"}`}
                onPrev={pager.prev}
                onNext={pager.next}
                prevLabel="Mês anterior"
                nextLabel="Próximo mês"
              />
              <ul className="space-y-4">
                {pager.items.map((e) => (
                  <EventItem key={e.id} event={e} featured={e.id === nextId} density={density} />
                ))}
              </ul>
            </>
          )}

          {agenda.status === "ready" && visible.length > 0 && (
            <div className="lg:hidden">
              <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className={`${btnOutline} w-full`}>
                <MessageCircle className="h-4 w-4" aria-hidden /> Falar com a Ivana no WhatsApp
              </a>
            </div>
          )}
        </AgendaLayout>
      </main>

      <WhatsAppFab href={whatsappGeneral} label="Falar no WhatsApp" />

      <Footer />
    </div>
  );
}
