import React, { useState, useEffect } from 'react';
import { Send, Users, Trash2, Shield, Calendar, Book, Info } from 'lucide-react';
import { Course, Language, CategoryId, Lead } from '../types';
import { CATEGORIES } from '../data';

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

  const t = {
    pt: {
      headline: 'Cadastre-se para Receber Inscrições e Novidades',
      subtitle: 'Insira seus dados abaixo para tirar dúvidas diretamente conosco ou iniciar sua matricular.',
      placeholderName: 'Seu nome completo',
      placeholderEmail: 'Seu melhor e-mail',
      placeholderPhone: 'Telefone com DDD / WhatsApp',
      courseLabel: 'Curso / Workshop desejado:',
      selectOption: 'Selecione uma turma / curso livre',
      btnSubmit: 'Solicitar Atendimento & Vagas',
      successMsg: 'Obrigado! Sua solicitação foi recebida com sucesso. Entraremos em contato via WhatsApp em menos de 24h.',
      adminTitle: 'Painel Admin Local de Leads (Mecanismo Sandbox Postgres Mockup)',
      adminDesc: 'Esta tabela interna simula os registros gravados em tempo real na tabela PostgreSQL leads. Útil para verificar e aprovar o correto funcionamento de seu formulário comercial!',
      adminColName: 'Nome / E-mail',
      adminColCourse: 'Curso Mapeado',
      adminColCategory: 'Segmento',
      adminColDate: 'Data Cadastro',
      adminEmpty: 'Nenhum lead preenchido nesta máquina ainda.',
      requiredField: 'Campo Obrigatório',
    },
    es: {
      headline: 'Inscríbete para Reservar Cupo o Consultar Dudas',
      subtitle: 'Ingresa tus datos a continuación y nos contactaremos contigo por WhatsApp en menos de 24 horas.',
      placeholderName: 'Tu nombre completo',
      placeholderEmail: 'Tu correo electrónico principal',
      placeholderPhone: 'Número de Teléfono / WhatsApp',
      courseLabel: 'Curso / Taller elegido:',
      selectOption: 'Selecciona una clase / curso libre',
      btnSubmit: 'Enviar Solicitud de Información',
      successMsg: '¡Gracias! Recibimos tu solicitud correctamente. Ivana o un asesor técnico te responderá a la brevedad.',
      adminTitle: 'Panel de Administración Local (Demostración de Base de Datos)',
      adminDesc: 'Esta tabla simula los registros guardados en tiempo de ejecución de la base de datos PostgreSQL. ¡Útil para comprobar el flujo comercial antes de subir a producción!',
      adminColName: 'Nombre / Correo',
      adminColCourse: 'Curso Solicitado',
      adminColCategory: 'Segmento',
      adminColDate: 'Fecha Registro',
      adminEmpty: 'Aún no se registraron solicitudes de información.',
      requiredField: 'Campo Obligatorio',
    }
  }[language];

  // Map of course ID to Course Title for previewing
  const getCourseTitle = (courseId: string) => {
    const found = courses.find(c => c.id === courseId);
    return found ? found.title[language] : courseId || 'Geral (Dúvidas)';
  };

  return (
    <section id="contato" className="py-16 md:py-24 bg-[#f0ede9] border-t border-[#e1deda]">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Narratives of registration */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-gray-500 bg-[#e5e2de] px-3 py-1 rounded-full">
            Inscripciones Abiertas / Inscrições Abertas
          </span>
          <h2 className="text-2xl md:text-3.5xl font-serif text-gray-950 font-bold leading-tight">
            {t.headline}
          </h2>
          <p className="text-xs md:text-sm text-[#514443] leading-relaxed">
            {t.subtitle}
          </p>

          <div className="p-5 bg-white rounded-xl border border-[#eae8e4] text-xs text-[#514443] space-y-4">
            <div className="flex gap-3 leading-relaxed items-start">
              <Shield className="w-5 h-5 text-[#805252] shrink-0 mt-0.5" />
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
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-[#eae8e4] p-6 md:p-8">
          {success ? (
            <div className="bg-emerald-50 text-emerald-900 rounded-xl p-6 border border-emerald-100 flex flex-col items-center text-center space-y-4">
              <span className="text-3xl">🎉</span>
              <p className="text-sm font-semibold leading-relaxed max-w-md">{t.successMsg}</p>
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
                  placeholder={t.placeholderName}
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
                    placeholder={t.placeholderEmail}
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
                    placeholder={t.placeholderPhone}
                    className="input-minimal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-widest mb-1.5 font-mono">
                  {t.courseLabel}
                </label>
                <select
                  value={chosenCourseId}
                  onChange={(e) => setChosenCourseId(e.target.value)}
                  className="input-minimal font-sans text-gray-805"
                >
                  <option value="">-- {t.selectOption} --</option>
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
                <span>{t.btnSubmit}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Admin Panel Floating Trigger Button */}
      <div className="max-w-[1280px] mx-auto px-6 mt-8">
        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-100 text-xs px-4 py-2.5 rounded-xl font-mono border border-slate-800 cursor-pointer shadow-sm transition-all"
        >
          <Users className="w-4 h-4 text-rose-400" />
          <span>{showAdminPanel ? 'Ocultar Painel Admin' : 'Visualizar Leads Captadas (Local Storage)'}</span>
          <span className="bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full text-[10px] ml-1">
            {allLeads.length}
          </span>
        </button>

        {showAdminPanel && (
          <div className="mt-4 bg-slate-950 rounded-2xl border border-slate-800 p-6 md:p-8 text-slate-100 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-900">
              <div>
                <h4 className="font-mono text-xs text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  {t.adminTitle}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{t.adminDesc}</p>
              </div>
              <button
                onClick={() => {
                  setAllLeads([]);
                  localStorage.removeItem('ivana_leads');
                }}
                className="text-xs font-mono font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 border border-rose-900/30 bg-rose-950/20 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Sandbox Data</span>
              </button>
            </div>

            {allLeads.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 font-mono">{t.adminEmpty}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 pb-3">
                      <th className="py-2.5 font-bold">{t.adminColName}</th>
                      <th className="py-2.5 font-bold">{t.adminColCourse}</th>
                      <th className="py-2.5 font-bold">{t.adminColCategory}</th>
                      <th className="py-2.5 font-bold">{t.adminColDate}</th>
                      <th className="py-2.5 font-bold text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/50">
                    {allLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-900/40">
                        <td className="py-3">
                          <span className="font-bold text-slate-200 block">{lead.name}</span>
                          <span className="text-[11px] text-slate-400 block">{lead.email}</span>
                          {lead.phone && <span className="text-[11px] text-[#E6B980] block">{lead.phone}</span>}
                        </td>
                        <td className="py-3 text-slate-300 max-w-[180px] truncate">
                          {getCourseTitle(lead.courseId)}
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-xs uppercase tracking-wider text-rose-400">
                            {lead.category ? lead.category.toUpperCase() : 'VELAS'}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 text-[11px]">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

    </section>
  );
}
