import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  ExternalLink,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Language } from "../classes/types";
import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import { AgendaEvent, useAgenda } from "../hooks/useAgenda";

const WHATSAPP = "5548991671659";
const SP = { timeZone: "America/Sao_Paulo" } as const;

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary";
const BTN_PRIMARY = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-container px-6 text-sm font-semibold text-on-primary-container transition hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${FOCUS}`;
const BTN_SECONDARY = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-tertiary px-6 text-sm font-semibold text-tertiary transition hover:bg-tertiary hover:text-on-tertiary ${FOCUS}`;

const parseDay = (date: string) => new Date(`${date}T12:00:00-03:00`);
const todayIso = () => new Date().toLocaleDateString("en-CA", SP);

const monthLabel = (date: string) => {
  const label = parseDay(date).toLocaleDateString("pt-BR", { ...SP, month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
};
const weekday = (date: string) =>
  parseDay(date).toLocaleDateString("pt-BR", { ...SP, weekday: "short" }).replace(".", "");
const dayNumber = (date: string) =>
  parseDay(date).toLocaleDateString("pt-BR", { ...SP, day: "2-digit" });
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

function eventJsonLd(events: AgendaEvent[]) {
  return events.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.start,
    endDate: e.end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: e.venue || e.city || "Ivana Academy",
      address: e.address || e.city,
    },
    organizer: { "@type": "Organization", name: "Ivana Academy", url: "https://courses.ivana.academy/" },
  }));
}

function Badge({ tone, children }: { tone: "rose" | "gold" | "sand" | "alert"; children: string }) {
  const tones = {
    rose: "bg-primary-container/40 text-on-primary-container",
    gold: "bg-tertiary-container/50 text-on-tertiary-container",
    sand: "bg-secondary-container text-on-secondary-container",
    alert: "bg-error-container text-on-error-container",
  } as const;
  return (
    <span className={`rounded-full px-3 py-1 font-sans text-xs font-semibold tracking-[0.05em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

function EventCard({ event, featured }: { event: AgendaEvent; featured: boolean }) {
  const soldOut = event.status === "esgotado";
  const lastSeats = event.status === "ultimas-vagas";
  const cta = event.link ?? whatsappLink(event);
  const addToCalendar = calendarLink(event);
  const timeLabel = event.time
    ? `${event.time}${event.end_time && event.end_time !== event.time ? ` às ${event.end_time}` : ""}`
    : "Dia todo";

  return (
    <li>
      <article
        className={`flex gap-4 rounded-2xl border bg-surface-cream p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:gap-6 md:p-6 ${
          featured ? "border-primary-container" : "border-surface-container-highest"
        }`}
      >
        <time
          dateTime={event.date}
          className="flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-container text-on-primary-container md:h-24 md:w-20"
        >
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.05em]">
            {weekday(event.date)}
          </span>
          <span className="font-serif text-[28px] leading-9 md:text-4xl">{dayNumber(event.date)}</span>
        </time>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={featured ? "gold" : "sand"}>{countdown(event.date)}</Badge>
            {event.free && <Badge tone="sand">Gratuito</Badge>}
            {lastSeats && <Badge tone="gold">Últimas vagas</Badge>}
            {soldOut && <Badge tone="alert">Esgotado</Badge>}
          </div>

          <h3 className="font-serif text-2xl leading-8 text-tertiary">{event.title}</h3>

          <p className="text-base text-on-surface-variant">
            <span className="font-semibold text-on-surface">{timeLabel}</span>
            {event.price ? ` · ${event.price}` : ""}
            {event.seats ? ` · ${event.seats} vagas` : ""}
          </p>

          {(event.venue || event.address || event.city) && (
            <p className="flex items-start gap-2 text-base text-on-surface-variant">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-tertiary" aria-hidden />
              <span>
                {event.venue && <strong className="font-semibold text-on-surface">{event.venue}</strong>}
                {event.venue && (event.address || event.city) ? " · " : ""}
                {event.address || event.city}
                {event.maps_url && (
                  <>
                    {" "}
                    <a
                      href={event.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`whitespace-nowrap font-semibold text-tertiary underline underline-offset-2 ${FOCUS}`}
                    >
                      Ver no mapa<span className="sr-only"> de {event.title}</span>
                    </a>
                  </>
                )}
              </span>
            </p>
          )}

          {event.note && <p className="text-base text-on-surface-variant">{event.note}</p>}

          {!soldOut && (
            <div className="flex flex-wrap gap-3 pt-1">
              <a href={cta} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>
                {event.link ? (
                  <ExternalLink className="h-4 w-4" aria-hidden />
                ) : (
                  <MessageCircle className="h-4 w-4" aria-hidden />
                )}
                Quero minha vaga
                <span className="sr-only">: {event.title}, {shortDate(event.date)}</span>
              </a>
              {addToCalendar && (
                <a href={addToCalendar} target="_blank" rel="noopener noreferrer" className={BTN_SECONDARY}>
                  <CalendarPlus className="h-4 w-4" aria-hidden />
                  Adicionar ao calendário
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </li>
  );
}

export default function AgendaApp() {
  const [language, setLanguage] = useState<Language>("pt");
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

  const byMonth = useMemo(() => {
    const groups = new Map<string, AgendaEvent[]>();
    for (const e of visible) {
      const key = e.date.slice(0, 7);
      groups.set(key, [...(groups.get(key) ?? []), e]);
    }
    return Array.from(groups.entries());
  }, [visible]);

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

  return (
    <div className="flex min-h-screen flex-col justify-between bg-surface-cream font-sans text-on-surface">
      <header className="border-b border-surface-container-highest">
        <SkipLink />
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-16">
          <a href="/" aria-label="Ivana Academy - página inicial" className={`flex min-h-11 items-center rounded-lg ${FOCUS}`}>
            <img src="/images/logo.svg" alt="Ivana Academy" className="h-10 w-auto" />
          </a>
          <a href="/" className={`inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-tertiary underline underline-offset-4 ${FOCUS}`}>
            Ver todos os cursos
          </a>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="grow focus:outline-none">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-8 md:px-16 md:py-20 lg:grid-cols-12 lg:gap-16">
          <aside className="min-w-0 space-y-6 lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-8">
              <p className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.05em] text-tertiary">
                <CalendarDays className="h-4 w-4" aria-hidden /> Cursos presenciais
              </p>
              <h1 className="font-serif text-[28px] leading-9 text-on-surface md:text-5xl md:leading-[56px]">
                Agenda de cursos e oficinas
              </h1>
              <p className="max-w-md text-base text-on-surface-variant">
                Datas, horários e endereços sempre atualizados. Escolha a sua turma e garanta a vaga pelo
                WhatsApp.
              </p>

              {/* Ação principal visível sem rolar, também no celular */}
              <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className={`${BTN_SECONDARY} inline-flex`}>
                <MessageCircle className="h-4 w-4" aria-hidden /> Falar com a Ivana
              </a>

              {cities.length > 1 && (
                <div
                  className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
                  role="group"
                  aria-label="Filtrar por cidade"
                >
                  {["", ...cities].map((c) => (
                    <button
                      key={c || "todas"}
                      type="button"
                      onClick={() => setCity(c)}
                      aria-pressed={city === c}
                      className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition ${FOCUS} ${
                        city === c
                          ? "border-primary-container bg-primary-container text-on-primary-container"
                          : "border-surface-container-highest bg-surface-cream text-on-surface-variant hover:border-primary-container"
                      }`}
                    >
                      {c || "Todas as cidades"}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </aside>

          <section className="min-w-0 space-y-12 lg:col-span-8" aria-live="polite">
            {agenda.status === "loading" && (
              <ul className="space-y-4" aria-busy="true" aria-label="Carregando agenda">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="h-40 rounded-2xl bg-surface-container motion-safe:animate-pulse" />
                ))}
              </ul>
            )}

            {agenda.status === "error" && (
              <div className="space-y-4 rounded-2xl border border-surface-container-highest p-8 text-center">
                <p className="font-serif text-2xl text-tertiary">Não consegui carregar a agenda agora.</p>
                <p className="text-base text-on-surface-variant">
                  Confira sua conexão e tente de novo, ou chame a Ivana no WhatsApp.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={() => window.location.reload()} className={BTN_PRIMARY}>
                    Tentar de novo
                  </button>
                  <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className={BTN_SECONDARY}>
                    Chamar no WhatsApp
                  </a>
                </div>
              </div>
            )}

            {agenda.status === "ready" && agenda.stale && (
              <p className="rounded-lg bg-secondary-container px-4 py-3 text-sm text-on-secondary-container">
                Mostrando a última agenda salva neste aparelho. Pode haver novidades, confirme pelo WhatsApp.
              </p>
            )}

            {agenda.status === "ready" && visible.length === 0 && (
              <div className="space-y-4 rounded-2xl border border-surface-container-highest p-8 text-center">
                <p className="font-serif text-2xl text-tertiary">Novas datas em breve.</p>
                <p className="text-base text-on-surface-variant">
                  Fale com a Ivana e seja avisada assim que abrir a próxima turma.
                </p>
                <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>
                  <MessageCircle className="h-4 w-4" aria-hidden /> Quero ser avisada
                </a>
              </div>
            )}

            {byMonth.map(([key, items]) => (
              <div key={key} className="space-y-4">
                <h2 className="font-serif text-2xl leading-8 text-tertiary">
                  {monthLabel(items[0].date)}
                </h2>
                <ul className="space-y-4">
                  {items.map((e) => (
                    <EventCard key={e.id} event={e} featured={e.id === nextId} />
                  ))}
                </ul>
              </div>
            ))}

            {agenda.status === "ready" && visible.length > 0 && (
              <div className="lg:hidden">
                <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className={`${BTN_SECONDARY} w-full`}>
                  <MessageCircle className="h-4 w-4" aria-hidden /> Falar com a Ivana no WhatsApp
                </a>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
