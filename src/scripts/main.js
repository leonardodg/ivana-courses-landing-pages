let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('es') ? 'es' : navigator.language.startsWith('en') ? 'en' : 'pt');

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('active-lang', el.getAttribute('data-lang') === lang);
  });
  document.querySelectorAll('.lang-btn').forEach((btn, i) => {
    btn.classList.toggle('active', ['pt','es','en'][i] === lang);
  });
}

function filterCat(cat) {
  const cats = ['velas','saboaria','resina','macrame'];
  document.querySelectorAll('.cat-nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-cat="${cat}"]`).classList.add('active');
  if (cat === 'all') {
    cats.forEach(c => { document.getElementById('cat-'+c).style.display = ''; });
    document.querySelectorAll('.section-divider').forEach(d => d.style.display = '');
  } else {
    cats.forEach(c => {
      const el = document.getElementById('cat-'+c);
      if (el) el.style.display = c === cat ? '' : 'none';
    });
    document.querySelectorAll('.section-divider').forEach(d => d.style.display = 'none');
    const target = document.getElementById('cat-'+cat);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

if (typeof window !== 'undefined') {
  window.setLang = setLang;
  window.filterCat = filterCat;
}

document.addEventListener('DOMContentLoaded', () => setLang(currentLang));