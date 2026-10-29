// src/app/hooks/useLeadForm.ts
//
// Hook de estado e validação do LeadForm (homepage).
// Reutiliza sanitize() de useContactForm e segue os mesmos padrões
// de defesa em profundidade do ContactForm.
//
// Campos específicos: fullName · email · ddi · phone · interests (checkboxes) · modalidade · courseId

import { useState, useCallback } from 'react';
import { sanitize, validateField as validateContactField } from './useContactForm';

// ─── Re-exporta sanitize para uso no componente ────────────────────────────────
export { sanitize };

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type LeadModalidade = 'online' | 'presencial';

// Chaves das áreas de interesse de cada país (data/interest_options.ts), mais 'todas'.
export type LeadInterests = Record<string, boolean>;

export interface LeadFormData {
  fullName:   string;
  email:      string;
  ddi:        string;
  phone:      string;
  interests:  LeadInterests;
  modalidade: LeadModalidade;
  courseId:   string;
}

export interface LeadFieldErrors {
  fullName?: string;
  email?:    string;
  phone?:    string;
}

// ─── Estado inicial ────────────────────────────────────────────────────────────

const emptyInterests = (keys: string[]): LeadInterests => Object.fromEntries([...keys, 'todas'].map((k) => [k, false]));

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLeadForm(defaultDdi = '+55', optionKeys: string[] = []) {
  const [form, setForm] = useState<LeadFormData>({
    fullName:   '',
    email:      '',
    ddi:        defaultDdi,
    phone:      '',
    interests:  emptyInterests(optionKeys),
    modalidade: 'online',
    courseId:   '',
  });

  const [errors,  setErrors]  = useState<LeadFieldErrors>({});
  const [touched, setTouched] = useState<Set<keyof LeadFieldErrors>>(new Set());

  // ── Campos de texto simples (nome / email / phone) ────────────────────────

  const setField = useCallback(
    (field: keyof LeadFieldErrors | 'ddi' | 'courseId', value: string) => {
      setForm(f => ({ ...f, [field]: value }));
      if ((field === 'fullName' || field === 'email' || field === 'phone') && touched.has(field)) {
        setErrors(e => ({ ...e, [field]: validateContactField(field, value) }));
      }
    },
    [touched],
  );

  const blurField = useCallback(
    (field: keyof LeadFieldErrors) => {
      setTouched(t => new Set([...t, field]));
      setErrors(e => ({ ...e, [field]: validateContactField(field, form[field] as string) }));
    },
    [form],
  );

  // ── Modalidade ────────────────────────────────────────────────────────────

  const setModalidade = useCallback((m: LeadModalidade) => {
    setForm(f => ({ ...f, modalidade: m, courseId: '' }));
  }, []);

  // ── Interesses (checkboxes) ────────────────────────────────────────────────

  const toggleInterest = useCallback((key: string, checked: boolean) => {
    setForm(f => {
      if (key === 'todas') {
        const next = Object.fromEntries(
          Object.keys(f.interests).map(k => [k, checked]),
        ) as LeadInterests;
        return { ...f, interests: next };
      }

      const next = { ...f.interests, [key]: checked };
      const allMain = optionKeys.every(k => next[k]);
      next.todas = allMain;
      return { ...f, interests: next };
    });
  }, [optionKeys]);

  // ── Derivados ─────────────────────────────────────────────────────────────

  /** Categorias activas para filtrar cursos no dropdown */
  const activeCategories: string[] = form.interests.todas
    ? optionKeys
    : optionKeys.filter(k => form.interests[k]);

  /** Formulário válido: nome + email + telefone sem erros */
  const isValid = (['fullName', 'email', 'phone'] as const).every(
    f => !validateContactField(f, form[f]),
  );

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setForm({
      fullName:   '',
      email:      '',
      ddi:        defaultDdi,
      phone:      '',
      interests:  emptyInterests(optionKeys),
      modalidade: 'online',
      courseId:   '',
    });
    setErrors({});
    setTouched(new Set());
  }, [defaultDdi, optionKeys]);

  return {
    form,
    errors,
    touched,
    setField,
    blurField,
    setModalidade,
    toggleInterest,
    activeCategories,
    isValid,
    reset,
  };
}
