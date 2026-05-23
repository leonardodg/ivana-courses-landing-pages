import { CategorySpec } from "../classes/types";
import { categories_text } from "../lang/categories";

export const categories_data: Record<string, CategorySpec> = {
  velas: {
    id: "velas",
    name: categories_text.candle.name,
    themeColor: "from-[#805252] to-[#B27D7C]", // Elegant Dusty Rose transition
    accentBg: "bg-[#ffdad9]",
    accentText: "text-[#805252]",
    heroBgClass: "from-[#FAF6F0] via-[#FAF6F0] to-[#EBC2C1]",
    badgeLogo: "✨",
  },
  saboaria: {
    id: "saboaria",
    name: categories_text.soap.name,
    themeColor: "from-[#4D6551] to-[#76917A]", // Soft Sage Green
    accentBg: "bg-[#D2E7D6]",
    accentText: "text-[#324536]",
    heroBgClass: "from-[#FAF6F0] via-[#FAF6F0] to-[#C9DACD]",
    badgeLogo: "🌿",
  },
  resinas: {
    id: "resinas",
    name: categories_text.resin.name,
    themeColor: "from-[#3A6073] to-[#4F8CA3]", // Ocean Blue/Teal
    accentBg: "bg-[#D5E6EE]",
    accentText: "text-[#1B3E4F]",
    heroBgClass: "from-[#FAF6F0] via-[#FAF6F0] to-[#BDD8E4]",
    badgeLogo: "💎",
  },
  macrame: {
    id: "macrame",
    name: categories_text.macrame.name,
    themeColor: "from-[#8A5134] to-[#B3795C]", // Terracotta earthy
    accentBg: "bg-[#FFDFD2]",
    accentText: "text-[#5C2B11]",
    heroBgClass: "from-[#FAF6F0] via-[#FAF6F0] to-[#FFECD5]",
    badgeLogo: "🧶",
  },
  aromas_incensos: {
    id: "aromas_incensos",
    name: categories_text.incense.name,
    themeColor: "from-[#6E4B6E] to-[#9B6F9B]", // Deep Amethyst / Purple Rose
    accentBg: "bg-[#F2DDF2]",
    accentText: "text-[#441D44]",
    heroBgClass: "from-[#FAF6F0] via-[#FAF6F0] to-[#ECCDEB]",
    badgeLogo: "🔮",
  },
};
