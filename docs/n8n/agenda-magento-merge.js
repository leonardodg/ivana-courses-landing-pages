// Trecho do nó Code do workflow "GET /agenda" (n8n). Cole ANTES do `return` final.
// Pré-requisito: um nó HTTP Request chamado "Turmas Magento", antes deste Code, ver docs/AGENDA-MAGENTO.md.
// Efeito: no feed do Brasil, os cursos presenciais que existem no Magento passam a vir SÓ do Magento
// (turmas, datas, vagas restantes, esgotado, cancelado). O resto do iCloud (gratuitos, cursos fora
// da loja, Argentina) continua como antes. Se o Magento falhar, usa a última cópia boa (até 1 h); sem
// cópia, o feed volta a ser só o do iCloud.
const MAGENTO_STALE_MS = 3600000;
let magento = null;
try {
  const j = $('Turmas Magento').first().json;
  if (j && Array.isArray(j.events) && Array.isArray(j.courses)) {
    magento = j;
    sd.magento = j;
    sd.magentoAt = Date.now();
  }
} catch (e) { /* nó falhou ou não executou: cai no cache */ }
let magentoSource = magento ? 'magento' : 'indisponivel';
if (!magento && sd.magento && Date.now() - (sd.magentoAt || 0) < MAGENTO_STALE_MS) {
  magento = sd.magento;
  magentoSource = 'magento-cache-antigo';
}
stats.magento = 0;
if (wantCountry === 'BR' && magento) {
  const managed = new Set(magento.courses);
  const today = nowSp.toISOString().slice(0, 10);
  const fromMagento = magento.events.filter((e) => e.date >= today); // turma passada sai sozinha
  const kept = events.filter((e) => !managed.has(e.course));
  events.splice(0, events.length, ...kept, ...fromMagento);
  events.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
  stats.magento = fromMagento.length;
}
stats.magento_source = magentoSource;
