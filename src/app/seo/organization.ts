// Valores reais de referência da organização (URL, razão social, contatos), para conferir os JSON-LD em
// src/app/seo/jsonld/*.json (um arquivo por página, injetados no <head> pelo plugin inject-json-ld do vite.config.ts)
// e o sitemap. Ao mudar telefone, e-mail ou endereço, atualize aqui e nos JSON-LD.

export const baseUrl = "https://courses.ivana.academy";
export const platformUrl = "https://ivana.academy";

export const orgLegalName = "Ivana Lerea LTDA";
export const orgName = "Ivana Academy";
export const cnpj = "63.991.300/0001-08";

// Mesma logo usada na Navbar (src/app/components/Navbar.tsx linha ~60).
export const logoUrl = `${baseUrl}/images/logo.svg`;

export const contactBR = {
  telephone: "+55 48 99167-1659",
  whatsapp: "https://wa.me/5548991671659",
  email: "contato@ivana.academy",
  addressLocality: "Florianópolis",
  addressRegion: "SC",
  addressCountry: "BR",
};

export const contactAR = {
  telephone: "+54 9 3757 20-1014",
  whatsapp: "https://wa.me/5493757201014",
  email: "contacto@ivana.academy",
  addressLocality: "Buenos Aires",
  addressCountry: "AR",
};

export const sameAs = [contactBR.whatsapp, contactAR.whatsapp];
