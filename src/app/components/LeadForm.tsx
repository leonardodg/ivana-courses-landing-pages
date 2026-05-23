import React, { useState, useEffect } from 'react';
import { Send, Users, Trash2, Shield, Calendar, Book, Info } from 'lucide-react';
import { Course, Language, CategoryId, Lead } from '../classes/types';
import { lead_text as text } from '../lang/lead_form';

interface LeadFormProps {
  language: Language;
  selectedCourseForForm: Course | null;
  courses: Course[];
  activeCategoryId: CategoryId;
}

export default function LeadForm({
  language,
  selectedCourseForForm,
  courses,
  activeCategoryId,
}: LeadFormProps) {
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [chosenCourseId, setChosenCourseId] = useState('');
  const [success, setSuccess] = useState(false);

  // Loaded local leads
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Sync selected course from grid
  useEffect(() => {
    if (selectedCourseForForm) {
      setChosenCourseId(selectedCourseForForm.id);
      // Scroll to form smoothly
      const element = document.getElementById('contato');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedCourseForForm]);

  // Load leads from storage
  useEffect(() => {
    const stored = localStorage.getItem('ivana_leads');
    if (stored) {
      try {
        setAllLeads(JSON.parse(stored));
      } catch (e) {
        // Safe load fallback
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newLead: Lead = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone,
      courseId: chosenCourseId,
      category: activeCategoryId,
      createdAt: new Date().toISOString(),
    };

    const updated = [newLead, ...allLeads];
    setAllLeads(updated);
    localStorage.setItem('ivana_leads', JSON.stringify(updated));

    setSuccess(true);
    setName('');
    setEmail('');
    setPhone('');
    
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  const handleDeleteLead = (id: string) => {
    const updated = allLeads.filter(l => l.id !== id);
    setAllLeads(updated);
    localStorage.setItem('ivana_leads', JSON.stringify(updated));
  };

  const lead_text = text[language];

  // Map of course ID to Course Title for previewing
  const getCourseTitle = (courseId: string) => {
    const found = courses.find(c => c.id === courseId);
    return found ? found.title[language] : courseId || 'Geral (Dúvidas)';
  };

  return (
    <section id="contato" className="py-16 md:py-24 bg-surface-form border-t border-subtle">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Narratives of registration */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-500 bg-surface-tag px-3 py-1 rounded-full">
            Inscripciones Abiertas / Inscrições Abertas
          </span>
          <h2 className="text-2xl md:text-3.5xl font-serif text-gray-950 font-bold leading-tight">
            {lead_text.headline}
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            {lead_text.subtitle}
          </p>

          <div className="p-5 bg-white rounded-xl border border-muted text-xs text-on-surface-variant space-y-4">
            <div className="flex gap-3 leading-relaxed items-start">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block mb-0.5">Atendimento Direto</span>
                <span>As dúvidas são enviadas diretamente para a mesa de Ivana Lerea, que responde em formato de consultoria gratuita de admissão.</span>
              </div>
            </div>
            <div className="flex gap-3 leading-relaxed items-start">
              <Calendar className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900 block mb-0.5">Agenda Personalizada</span>
                <span>Informe sua disponibilidade de viagem para Florianópolis, Curitiba ou Rio de Janeiro e receba notificações prioritárias de novas turmas presenciais.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-muted p-6 md:p-8">
          {success ? (
            <div className="bg-emerald-50 text-emerald-900 rounded-xl p-6 border border-emerald-100 flex flex-col items-center text-center space-y-4">
              <span className="text-3xl">🎉</span>
              <p className="text-sm font-semibold leading-relaxed max-w-md">{lead_text.successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono">
                  {language === 'pt' ? 'Seu Nome completo' : 'Nombre Completo'} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lead_text.placeholderName}
                  className="input-minimal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono">
                    {language === 'pt' ? 'Endereço de e-mail' : 'Correo electrónico'} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={lead_text.placeholderEmail}
                    className="input-minimal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono">
                    {language === 'pt' ? 'Número WhatsApp / Celular' : 'Número WhatsApp / Celular'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={lead_text.placeholderPhone}
                    className="input-minimal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono">
                  {lead_text.courseLabel}
                </label>
                <select
                  value={chosenCourseId}
                  onChange={(e) => setChosenCourseId(e.target.value)}
                  className="input-minimal font-sans text-gray-805"
                >
                  <option value="">-- {lead_text.selectOption} --</option>
                  {courses
                    .filter(c => c.categoryId === activeCategoryId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title[language]} ({c.modalidade === 'presencial' ? 'Presencial' : 'Moodle'})
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                className="brand-btn-primary w-full py-4 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{lead_text.btnSubmit}</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </section>
  );
}
