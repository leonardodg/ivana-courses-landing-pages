// Textos das páginas legais. Dados da empresa vêm de ./company.
import type { ReactNode } from 'react';
import { company as c } from './company';

export interface Section {
  id: string;
  title: string;
  body: ReactNode;
}

export interface LegalDoc {
  title: string;
  intro: ReactNode;
  sections: Section[];
}

const mail = <a href={`mailto:${c.email}`} className="underline text-primary">{c.email}</a>;
const wa = <a href={c.whatsappUrl} target="_blank" rel="noreferrer" className="underline text-primary">{c.whatsappLabel}</a>;

export const Ul = ({ items }: { items: ReactNode[] }) => (
  <ul className="list-disc pl-5 space-y-1.5">
    {items.map((i, n) => <li key={n}>{i}</li>)}
  </ul>
);

export const privacidade: LegalDoc = {
  title: 'Política de Privacidade',
  intro: (
    <p>
      Esta política explica, em linguagem simples, como a {c.legalName} (&ldquo;{c.tradeName}&rdquo;, CNPJ {c.cnpj}) trata
      os seus dados pessoais nos sites {c.site.replace('https://', '')}, {c.platform.replace('https://', '')} e
      {' '}{c.store.replace('https://', '')}, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
    </p>
  ),
  sections: [
    {
      id: 'controlador',
      title: '1. Quem é o controlador',
      body: (
        <>
          <p>{c.legalName}, CNPJ {c.cnpj}, nome fantasia {c.tradeName}. Contato para qualquer assunto de privacidade: {mail} ou WhatsApp {wa}.</p>
          <p>Encarregada pelo tratamento de dados pessoais (art. 41 da LGPD): {c.dpoName}, pelo mesmo e-mail.</p>
        </>
      ),
    },
    {
      id: 'dados',
      title: '2. Quais dados coletamos e para quê',
      body: (
        <>
          <p>Coletamos só o necessário para cada finalidade:</p>
          <Ul
            items={[
              <><strong>Formulários de contato, interesse e cupom:</strong> nome, e-mail, telefone (com DDI), cursos de interesse e a mensagem que você escrever. Usamos para responder você, avisar sobre turmas e enviar o cupom de boas-vindas. Base legal: consentimento (art. 7º, I).</>,
              <><strong>Reserva e compra de cursos (loja):</strong> nome, sobrenome, telefone e e-mail; o CPF é informado diretamente no pagamento. Usamos para confirmar a vaga, emitir comprovantes e certificados e cumprir obrigações fiscais. Base legal: execução de contrato e obrigação legal (art. 7º, V e II).</>,
              <><strong>Pedidos feitos pelo WhatsApp:</strong> o número e as mensagens que você enviar, para atendimento e reserva de vaga. Base legal: procedimentos preliminares a contrato e consentimento.</>,
              <><strong>Registros de acesso:</strong> como qualquer site, os servidores registram IP, data e hora de cada acesso. Guardamos esses registros pelo prazo mínimo exigido pelo Marco Civil da Internet (6 meses, art. 15 da Lei nº 12.965/2014) e só os usamos para segurança e para cumprir ordem judicial.</>,
              <><strong>Segurança do site:</strong> limitamos o número de envios de formulário por minuto e usamos um campo invisível contra robôs. Base legal: legítimo interesse (art. 7º, IX), sem identificar você.</>,
              <><strong>Estatísticas de visita (somente se você aceitar):</strong> páginas visitadas, tipo de dispositivo e origem aproximada, de forma agregada, pelo Google Analytics 4. Base legal: consentimento.</>,
            ]}
          />
          <p>Não pedimos dados sensíveis (saúde, religião, origem racial etc.) e não coletamos dados de menores de 18 anos; se isso ocorrer por engano, apagaremos assim que soubermos.</p>
        </>
      ),
    },
    {
      id: 'compartilhamento',
      title: '3. Com quem compartilhamos',
      body: (
        <>
          <p>Não vendemos dados. Compartilhamos apenas com quem precisa para prestar o serviço:</p>
          <Ul
            items={[
              'Provedores de hospedagem e automação do nosso atendimento (servidores da Ivana Academy e ferramenta de fluxos que recebe os formulários);',
              'Cloudflare, que entrega e protege o site (rede de distribuição e segurança) e mede o desempenho das páginas;',
              'Meios de pagamento da loja (Mercado Pago), que tratam os dados de pagamento sob a política deles;',
              'WhatsApp (Meta), quando você fala conosco por lá;',
              'Google, apenas se você aceitar os cookies de estatísticas;',
              'Autoridades, quando houver obrigação legal ou ordem judicial.',
            ]}
          />
          <p>Alguns desses provedores podem armazenar dados fora do Brasil. Nesses casos, adotamos as garantias previstas no art. 33 da LGPD.</p>
        </>
      ),
    },
    {
      id: 'retencao',
      title: '4. Por quanto tempo guardamos',
      body: (
        <Ul
          items={[
            'Contatos e interesses: enquanto houver relacionamento e, depois disso, por até 24 meses sem interação, ou até você pedir a exclusão;',
            'Dados de compra, comprovantes e certificados: pelo prazo exigido por lei fiscal e consumerista (em regra, 5 anos);',
            'Registro da sua escolha de cookies: 12 meses no seu navegador.',
          ]}
        />
      ),
    },
    {
      id: 'direitos',
      title: '5. Seus direitos',
      body: (
        <>
          <p>Você pode, a qualquer momento (art. 18 da LGPD): confirmar se tratamos seus dados; acessar; corrigir; pedir anonimização, bloqueio ou eliminação de dados desnecessários; pedir portabilidade; saber com quem compartilhamos; revogar o consentimento; e se opor a um tratamento.</p>
          <p>Faça o pedido pelo <a href="/pt_br/lgpd/" className="underline text-primary">formulário de direitos LGPD</a>, por {mail} ou pelo WhatsApp {wa}. Respondemos em até 15 dias. Para sua segurança, podemos pedir uma confirmação de identidade. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (gov.br/anpd).</p>
        </>
      ),
    },
    {
      id: 'cookies',
      title: '6. Cookies e armazenamento no navegador',
      body: (
        <>
          <Ul
            items={[
              <><strong>Essenciais (sempre ativos):</strong> guardam a sua escolha de cookies (<code>ivana-consent</code>) e uma cópia da agenda pública de turmas (<code>ivana-agenda-v1</code>) para o site carregar mais rápido. Não identificam você.</>,
              <><strong>Estatísticas (só com o seu aceite):</strong> cookies do Google Analytics 4 (<code>_ga</code>, <code>_ga_*</code>), com validade de até 2 anos. Se você recusar ou retirar o aceite, eles não são carregados e os já criados são apagados.</>,
              <><strong>Medição de desempenho (Cloudflare Web Analytics):</strong> a Cloudflare, que entrega o site, mede o tempo de carregamento e as visitas de forma agregada. Segundo a própria Cloudflare, esse serviço não usa cookies nem identifica você individualmente; por isso funciona sem pedir consentimento. Você pode se opor pelo e-mail de privacidade.</>,
              <><strong>Publicidade:</strong> não usamos cookies de publicidade nem pixels de redes sociais neste site.</>,
            ]}
          />
          <p>Para mudar a sua escolha, use &ldquo;Preferências de cookies&rdquo; no rodapé de qualquer página. As fontes do site são hospedadas por nós; abrir uma página não envia o seu IP ao Google Fonts.</p>
        </>
      ),
    },
    {
      id: 'seguranca',
      title: '7. Segurança',
      body: <p>Usamos conexão segura (HTTPS), controle de acesso aos sistemas e coleta mínima de dados. Nenhum sistema é totalmente imune; se houver incidente que possa causar risco relevante a você, comunicaremos você e a ANPD, conforme o art. 48 da LGPD.</p>,
    },
    {
      id: 'imagens',
      title: '8. Fotos e vídeos das turmas',
      body: <p>Podemos registrar imagens durante os cursos. Só publicamos imagem em que uma aluna possa ser identificada com a autorização dela. Para pedir a remoção de uma imagem sua, escreva para {mail}.</p>,
    },
    {
      id: 'mudancas',
      title: '9. Mudanças nesta política',
      body: <p>Podemos atualizar este texto. A data da última versão está no topo da página; mudanças relevantes serão avisadas no site.</p>,
    },
  ],
};

export const termos: LegalDoc = {
  title: 'Termos de Uso',
  intro: (
    <p>
      Ao usar os sites da {c.tradeName} ({c.site.replace('https://', '')}, {c.platform.replace('https://', '')} e {c.store.replace('https://', '')}),
      você concorda com estes termos. Eles complementam a <a href="/pt_br/privacidade/" className="underline text-primary">Política de Privacidade</a> e a{' '}
      <a href="/pt_br/reembolso/" className="underline text-primary">Política de Reembolso e Cancelamento</a>.
    </p>
  ),
  sections: [
    {
      id: 'quem',
      title: '1. Quem somos',
      body: <p>{c.legalName}, CNPJ {c.cnpj}, que atua com o nome {c.tradeName}. Contato: {mail} ou WhatsApp {wa}.</p>,
    },
    {
      id: 'servicos',
      title: '2. O que oferecemos',
      body: (
        <>
          <p>Cursos presenciais (workshops e imersões) e cursos online de artesanato, vendidos na loja {c.store.replace('https://', '')} ou combinados pelo WhatsApp. Este site de cursos serve para divulgar turmas, datas, valores e como se inscrever.</p>
          <p>Datas, horários, locais, valores e vagas podem mudar. Vale o que estiver na página do curso na loja no momento da compra.</p>
        </>
      ),
    },
    {
      id: 'inscricao',
      title: '3. Inscrição, vagas e turmas',
      body: (
        <Ul
          items={[
            'A vaga só é garantida depois da confirmação do pagamento (ou do sinal combinado pelo WhatsApp).',
            'Cada turma tem número limitado de vagas.',
            'Se uma turma não acontecer por decisão nossa, você escolhe entre remarcar ou receber reembolso integral.',
            'O que está incluso (materiais, apostila, certificado, café) está descrito em cada curso.',
          ]}
        />
      ),
    },
    {
      id: 'uso',
      title: '4. Como você pode usar o conteúdo',
      body: (
        <>
          <p>Aulas, apostilas, receitas, vídeos, marcas e imagens são protegidos por direitos autorais e pertencem à {c.legalName} ou a seus licenciantes. A compra dá a você licença pessoal e intransferível de uso.</p>
          <p>Você pode produzir e vender o que fizer a partir do que aprendeu. É proibido copiar, compartilhar, revender ou publicar as apostilas, aulas e demais materiais, no todo ou em parte, sem autorização escrita.</p>
        </>
      ),
    },
    {
      id: 'responsabilidade',
      title: '5. Resultados e responsabilidade',
      body: (
        <>
          <p>Ensinamos técnicas de artesanato. Resultados pessoais e financeiros dependem de cada pessoa, do mercado e de muitos fatores; não prometemos nem garantimos renda, vendas ou lucro.</p>
          <p>Nas aulas presenciais, siga as orientações de segurança (por exemplo, no uso de ceras aquecidas, essências e ferramentas). Quem produz para vender deve cumprir as regras que valem para o seu produto (como registro, rotulagem e normas sanitárias aplicáveis).</p>
        </>
      ),
    },
    {
      id: 'conduta',
      title: '6. Convivência e uso do site',
      body: <p>Não use os sites para fraude, envio de conteúdo ilegal, tentativa de invasão ou sobrecarga. Podemos limitar ou encerrar o acesso em caso de abuso. Em aula, esperamos respeito a colegas e à equipe.</p>,
    },
    {
      id: 'links',
      title: '7. Links e serviços de terceiros',
      body: <p>Nossos sites levam a serviços de terceiros (loja, pagamento, WhatsApp, Instagram). Cada um tem as próprias regras e não somos responsáveis pelo conteúdo ou pelas práticas deles.</p>,
    },
    {
      id: 'lei',
      title: '8. Lei aplicável e solução de conflitos',
      body: <p>Estes termos seguem a lei brasileira, em especial o Código de Defesa do Consumidor (Lei nº 8.078/1990) e a LGPD. Antes de qualquer medida, procure-nos pelo {c.email} para tentarmos resolver. Fica ressalvado o direito do consumidor de ajuizar ação no foro do seu domicílio.</p>,
    },
    {
      id: 'mudancas',
      title: '9. Mudanças',
      body: <p>Podemos atualizar estes termos; a versão vigente é a publicada nesta página, com a data no topo. Compras já feitas seguem as regras vigentes quando foram feitas.</p>,
    },
  ],
};

export const reembolso: LegalDoc = {
  title: 'Política de Reembolso e Cancelamento',
  intro: (
    <p>
      Esta política vale para os cursos vendidos pela {c.tradeName}. Ela respeita o Código de Defesa do Consumidor (Lei nº 8.078/1990)
      e, havendo diferença, vale o que for mais favorável a você.
    </p>
  ),
  sections: [
    {
      id: 'arrependimento',
      title: '1. Direito de arrependimento (7 dias)',
      body: (
        <>
          <p>Em compras feitas pela internet ou fora do estabelecimento, você pode desistir em até 7 dias corridos, contados da compra ou do recebimento do serviço, o que ocorrer por último (art. 49 do CDC), sem precisar explicar o motivo. Vale para cursos online e presenciais.</p>
          <p>Pedido: envie e-mail para {mail} ou mensagem para {wa} informando nome e e-mail usados na compra.</p>
        </>
      ),
    },
    {
      id: 'como',
      title: '2. Como é feito o reembolso',
      body: <p>O valor pago é devolvido integralmente, pelo mesmo meio de pagamento usado na compra (Pix ou cartão). O prazo para o valor aparecer segue o da operadora do cartão ou do banco.</p>,
    },
    {
      id: 'remarcacao',
      title: '3. Remarcação de turma',
      body: <p>Se você não puder comparecer, avise-nos o quanto antes. Você pode passar para a próxima turma do mesmo curso, sem custo, conforme a disponibilidade de vagas.</p>,
    },
    {
      id: 'depois',
      title: '4. Cancelamento depois dos 7 dias',
      body: <p>Passado o prazo de arrependimento, o cancelamento e a devolução de valores são analisados caso a caso, conversando com você e buscando uma solução justa para os dois lados.</p>,
    },
    {
      id: 'turma',
      title: '5. Se a turma for cancelada ou alterada por nós',
      body: <p>Se cancelarmos a turma ou mudarmos data ou local de forma que você não consiga participar, você escolhe: nova turma sem custo ou reembolso integral.</p>,
    },
    {
      id: 'online',
      title: '6. Cursos online e materiais digitais',
      body: <p>Nos cursos online, vale o prazo de 7 dias da compra. Depois disso, o acesso segue as condições descritas na página de cada curso.</p>,
    },
    {
      id: 'sinal',
      title: '7. Sinal combinado pelo WhatsApp',
      body: <p>Quando a vaga é reservada com sinal pelo atendimento, o sinal é abatido do valor do curso. A devolução do sinal segue os itens acima.</p>,
    },
  ],
};
