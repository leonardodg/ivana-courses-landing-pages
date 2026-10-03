// src/app/hooks/useLeadForm.ts
//
// Hook de estado e validação do LeadForm (homepage).
// Reutiliza sanitize() de useContactForm e segue os mesmos padrões
// de defesa em profundidade do ContactForm.
//
// Campos específicos: fullName · email · ddi · phone · interests (checkboxes) · modalidade · courseId

import { useState, useCallback } from 'react';
import { sanitize, validateField as validateContactField } from './useContactForm';
import type { CategoryId } from '../classes/types';

// ─── Re-exporta sanitize para uso no componente ────────────────────────────────
export { sanitize };

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type LeadModalidade = 'online' | 'presencial';

export type LeadInterests = Record<CategoryId | 'todas', boolean>;

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

const EMPTY_INTERESTS: LeadInterests = {
  velas:            false,
  saboaria:         false,
  resinas:          false,
  macrame:          false,
  aromas_incensos:  false,
  todas:            false,
};

const MAIN_CATEGORIES: CategoryId[] = [
  'velas',
  'saboaria',
  'resinas',
  'macrame',
  'aromas_incensos',
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLeadForm(defaultDdi = '+55') {
  const [form, setForm] = useState<LeadFormData>({
    fullName:   '',
    email:      '',
    ddi:        defaultDdi,
    phone:      '',
    interests:  { ...EMPTY_INTERESTS },
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

  const toggleInterest = useCallback((key: CategoryId | 'todas', checked: boolean) => {
    setForm(f => {
      if (key === 'todas') {
        const next = Object.fromEntries(
          Object.keys(f.interests).map(k => [k, checked]),
        ) as LeadInterests;
        return { ...f, interests: next };
      }

      const next = { ...f.interests, [key]: checked };
      const allMain = MAIN_CATEGORIES.every(k => next[k]);
      next.todas = allMain;
      return { ...f, interests: next };
    });
  }, []);

  // ── Derivados ─────────────────────────────────────────────────────────────

  /** Categorias activas para filtrar cursos no dropdown */
  const activeCategories: CategoryId[] = form.interests.todas
    ? MAIN_CATEGORIES
    : MAIN_CATEGORIES.filter(k => form.interests[k]);

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
      interests:  { ...EMPTY_INTERESTS },
      modalidade: 'online',
      courseId:   '',
    });
    setErrors({});
    setTouched(new Set());
  }, [defaultDdi]);

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
