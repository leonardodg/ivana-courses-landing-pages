# Como cadastrar eventos na agenda (iCloud)

Tudo que a Ivana cadastra no calendário **Trabalho** do iCloud alimenta, sozinho:
o site (`courses.ivana.academy/agenda/`), os links do Instagram e o bot de WhatsApp.
O n8n relê o iCloud a cada consulta (cache de 5 min), então não precisa publicar nada.

## Regra de ouro

Só aparece para os alunos o evento que tiver **`publicar: sim`** nas **Notas**.
Compromissos pessoais (Quadro, Ex Mac, etc.) ficam privados, sem nenhum esforço.

## Modelo para copiar e colar

**Título:** nome do curso, do jeito que você falaria. Ex.: `Saboaria e extratos`

**Início / Fim:** o horário real da turma (fuso Brasília).

**Local (campo "Local" do evento):**
`Espaço Moura, Rua Correa Dutra 149 - Flamengo, Rio de Janeiro`

**Notas:**
```
publicar: sim
curso: saboaria
cidade: Rio de Janeiro
vagas: 12
valor: R$ 380
link: https://...
obs: texto livre (opcional)
```

Só `publicar: sim` é obrigatório. O resto é opcional.

| Campo | Para que serve | Exemplo |
|---|---|---|
| `publicar` | libera o evento para site, Instagram e bot | `sim` |
| `curso` | ajuda a reconhecer o curso quando o título é livre | `velas`, `saboaria`, `imersão` |
| `cidade` | filtro por cidade no site | `Rio de Janeiro` |
| `local` / `endereco` | só se **não** preencher o campo Local do evento | `Espaço Moura` |
| `vagas` | mostra "N vagas" | `12` |
| `valor` | mostra o preço (escreva `gratuito` para o selo Gratuito) | `R$ 380` |
| `status` | `ultimas-vagas` ou `esgotado` (esgotado some o botão de reservar) | `ultimas-vagas` |
| `link` | botão leva para esse link em vez do WhatsApp (precisa começar com `https://`) | `https://...` |
| `obs` | recado curto no card | `Traga avental` |

## Locais já conhecidos (preenchidos sozinhos se o título citar a cidade)

- **Rio de Janeiro:** Espaço Moura, Rua Correa Dutra 149 - Flamengo, Rio de Janeiro
- **Balneário Camboriú:** Eventos Elegance, Rua 3122, nº 481, Balneário Camboriú
- **Ingleses (Florianópolis):** Ivana Academy, Rua João Patrício, 109, Ingleses, Florianópolis

Para outra cidade, preencha o campo **Local** do evento com `Nome do espaço, endereço, cidade`.

## Cursos reconhecidos pelo título (ou pelo campo `curso`)

Saboaria e Extratos · Velas Aromáticas e de Moldes · Aromatizantes e Perfumes ·
Imersão de Velas · Velas de Oratório · Incensaria Natural · Macramé na Praia · Resina · Velas de Gel.
Fora dessa lista o evento aparece com o título que você digitou e a conferência avisa.

## Conferir depois de cadastrar

Abra `https://webhook.ivana.academy/webhook/agenda` e veja:

- `count`: quantos eventos foram publicados;
- `warnings`: avisos como "Sem endereço" ou "Curso não reconhecido";
- `stats.private`: quantos ficaram privados (de propósito).

Se um evento não apareceu, quase sempre falta `publicar: sim` nas Notas.
