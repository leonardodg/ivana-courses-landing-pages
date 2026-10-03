#!/usr/bin/env node
/**
 * seed-test-contacts.js
 *
 * Dispara N contatos de teste direto no webhook do N8N,
 * simulando submissões reais do formulário com dados variados.
 *
 * Uso:
 *   node seed-test-contacts.js                  → 5 contatos, delay 1s
 *   node seed-test-contacts.js --count 20        → 20 contatos
 *   node seed-test-contacts.js --count 10 --delay 500
 *   node seed-test-contacts.js --rate-limit-test  → dispara rápido pra testar 429
 * 
 * 
 * # Definir as variáveis de ambiente (uma vez por sessão de terminal)
 * export VITE_WEBHOOK_URL="https://webhook.ivana.academy/webhook-test/contact"
 * export VITE_WEBHOOK_SECRET="seu-token-32-bytes-aqui"
 */

// const WEBHOOK_URL    = process.env.VITE_WEBHOOK_URL    || 'https://webhook.ivana.academy/webhook-test/contact'
const WEBHOOK_URL =
  process.env.VITE_WEBHOOK_URL ||
  "https://webhook.ivana.academy/webhook/contact";
const WEBHOOK_SECRET = process.env.VITE_WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  console.error("ERRO: defina VITE_WEBHOOK_SECRET no ambiente antes de rodar este script.");
  process.exit(1);
}

// ─── Dados de teste — nomes, emails e mensagens realistas em pt-BR ──────────

const FIRST_NAMES = [
  'Maria', 'Ana', 'Juliana', 'Fernanda', 'Patricia', 'Camila', 'Beatriz',
  'Larissa', 'Gabriela', 'Carolina', 'Renata', 'Tatiane', 'Vanessa', 'Bruna',
]
const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa',
  'Carvalho', 'Gomes', 'Ribeiro', 'Almeida', 'Nascimento', 'Araujo',
]
const SUBJECTS_BY_SOURCE = {
  candles:  ['Interesse no curso de velas', 'Dúvida sobre material de velas', 'Curso presencial de velas aromáticas'],
  soap:     ['Curso de sabonetes artesanais', 'Saboaria natural - dúvida', 'Workshop de sabonetes'],
  resins:   ['Curso de resina epóxi', 'Dúvida sobre resina para iniciantes', 'Quero fazer joias em resina'],
  homepage: ['Quero saber mais sobre os cursos', 'Informações gerais', 'Primeira vez, por onde começo?'],
}
const MESSAGE_TEMPLATES = [
  'Olá! Gostaria de saber mais sobre os horários disponíveis e valores do curso.',
  'Tenho interesse em começar do zero, vocês oferecem material incluso?',
  'Qual a duração do curso e se tem certificado ao final?',
  'Moro em outra cidade, o curso é presencial ou tem opção online?',
  'Gostaria de agendar uma conversa para entender melhor a metodologia.',
  'Vi o anúncio de vocês e fiquei muito interessada, podem me passar mais detalhes?',
]
const FORM_SOURCES = ['candles', 'soap', 'resins', 'homepage']
const EMAIL_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br']

// ─── Helpers ──────────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPhone() {
  const ddd = String(Math.floor(Math.random() * 89) + 11) // 11-99
  const num = String(Math.floor(Math.random() * 900000000) + 900000000)
  return `+55 ${ddd}${num}`
}

function generateContact() {
  const firstName = pick(FIRST_NAMES)
  const lastName  = pick(LAST_NAMES)
  const fullName  = `${firstName} ${lastName}`
  const source    = pick(FORM_SOURCES)
  const emailSlug = `${firstName}.${lastName}${Math.floor(Math.random() * 999)}`
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos

  return {
    full_name:   fullName,
    email:       `${emailSlug}@${pick(EMAIL_DOMAINS)}`,
    phone:       randomPhone(),
    subject:     pick(SUBJECTS_BY_SOURCE[source]),
    message:     pick(MESSAGE_TEMPLATES),
    form_source: source,
    timestamp:   new Date().toISOString(),
  }
}

async function sendContact(payload, index) {
  const start = Date.now()
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": WEBHOOK_SECRET,
        Origin: "https://courses.ivana.academy", // simula origem permitida
      },
      body: JSON.stringify(payload),
    });
    const ms = Date.now() - start
    const body = await res.text()
    const icon = res.ok ? '✅' : '❌'
    console.log(
      `${icon} [${index}] ${res.status} (${ms}ms) — ${payload.full_name} <${payload.email}> [${payload.form_source}]`
    )
    if (!res.ok) console.log(`     → ${body.slice(0, 150)}`)
  } catch (err) {
    console.log(`❌ [${index}] ERRO DE REDE — ${err.message}`)
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

// ─── CLI args ─────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2)
  const opts = { count: 5, delay: 1000, rateLimitTest: false }

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count')         opts.count = parseInt(args[++i], 10)
    if (args[i] === '--delay')         opts.delay = parseInt(args[++i], 10)
    if (args[i] === '--rate-limit-test') opts.rateLimitTest = true
  }
  return opts
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs()

  if (WEBHOOK_SECRET === 'COLOQUE_SEU_SECRET_AQUI') {
    console.error('⚠️  Defina VITE_WEBHOOK_SECRET como variável de ambiente antes de rodar:')
    console.error('   VITE_WEBHOOK_SECRET=seu-token node seed-test-contacts.js')
    process.exit(1)
  }

  console.log(`\n🚀 Disparando contatos de teste para: ${WEBHOOK_URL}`)
  console.log(`   Quantidade: ${opts.count} | Delay: ${opts.rateLimitTest ? '0ms (rate limit test)' : opts.delay + 'ms'}\n`)

  for (let i = 1; i <= opts.count; i++) {
    const contact = generateContact()
    await sendContact(contact, i)
    if (!opts.rateLimitTest && i < opts.count) {
      await sleep(opts.delay)
    }
  }

  console.log(`\n✅ Concluído — ${opts.count} contatos disparados.\n`)
}

main()