// velas.js - scripts específicos da página Cursos de Velas
// Depende de: main.js (setLang já definido globalmente) e Swiper (CDN)

const translations = {
  pt: {
    faq: [
      { q: 'Preciso ter experiência para fazer os cursos?', a: 'Não! Os cursos são desenvolvidos para todos os níveis. Desde quem nunca fez uma vela na vida até quem já produz e quer se profissionalizar. A Ivana acompanha cada aluna no seu ritmo.' },
      { q: 'Os materiais estão incluídos nos cursos presenciais?', a: 'Sim! Nos cursos presenciais (Imersão e Workshop) todos os materiais já estão incluídos no valor da inscrição. Você só precisa chegar e aprender. No final, leva tudo que produziu para casa.' },
      { q: 'Como funcionam os cursos online?', a: 'Os cursos online ficam disponíveis na plataforma Ivana Academy (Moodle). Após a inscrição você recebe acesso imediato aos vídeos e conteúdos. Você estuda no seu tempo, sem prazo de expiração.' },
      { q: 'É possível fazer os cursos fora de Florianópolis?', a: 'Sim! A Ivana frequentemente realiza workshops e imersões em outras cidades como Rio de Janeiro, Curitiba e Blumenau. Fique atenta às redes sociais para não perder as próximas datas.' },
      { q: 'Recebo certificado ao concluir o curso?', a: 'Sim! Todos os cursos emitem certificado de conclusão. Os cursos de formação em parceria com o Conservatório Grassi (Argentina) emitem títulos de nível técnico e de professorado reconhecidos internacionalmente.' },
      { q: 'Consigo realmente vender e ganhar dinheiro com velas?', a: 'Absolutamente! Centenas de alunas da Ivana Academy hoje têm seus próprios negócios de velas. O diferencial da Ivana é exatamente esse: além da técnica, ela ensina precificação, criação de portfólio, estratégias de venda e como conquistar clientes.' },
      { q: 'Os cursos de Argentina são em espanhol?', a: 'Sim! Os cursos do Conservatório Grassi (Tecnicatura e Profesorado) são ministrados em espanhol. Os demais cursos online e presenciais são em português, para o público brasileiro.' },
      { q: 'Como me inscrever?', a: 'Você pode se inscrever diretamente pelo WhatsApp, pelo formulário desta página ou acessando a plataforma ivana.academy. Nossa equipe vai te guiar em todo o processo de inscrição.' },
    ],
  },
  es: {
    faq: [
      { q: '¿Necesito experiencia previa para hacer los cursos?', a: '¡No! Los cursos están diseñados para todos los niveles. Desde quien nunca hizo una vela hasta quien ya produce y quiere profesionalizarse.' },
      { q: '¿Los materiales están incluidos en los cursos presenciales?', a: '¡Sí! En los cursos presenciales todos los materiales ya están incluidos en el valor de la inscripción. Solo necesitas llegar y aprender.' },
      { q: '¿Cómo funcionan los cursos online?', a: 'Los cursos online están disponibles en la plataforma Ivana Academy (Moodle). Estudias a tu ritmo, sin fecha de vencimiento.' },
      { q: '¿Recibo certificado al terminar?', a: '¡Sí! Todos los cursos emiten certificado. Los cursos con el Conservatorio Grassi emiten títulos de nivel técnico y de profesorado reconocidos internacionalmente.' },
      { q: '¿Puedo realmente ganar dinero con velas?', a: '¡Absolutamente! Cientos de alumnas de Ivana Academy hoy tienen sus propios negocios de velas. Ivana enseña técnica + precificación + estrategias de venta.' },
      { q: '¿Cómo me inscribo?', a: 'Puedes inscribirte por WhatsApp, por el formulario de esta página o accediendo a la plataforma ivana.academy.' },
    ],
  },
  en: {
    faq: [
      { q: 'Do I need experience to take the courses?', a: 'Not at all! Courses are designed for all levels, from complete beginners to those who want to professionalize their craft.' },
      { q: 'Are materials included in in-person courses?', a: 'Yes! In in-person courses (Immersion and Workshop), all materials are included in the registration fee. You just show up and learn.' },
      { q: 'How do online courses work?', a: 'Online courses are available on the Ivana Academy platform (Moodle). You study at your own pace with lifetime access.' },
      { q: 'Will I receive a certificate?', a: 'Yes! All courses issue completion certificates. Courses in partnership with Conservatorio Grassi (Argentina) issue internationally recognized technical and teaching titles.' },
      { q: 'How do I enroll?', a: 'You can enroll via WhatsApp, through the form on this page, or by accessing ivana.academy. Our team will guide you through the process.' },
    ],
  },
};

// ---- FAQ ----------------------------------------------------------------
function renderFAQ() {
  const lang = localStorage.getItem('lang') || 'pt';
  const faqs = translations[lang]?.faq || translations.pt.faq;
  document.getElementById('faq-list').innerHTML = faqs
    .map(
      (item, i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-q" onclick="toggleFAQ(${i})">
        <span>${item.q}</span>
        <div class="faq-arrow">+</div>
      </button>
      <div class="faq-a">${item.a}</div>
    </div>`,
    )
    .join('');
}

function toggleFAQ(i) {
  document.getElementById('faq-' + i).classList.toggle('open');
}

// ---- Lead form ----------------------------------------------------------
async function submitLead(e) {
  e.preventDefault();
  const form = e.target;
  const lang = localStorage.getItem('lang') || 'pt';
  const data = {
    name: form.name.value,
    phone: form.phone.value,
    email: form.email.value,
    course: form.course.value,
    source: 'landing-velas',
    lang,
  };

  const btn = form.querySelector('.form-submit');
  btn.textContent = lang === 'en' ? 'Sending...' : 'Enviando...';
  btn.disabled = true;

  try {
    await fetch('https://n8n.seudominio.com/webhook/lp/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (_) {
    // webhook failure is non-fatal
  }

  const msg =
    lang === 'pt'
      ? '✅ Recebemos seu interesse! Nossa equipe vai entrar em contato em breve.'
      : lang === 'es'
        ? '✅ ¡Recibimos tu interés! Nuestro equipo se pondrá en contacto pronto.'
        : '✅ We received your interest! Our team will contact you soon.';

  form.innerHTML = `
    <div style="text-align:center;padding:2rem 0">
      <div style="font-size:3rem;margin-bottom:1rem">✅</div>
      <p style="font-family:var(--font-serif);font-size:1.3rem;color:var(--color-primary-dark)">${msg}</p>
    </div>`;
}

// ---- Swiper -------------------------------------------------------------
function initSwiper() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.testiswiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}

// ---- Re-render FAQ on lang change (override setLang from main.js) --------
const _baseSsetLang = window.setLang;
window.setLang = function (lang) {
  _baseSsetLang(lang);
  renderFAQ();
};

// ---- Init ---------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderFAQ();
  initSwiper();
});
