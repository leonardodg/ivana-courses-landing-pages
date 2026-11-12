// JSON-LD dos eventos da agenda do Brasil: montado no navegador a partir do feed (as datas mudam sozinhas).
import type { AgendaEvent } from "../hooks/useAgenda";

const AGENDA_URL = "https://courses.ivana.academy/pt-br/agenda/";
const ORG = { "@type": "Organization", name: "Ivana Academy", url: "https://courses.ivana.academy/" } as const;

/** "R$ 1.380,50" → "1380.50". Devolve null se o texto não tiver um valor reconhecível. */
function parsePrice(price: string | null): string | null {
  const m = price?.match(/(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d{1,2}))?/);
  if (!m) return null;
  return `${m[1].replace(/\./g, "")}${m[2] ? `.${m[2].padEnd(2, "0")}` : ""}`;
}

export function eventJsonLd(events: AgendaEvent[]) {
  return events.map((e) => {
    const soldOut = e.status === "esgotado";
    const amount = e.free ? "0" : parsePrice(e.price);
    const url = e.link ?? AGENDA_URL;
    return {
      "@context": "https://schema.org",
      "@type": "EducationEvent",
      name: `${e.title} em ${e.city || "Florianópolis"}`,
      description: `Curso presencial de ${e.title} com Ivana Lerea${e.city ? ` em ${e.city}` : ""}. Materiais, apostila e certificado.`,
      startDate: e.start,
      endDate: e.end,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      inLanguage: "pt-BR",
      url,
      location: {
        "@type": "Place",
        name: e.venue || e.city || "Ivana Academy",
        address: e.address || e.city,
      },
      performer: { "@type": "Person", name: "Ivana Lerea" },
      organizer: ORG,
      // Só informa oferta quando há valor (ou é gratuito): sem preço, o campo seria inventado.
      ...(amount !== null
        ? {
            offers: {
              "@type": "Offer",
              price: amount,
              priceCurrency: "BRL",
              availability: soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
              url,
            },
          }
        : {}),
    };
  });
}
