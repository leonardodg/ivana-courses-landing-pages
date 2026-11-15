// Layout HTML dos e-mails enviados pelo n8n (conteúdo gratuito e matrícula). Fonte da verdade: este arquivo.
// O MESMO código é colado nos nós "Validate & Sanitize" dos workflows `free-content` e `free-enroll` (o n8n não importa
// arquivos). Mudou aqui? Atualize os dois nós. Prévia: `node docs/email/preview.mjs` gera os HTML em /tmp.
// Visual baseado no e-mail de boas-vindas da loja: fundo creme, cartão branco de 600 px, cabeçalho com o logo, botão rosé
// (#805252), rodapé com a marca. Só estilos inline e tabelas (compatível com Gmail, Outlook e celular).
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// o: { lang: 'pt'|'es', subject, preheader, greeting, paragraphs: [html], button: {label, url}, fallback: bool, reason, noSign: bool (sem despedida; avisos internos) }
function ivanaEmail(o) {
  const es = o.lang === 'es';
  const site = es ? 'https://courses.ivana.academy/es-ar/' : 'https://courses.ivana.academy/pt-br/';
  const logo = 'https://courses.ivana.academy/images/logo.png';
  const font = 'Arial,Helvetica,sans-serif';
  const p = (h) => `<p style='margin:0 0 16px;'>${h}</p>`;
  const body = (o.paragraphs || []).map(p).join('');
  const button = o.button
    ? `<table role='presentation' cellpadding='0' cellspacing='0' style='border-collapse:collapse;margin:8px 0 22px;'><tr><td style='background:#805252;border-radius:8px;'><a href='${o.button.url}' style='display:inline-block;padding:13px 24px;font-family:${font};font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px;'>${esc(o.button.label)}</a></td></tr></table>`
    : '';
  const fallback = o.button && o.fallback
    ? p(`<span style='font-size:13px;color:#514443;'>${es ? 'Si el botón no abre, copiá y pegá esta dirección en el navegador:' : 'Se o botão não abrir, copie e cole este endereço no navegador:'}<br><a href='${o.button.url}' style='color:#805252;word-break:break-all;'>${o.button.url}</a></span>`)
    : '';
  const sign = o.noSign ? '' : p(es ? '¡Buen estudio!<br>Equipo Ivana Academy' : 'Bons estudos!<br>Equipe Ivana Academy');
  const html = `<!DOCTYPE html><html lang='${es ? 'es-AR' : 'pt-BR'}'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>${esc(o.subject)}</title><style>@media only screen and (max-width:620px){.main{width:100% !important}.pad{padding:24px 18px !important}}</style></head>`
    + `<body style='margin:0;padding:0;background:#f7efe4;color:#1c1c1a;font-family:${font};'>`
    + `<div style='display:none;max-height:0;overflow:hidden;opacity:0;color:#f7efe4;'>${esc(o.preheader || '')}</div>`
    + `<table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse;background:#f7efe4;'><tr><td align='center' style='padding:24px 12px 32px;'>`
    + `<table role='presentation' class='main' width='600' cellpadding='0' cellspacing='0' style='border-collapse:collapse;width:600px;max-width:100%;background:#ffffff;text-align:left;'>`
    + `<tr><td class='pad' style='background:#fcf9f5;padding:28px 32px;border-bottom:1px solid #e1deda;'><a href='${site}' style='text-decoration:none;'><img src='${logo}' alt='Ivana Academy' width='180' style='display:block;border:0;height:auto;max-width:180px;'></a></td></tr>`
    + `<tr><td class='pad' style='padding:32px;font-family:${font};font-size:15px;line-height:1.6;color:#1c1c1a;'>${p(esc(o.greeting))}${body}${button}${fallback}${sign}</td></tr>`
    + `<tr><td class='pad' style='background:#f7efe4;color:#514443;padding:24px 32px;font-family:${font};font-size:12px;line-height:1.5;border-top:1px solid #e1deda;'>`
    + `<p style='margin:0 0 8px;color:#101828;font-family:Courier New,Courier,monospace;font-weight:bold;letter-spacing:1px;text-transform:uppercase;'>Ivana Academy</p>`
    + `<p style='margin:4px 0;'>${esc(o.reason || '')}</p>`
    + `<p style='margin:4px 0;'><a href='${site}' style='color:#805252;text-decoration:none;'>courses.ivana.academy</a></p>`
    + `<p style='margin:4px 0;'>&copy; Ivana Academy</p></td></tr></table></td></tr></table></body></html>`;
  const strip = (h) => String(h).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const text = [o.greeting, '', (o.paragraphs || []).map(strip).join('\n\n')]
    .concat(o.button ? ['', o.button.label + ': ' + o.button.url] : [])
    .concat(o.noSign ? [''] : ['', es ? '¡Buen estudio!' : 'Bons estudos!', 'Ivana Academy', ''])
    .concat([o.reason || '', site]).join('\n');
  return { html: html, text: text };
}
