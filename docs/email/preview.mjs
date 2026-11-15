// Gera prévias dos e-mails em /tmp/ivana-email-*.html (abra no navegador). Uso: node docs/email/preview.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync(new URL('./layout.js', import.meta.url), 'utf8');
const ivanaEmail = new Function(`${src}; return ivanaEmail;`)();
const samples = {
  'material-pt': { lang: 'pt', subject: 'Seu material gratuito', preheader: 'Seu link está aqui', greeting: 'Olá!', paragraphs: ['Aqui está o seu material gratuito da Ivana Academy: <strong>Apostila com 60 receitas de sabonetes</strong>.'], button: { label: 'Acessar agora', url: 'https://example.com/arquivo' }, fallback: true, reason: 'Você recebeu este e-mail porque pediu um material gratuito em courses.ivana.academy.' },
  'curso-es': { lang: 'es', subject: 'Ya podés acceder a tu curso gratuito', preheader: 'Tu acceso está listo', greeting: 'Hola Ana!', paragraphs: ['Te inscribimos en el curso gratuito <strong>Macramé</strong> en la plataforma de Ivana Academy.', 'Si es tu primer acceso, la plataforma te envía otro e-mail para definir tu contraseña.'], button: { label: 'Ir al curso', url: 'https://ivana.academy/course/view.php?id=45' }, fallback: true, reason: 'Recibiste este e-mail porque te inscribiste en un curso gratuito en courses.ivana.academy.' },
};
for (const [k, v] of Object.entries(samples)) {
  const r = ivanaEmail(v);
  writeFileSync(`/tmp/ivana-email-${k}.html`, r.html);
  writeFileSync(`/tmp/ivana-email-${k}.txt`, r.text);
  console.log(`/tmp/ivana-email-${k}.html (${r.html.length} bytes)`);
}
