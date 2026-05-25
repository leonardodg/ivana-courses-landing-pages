---
name: Artisanal Elegance
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0ede9'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c1a'
  on-surface-variant: '#514443'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#837373'
  outline-variant: '#d5c2c1'
  surface-tint: '#805252'
  primary: '#805252'
  on-primary: '#ffffff'
  primary-container: '#d9a1a0'
  on-primary-container: '#603737'
  inverse-primary: '#f3b8b7'
  secondary: '#635e55'
  on-secondary: '#ffffff'
  secondary-container: '#e6dfd4'
  on-secondary-container: '#676259'
  tertiary: '#805533'
  on-tertiary: '#ffffff'
  tertiary-container: '#daa47d'
  on-tertiary-container: '#60391a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#f3b8b7'
  on-primary-fixed: '#321112'
  on-primary-fixed-variant: '#653b3b'
  secondary-fixed: '#e9e1d7'
  secondary-fixed-dim: '#cdc6bb'
  on-secondary-fixed: '#1e1b15'
  on-secondary-fixed-variant: '#4a463e'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#f4bb92'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#653d1e'
  background: '#fcf9f5'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2de'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-gap-desktop: 120px
  section-gap-mobile: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The brand personality of the design system is a fusion of **artisanal craftsmanship** and **sophisticated education**. It targets creative individuals seeking professional-grade skills in manual arts like candle making and soap crafting. The emotional response should be one of "calm inspiration"—feeling both the warmth of a handmade hobby and the clarity of a high-end academy.

The visual style is **Minimalist / Tactile**. It prioritizes generous whitespace and high-quality typography to ensure a premium feel, while using soft shadows and "paper-like" layers to evoke the physical nature of the crafts taught. The aesthetic leans into a "Studio Boutique" look: professional, clean, yet approachable and warm.

## Colors

The palette is anchored in a soft, organic triad. The **Dusty Rose (#D9A1A0)** serves as the primary brand identifier, used for key actions and highlights. The **Cream/Beige (#F7EFE4)** acts as the primary background surface, providing a warmer, more human alternative to pure white. The **Terracotta Brown (#8B5E3C)** is used for high-contrast typography and structural elements, offering a grounded, earthy alternative to black that maintains professional authority.

To support course categories, the design system utilizes a "Category Accent" strategy. For the "Velas" (Candles) category, a **Warm Gold/Yellow (#E6B980)** is introduced to complement the base palette, reflecting the glow of a flame.

## Typography

The typographic pairing balances tradition and modern utility. **Libre Caslon Text** is used for headlines to mirror the editorial, high-end feel of the logo. Its classical proportions and sharp serifs convey the "Academy" aspect of the brand.

**Plus Jakarta Sans** is the workhorse for body text and interface elements. Its soft, modern curves maintain the "friendly" and "warm" brand values while ensuring maximum legibility across digital devices. For labels and small caps, a slightly increased letter spacing and semi-bold weight are used to ensure clarity against the textured backgrounds.

## Layout & Spacing

The design system employs a **Fixed Grid** model on desktop (1280px max-width) and a fluid 4-column model on mobile. The spacing philosophy is "Generous and Airy," favoring large vertical gaps between sections to allow content to breathe—mimicking the layout of a luxury lifestyle magazine.

Margins are set to 24px on mobile and 64px on desktop to ensure content never feels cramped. Components use an 8px base grid for internal padding, ensuring a consistent rhythm across buttons, cards, and input fields.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**. Instead of aggressive shadows, the design system uses very diffused, low-opacity shadows (e.g., `0px 10px 30px rgba(0,0,0,0.04)`) to make elements feel like they are resting softly on a surface.

Depth is also created by layering the Primary Rose or Secondary Cream colors. Elements like "Course Chips" or "Price Tags" often use a semi-transparent backdrop blur (Glassmorphism) when placed over photography to maintain legibility while preserving the artistic, ethereal feel of the brand imagery.

## Shapes

The shape language is **Rounded**, avoiding harsh 90-degree angles to maintain the "handmade" feel. Standard components like buttons and input fields use a 0.5rem (8px) radius. Larger containers, such as course cards or testimonial blocks, use the "Large" (1rem / 16px) or "Extra Large" (1.5rem / 24px) settings to create a soft, welcoming container for content. 

Decorative elements, such as "Enroll Now" buttons or special course badges, may utilize pill-shapes to draw the eye and differentiate them from standard structural elements.

## Components

### Buttons
Primary buttons use the Dusty Rose background with Terracotta Brown text for a bold yet soft contrast. They feature a subtle lift on hover via an ambient shadow. Secondary buttons use a Terracotta Brown outline with no fill, maintaining a minimal profile.

### Cards
Cards are the primary vehicle for course content. They should feature a "Surface Cream" background, a soft-large (1rem) corner radius, and a subtle 1px border in a slightly darker cream to provide definition without looking "heavy."

### Input Fields
Inputs are styled with a minimal bottom border or a very light cream fill. Focus states should transition the border color to Dusty Rose. Use the body-md typography for placeholder text to ensure a sophisticated feel.

### Chips & Badges
Used for course categories (e.g., "Velas"). These should be pill-shaped with a low-opacity background of the category color (e.g., soft yellow for Candles) and a high-contrast text color for accessibility.

### Progress Indicators
For course completion, use a thin, elegant line in Dusty Rose. Avoid thick, "gamified" bars to maintain the academic aesthetic.