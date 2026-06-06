// src/hooks/usePhoneMask.ts

const MASKS: Record<string, string> = {
  "+55": "(##) #####-####", // Brasil
  "+54": "(##) ####-####", // Argentina
  "+1": "(###) ###-####", // EUA / Canadá
  "+44": "#### ### ####", // UK
};

export const DDI_OPTIONS = [
  { value: "+55", label: "+55 Brasil", mask: MASKS["+55"] },
  { value: "+54", label: "+54 Argentina", mask: MASKS["+54"] },
  { value: "+1", label: "+1 EUA/CA", mask: MASKS["+1"] },
  { value: "+44", label: "+44 UK", mask: MASKS["+44"] },
];

export function applyPhoneMask(raw: string, ddi: string): string {
  const mask = MASKS[ddi] ?? MASKS["+55"];
  const digits = raw.replace(/\D/g, "");
  let result = "";
  let di = 0;

  for (let i = 0; i < mask.length && di < digits.length; i++) {
    if (mask[i] === "#") {
      result += digits[di++];
    } else {
      result += mask[i];
    }
  }
  return result;
}
