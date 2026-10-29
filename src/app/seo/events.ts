// JSON-LD dos eventos da agenda do Brasil: montado no navegador a partir do feed (as datas mudam sozinhas).
import type { AgendaEvent } from "../hooks/useAgenda";

export function eventJsonLd(events: AgendaEvent[]) {
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
