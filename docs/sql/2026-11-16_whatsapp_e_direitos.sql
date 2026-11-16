-- 2026-11-16: WhatsApp opcional no conteúdo gratuito + tabela própria para pedidos de direitos (LGPD / arrependimento).
-- Rodar COMO DONO DO BANCO (nocouser não cria nem altera tabela em public). Idempotente.

-- 1) Conteúdo gratuito: WhatsApp opcional (só dígitos com DDI, ex.: 5548996914012) e nome (matrícula no Moodle).
ALTER TABLE public.free_content_leads ADD COLUMN IF NOT EXISTS whatsapp   text;
ALTER TABLE public.free_content_leads ADD COLUMN IF NOT EXISTS full_name  text;

-- 2) Pedidos de direitos: uma linha por pedido (NUNCA sobrescreve, ao contrário de public.leads, que é upsert por telefone).
CREATE TABLE IF NOT EXISTS public.rights_requests (
  id           bigserial PRIMARY KEY,
  kind         text        NOT NULL CHECK (kind IN ('arrepentimiento','lgpd')),
  country      char(2),
  full_name    text        NOT NULL,
  email        text        NOT NULL,
  phone        text,
  subject      text,
  message      text        NOT NULL,
  form_source  text        NOT NULL,
  status       text        NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','done')),
  ip           text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rights_requests TO nocouser;
GRANT USAGE, SELECT ON SEQUENCE public.rights_requests_id_seq TO nocouser;
