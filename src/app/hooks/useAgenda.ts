import { useEffect, useState } from "react";

// Endpoint público do n8n: devolve só eventos marcados "publicar: sim" no iCloud.
// Não contém segredo nenhum, é seguro no bundle do navegador.
export const AGENDA_URL = "https://webhook.ivana.academy/webhook/agenda";

// Sem parâmetro o feed devolve só o Brasil. Para a Argentina: ?pais=AR (cache separado).
export type AgendaCountry = "BR" | "AR";
const feedUrl = (country: AgendaCountry) => (country === "AR" ? `${AGENDA_URL}?pais=AR` : AGENDA_URL);
const cacheKey = (country: AgendaCountry) => (country === "AR" ? "ivana-agenda-ar-v1" : "ivana-agenda-v1");
const TIMEOUT_MS = 10000;

export interface AgendaEvent {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string | null;
  end_time: string | null;
  start: string;
  end: string;
  all_day: boolean;
  city: string;
  venue: string;
  address: string;
  place: string;
  maps_url: string | null;
  free: boolean;
  price: string | null;
  seats: string | null;
  status: string;
  link: string | null;
  note: string | null;
  // Só no feed da Argentina (pais=AR). Todos opcionais: o feed do Brasil não os traz.
  // ATENÇÃO: `price` também vem preenchido na Argentina ("$40.000 por mes"); a landing AR nunca o mostra.
  end_date?: string | null; // etapas de dia inteiro: último dia
  country?: string;
  etapa?: string; // "modulo 1/9" … "repaso", "receso", "cierre"
  turma?: string; // "Cohorte 2027"
  nivel?: string; // "Tecnicatura" | "Profesorado"
  modalidad?: string;
  online?: boolean;
  duration?: string;
}

interface AgendaPayload {
  generated_at: string;
  events: AgendaEvent[];
}

export interface AgendaState {
  status: "loading" | "ready" | "error";
  events: AgendaEvent[];
  generatedAt: string | null;
  stale: boolean;
}

const mockEvent = (
  id: string,
  date: string,
  time: string,
  endTime: string,
  title: string,
  city: string,
  venue: string,
  address: string,
  extra: Partial<AgendaEvent> = {},
): AgendaEvent => ({
  id,
  title,
  course: id,
  date,
  time,
  end_time: endTime,
  start: `${date}T${time.replace("h", ":").padEnd(5, "0").replace(/^(\d):/, "0$1:")}:00-03:00`,
  end: `${date}T${endTime.replace("h", ":").padEnd(5, "0").replace(/^(\d):/, "0$1:")}:00-03:00`,
  all_day: false,
  city,
  venue,
  address,
  place: [venue, city].filter(Boolean).join(", "),
  maps_url: address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${address}`)}`
    : null,
  free: false,
  price: null,
  seats: null,
  status: "aberto",
  link: null,
  note: null,
  ...extra,
});

const MOCK_EVENTS: AgendaEvent[] = import.meta.env.DEV
  ? [
      mockEvent("m1", "2026-11-06", "19h", "22h", "Saboaria e Extratos Naturais", "Florianópolis", "", "", { course: "saboaria-extratos" }),
      mockEvent("m2", "2026-11-07", "9h", "12h30", "Velas Aromáticas e de Moldes", "Balneário Camboriú", "Eventos Elegance", "Rua 3122, nº 481, Balneário Camboriú", { course: "velas-aromaticas-moldes", price: "R$ 380", seats: "10", status: "ultimas-vagas" }),
      mockEvent("m3", "2026-11-13", "14h", "17h", "Aromatizantes e Perfumes", "Rio de Janeiro", "Espaço Moura", "Rua Correa Dutra 149 - Flamengo, Rio de Janeiro", { course: "aromatizantes-perfumes", note: "Traga avental e um recipiente para levar os produtos." }),
      mockEvent("m4", "2026-11-14", "14h", "17h", "Saboaria e Extratos Naturais", "Rio de Janeiro", "Espaço Moura", "Rua Correa Dutra 149 - Flamengo, Rio de Janeiro", { course: "saboaria-extratos", status: "esgotado" }),
      mockEvent("m5", "2026-12-05", "9h30", "16h30", "Imersão de Velas", "Florianópolis", "", "", { course: "imersao-velas", free: true }),
    ]
  : [];

function readCache(country: AgendaCountry): AgendaPayload | null {
  try {
    const raw = localStorage.getItem(cacheKey(country));
    return raw ? (JSON.parse(raw) as AgendaPayload) : null;
  } catch {
    return null;
  }
}

function writeCache(country: AgendaCountry, payload: AgendaPayload) {
  try {
    localStorage.setItem(cacheKey(country), JSON.stringify(payload));
  } catch {
    // modo privado ou storage bloqueado: segue sem cache
  }
}

// Uma única busca por carregamento de página, compartilhada por todos os blocos que usam a agenda.
const shared: Partial<Record<AgendaCountry, Promise<AgendaState>>> = {};

function loadAgenda(country: AgendaCountry): Promise<AgendaState> {
  const cached = shared[country];
  if (cached) return cached;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const request = fetch(feedUrl(country), { signal: controller.signal })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<AgendaPayload>;
    })
    .then((payload): AgendaState => {
      writeCache(country, payload);
      return {
        status: "ready",
        events: payload.events ?? [],
        generatedAt: payload.generated_at,
        stale: false,
      };
    })
    .catch((): AgendaState => {
      const cached = readCache(country);
      if (cached) {
        const today = new Date().toLocaleDateString("en-CA", {
          timeZone: "America/Sao_Paulo",
        });
        return {
          status: "ready",
          events: (cached.events ?? []).filter((e) => e.date >= today),
          generatedAt: cached.generated_at,
          stale: true,
        };
      }
      return { status: "error", events: [], generatedAt: null, stale: false };
    })
    .finally(() => clearTimeout(timer));

  shared[country] = request;
  return request;
}

// country: "BR" (padrão, sem parâmetro) ou "AR" (?pais=AR, cache próprio).
// enabled=false: não busca (ex.: home em espanhol ou categoria sem turmas).
export function useAgenda(country: AgendaCountry = "BR", enabled = true): AgendaState {
  const [state, setState] = useState<AgendaState>({
    status: "loading",
    events: [],
    generatedAt: null,
    stale: false,
  });

  useEffect(() => {
    if (!enabled) return;

    // Só em desenvolvimento (?mock): dados de exemplo para testar o layout. Some do build de produção.
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).has("mock")) {
      if (country === "AR") {
        // import dinâmico: o módulo dos mocks AR nem entra no build de produção
        import("../data/agenda_ar_mock").then((m) =>
          setState({ status: "ready", events: m.MOCK_EVENTS_AR, generatedAt: null, stale: false }),
        );
      } else {
        setState({ status: "ready", events: MOCK_EVENTS, generatedAt: null, stale: false });
      }
      return;
    }

    let active = true;
    loadAgenda(country).then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, [country, enabled]);

  return state;
}
