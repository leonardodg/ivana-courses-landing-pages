# Turmas presenciais do Brasil: o Magento é a fonte

A partir daqui, **turma, data, local, vagas, esgotado e cancelado dos cursos presenciais do Brasil vêm do
admin do Magento (Ivana Loja Brasil)**. As landing pages continuam lendo o mesmo feed público do n8n
(`https://webhook.ivana.academy/webhook/agenda`); só o que alimenta esse feed mudou.

```
Admin Magento (turmas)  ──►  /ivana_courses/agenda/feed (chave)  ──►  n8n (junta com o iCloud)  ──►  landing pages
vagas pagas (fatura) ──┘                                              cache de 60 s no Nginx
```

## O que a equipe faz no Magento (CRUD)

| Quero | No admin (Catálogo > Produtos) |
|---|---|
| **Nova turma** | Criar produto do conjunto **Turma**, ligado ao curso configurável (`CURSO-<slug>`), com Turma (rótulo "dd/mm · cidade"), data, término, local ("Espaço — endereço"), vagas e preço. Ativo. |
| **Reduzir/aumentar vagas** | Campo **Vagas da turma**. As vagas que aparecem são esse número menos as já pagas. |
| **Cancelar turma** | Marcar **Turma cancelada = Sim**. Continua publicada com o selo "Turma cancelada", sem botão de reservar, e some do carrinho. Quem já pagou: estornar o pedido (devolve a vaga). |
| **Esgotada** | Automático: vagas pagas = capacidade. Selo "Esgotada" e lista de espera. |
| **Tirar do ar** | Desativar o produto da turma: some do feed e do site. |

"Últimas vagas" é automático (restam 2 ou menos). Vaga conta só com fatura paga.

## Como ligar (nesta ordem)

1. **Magento:** `bin/magento setup:upgrade` (cria o atributo `ivana_session_cancelled`) e `cache:flush`.
2. **Chave:** gerar uma chave aleatória de 32+ caracteres e salvar em
   *Lojas > Configuração > Catálogo > Catálogo > Ivana — turmas pela agenda > Chave do feed das turmas*.
   Sem chave ou com chave errada o endpoint responde 404.
3. **Cron antigo desligado:** `ivana_courses/agenda/enabled = 0`. O cron lia o feed do n8n e criava turmas
   do iCloud; com o Magento como fonte, os dois disputariam as mesmas turmas.
4. **n8n** (workflow `GET /agenda`):
   - criar uma credencial **Header Auth** (`X-Agenda-Key` = a chave) no próprio n8n, como texto fixo
     (o n8n 2.x bloqueia `$env` em credenciais, ver `docs/SEGURANCA.md`);
   - adicionar um nó **HTTP Request** chamado `Turmas Magento` (GET, `https://<loja>/ivana_courses/agenda/feed`,
     credencial acima, timeout 10 s, *On Error: Continue*), antes do nó Code;
   - colar `docs/n8n/agenda-magento-merge.js` no Code, antes do `return` final.
5. **Nginx da VPS** (frente do `webhook.ivana.academy`): `proxy_cache` de 60 s em `/webhook/agenda`
   (chave inclui `?pais`), para a vaga atualizar em até 1 min e o Magento não ser consultado a cada visita.
   No Nginx do Magento: `limit_req` em `/ivana_courses/agenda/feed` e, se possível, `allow` só do IP da VPS.

## Regras de convivência com o iCloud

- Curso que **existe no Magento** (configurável presencial ativo): só o Magento manda. Evento do iCloud
  desse curso é ignorado.
- Curso fora do Magento, evento gratuito e Argentina: continuam pelo iCloud, como em `docs/AGENDA-PADRAO.md`.
- Magento fora do ar: usa a última cópia boa por até 1 h; depois disso o feed volta ao iCloud (vagas viram
  o texto digitado de novo).
- O feed não leva dado de aluno: só turma, local, preço e vagas.

## Conferir

`https://webhook.ivana.academy/webhook/agenda`: `stats.magento` (turmas vindas do Magento) e
`stats.magento_source` (`magento`, `magento-cache-antigo` ou `indisponivel`). Cada evento do Magento traz
`source: "magento"`, `seats_remaining`, `capacity` e `status` (`aberto`, `ultimas-vagas`, `esgotado`, `cancelado`).
