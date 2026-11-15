-- Conteúdo gratuito + matrícula Moodle: leads por e-mail (um registro por e-mail).
-- Rodar COMO DONO DO BANCO (o usuário do n8n, nocouser, só tem SELECT/INSERT/UPDATE/DELETE e não cria tabela em public).
-- Exemplo na VPS:  docker exec -i <container-postgres> psql -U <dono> -d ivana_academy < free_content_leads.sql

CREATE TABLE IF NOT EXISTS public.free_content_leads (
  id                 bigserial PRIMARY KEY,
  email              text        NOT NULL UNIQUE,                      -- sempre minúsculo (o workflow normaliza)
  country            char(2)     NOT NULL CHECK (country IN ('BR','AR')),
  consent            text        NOT NULL,                             -- versão da política aceita (prova do consentimento, LGPD)
  consent_date       timestamptz NOT NULL DEFAULT now(),
  first_item_id      text,
  last_item_id       text,
  items              text[]      NOT NULL DEFAULT '{}',                -- todos os item_id já pedidos
  source             text,                                             -- free_content_br|ar, free_enroll_br|ar
  ip                 text,
  hits               integer     NOT NULL DEFAULT 1,
  moodle_user_id     integer,
  moodle_course_ids  integer[]   NOT NULL DEFAULT '{}',
  last_mail_at       timestamptz,                                      -- limita reenvio de e-mail (10 min) contra abuso
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.free_content_leads TO nocouser;
GRANT USAGE, SELECT ON SEQUENCE public.free_content_leads_id_seq TO nocouser;
