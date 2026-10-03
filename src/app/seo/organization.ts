// Fonte unica de valores reais usados nos blocos JSON-LD dos 4 HTMLs estaticos
// (src/index.html, src/interest.html, src/pt_br/candles/index.html,
// src/es_ar/candles/index.html) e no sitemap.xml. Nao e importado em runtime —
// os HTMLs sao estaticos — serve so para evitar que os mesmos valores
// divirjam entre copias manuais.

export const baseUrl = "https://courses.ivana.academy";
export const platformUrl = "https://ivana.academy";

export const orgLegalName = "Ivana Lerea LTDA";
export const orgName = "Ivana Academy";
export const cnpj = "63.991.300/0001-08";

// Mesma logo usada na Navbar (src/app/components/Navbar.tsx linha ~60).
export const logoUrl = `${baseUrl}/images/logo.svg`;

export const contactBR = {
  telephone: "+55 48 99999-0000",
  email: "contato@ivana.academy",
  addressLocality: "Florianópolis",
  addressRegion: "SC",
  addressCountry: "BR",
};

export const contactAR = {
  email: "contacto@ivana.academy",
  addressLocality: "Buenos Aires",
  addressCountry: "AR",
};

// Unico link social real confirmado no codigo (src/app/components/LeadForm.tsx).
export const sameAs = ["https://wa.me/5548999990000"];
