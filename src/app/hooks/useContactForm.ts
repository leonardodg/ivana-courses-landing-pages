// src/hooks/useContactForm.ts
import { useState, useCallback } from "react";

export interface ContactFormData {
  fullName: string;
  email: string;
  ddi: string;
  phone: string;
  subject: string;
  message: string;
}

export interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Strip de caracteres perigosos para XSS — feito no cliente como primeira linha
// A sanitização real acontece de novo no N8N (defesa em profundidade)
export function sanitize(value: string, maxLen = 2000): string {
  return value
    .trim()
    .replace(/[<>"'`]/g, "") // strip básico HTML/JS injection
    .slice(0, maxLen);
}

export function validateField(
  field: keyof ContactFormData,
  value: string,
): string | undefined {
  const v = sanitize(value);

  switch (field) {
    case "fullName":
      if (v.length < 2) return "errNameShort"; // "Nome deve ter ao menos 2 caracteres"
      if (v.length > 150) return "errNameLong"; // "Máximo 150 caracteres"
      return undefined;

    case "email":
      if (!EMAIL_RE.test(v.toLowerCase())) return "errEmailInvalid"; //"E-mail inválido"
      if (v.length > 254) return "errEmailLong"; // "E-mail muito longo"
      return undefined;

    case "phone":
      if (v.replace(/\D/g, "").length < 7) return "errPhoneShort"; //"Número muito curto"
      return undefined;

    case "subject":
      if (v.length > 255) return "errSubjectLong"; //  "Máximo 255 caracteres"
      return undefined;

    case "message":
      if (v.length < 10) return "errMessageShort"; // "Mensagem muito curta (mín. 10 caracteres)"
      if (v.length > 2000) return "errMessageLong"; // "Máximo 2000 caracteres"
      return undefined;
  }
}

export function useContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    fullName: "",
    email: "",
    ddi: "+55",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Set<keyof ContactFormData>>(new Set());

  const setField = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setForm((f) => ({ ...f, [field]: value }));
      if (touched.has(field)) {
        setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
      }
    },
    [touched],
  );

  const blurField = useCallback(
    (field: keyof ContactFormData) => {
      setTouched((t) => new Set([...t, field]));
      setErrors((e) => ({ ...e, [field]: validateField(field, form[field]) }));
    },
    [form],
  );

  const isValid = ["fullName", "email", "phone", "message"].every(
    (f) =>
      !validateField(
        f as keyof ContactFormData,
        form[f as keyof ContactFormData],
      ),
  );

  return { form, errors, touched, setField, blurField, isValid };
}
