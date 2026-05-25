import { CategorySpec } from "../classes/types";
import { categories_text } from "../lang/categories";

export const categories_data: Record<string, CategorySpec> = {
  velas: {
    id: "velas",
    name: categories_text.candle.name,
    themeColor: "from-velas-start to-velas-end", // Elegant Dusty Rose transition
    accentBg: "bg-velas-accent",
    accentText: "text-velas-accent",
    heroBgClass: "from-hero-bg via-hero-bg to-velas-hero",
    badgeLogo: "✨",
  },
  saboaria: {
    id: "saboaria",
    name: categories_text.soap.name,
    themeColor: "from-saboaria-start to-saboaria-end", // Soft Sage Green
    accentBg: "bg-saboaria-accent",
    accentText: "text-saboaria-accent",
    heroBgClass: "from-hero-bg via-hero-bg to-saboaria-hero",
    badgeLogo: "🌿",
  },
  resinas: {
    id: "resinas",
    name: categories_text.resin.name,
    themeColor: "from-resinas-start to-resinas-end", // Ocean Blue/Teal
    accentBg: "bg-resinas-accent",
    accentText: "text-resinas-accent",
    heroBgClass: "from-hero-bg via-hero-bg to-resinas-hero",
    badgeLogo: "💎",
  },
  macrame: {
    id: "macrame",
    name: categories_text.macrame.name,
    themeColor: "from-macrame-start to-macrame-end", // Terracotta earthy
    accentBg: "bg-macrame-accent",
    accentText: "text-macrame-accent",
    heroBgClass: "from-hero-bg via-hero-bg to-macrame-hero",
    badgeLogo: "🧶",
  },
  aromas_incensos: {
    id: "aromas_incensos",
    name: categories_text.incense.name,
    themeColor: "from-incenso-start to-incenso-end", // Deep Amethyst / Purple Rose
    accentBg: "bg-incenso-accent",
    accentText: "text-incenso-accent",
    heroBgClass: "from-hero-bg via-hero-bg to-incenso-hero",
    badgeLogo: "🔮",
  },
};
