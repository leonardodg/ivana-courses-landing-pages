// src/app/components/candles/CandlesStudentPortal.tsx
//
// Área de aluno demonstrativa (mock), mantida por decisão do time como
// vitrine do que o aluno encontra após a matrícula. Conteúdo 100%
// estático/fixo em PT-BR — não depende de backend nem de URLs externas.

import { useState } from 'react';
import {
  Play, BookOpen, Download, Phone, MapPin,
  MessageSquare, Sparkles, CheckCircle,
  ChevronRight, Award, Flame, Calendar,
} from 'lucide-react';

interface CandlesStudentPortalProps {
  onClose: () => void;
}

const classes = [
  { id: 1, title: 'Física da Fusão e Curva Térmica', duration: '14:20', isCompleted: true },
  { id: 2, title: 'Aditivação de Essências Lipofílicas', duration: '18:45', isActive: true },
  { id: 3, title: 'Manejo de Pavio de Madeira e Estabilidade', duration: '22:10' },
  { id: 4, title: 'Estratégia de Rótulo e Empreendedorismo', duration: '15:30' },
  { id: 5, title: 'Velas de Gel Cristal: Transparência Absoluta', duration: '28:15' },
];

const downloads = [
  { title: 'Planilha de Precificação Inteligente de Velas (Artesanal)', size: '1.4 MB', type: 'Excel Spreadsheet' },
  { title: 'Guia Prático de Diâmetro e Seleção de Pavios (BR/AR)', size: '2.8 MB', type: 'PDF Document' },
  { title: 'Ficha de Teste de Queima e Registro de Lotes', size: '840 KB', type: 'PDF Document' },
  { title: 'Diretrizes de Segurança para Rótulos Informativos', size: '1.1 MB', type: 'PDF Document' },
];

const suppliers = [
  { name: 'Essências Fine Fragrances', region: 'São Paulo, BR', specialty: 'Essências com base de perfume importado', contact: '+55 11 91234-5678', tags: ['Premium', 'Óleo Puro'] },
  { name: 'Ceras Naturalis do Sul', region: 'Santa Catarina, BR', specialty: 'Cera de soja refinada, cera de arroz e palma pura', contact: '+55 48 99876-5432', tags: ['Ecológico', 'Ceras Pilar'] },
  { name: 'Pabilos y Moldes de la Costa', region: 'Buenos Aires, AR', specialty: 'Moldes de silicona premium e pavios tecidos importados', contact: '+54 11 4321-8765', tags: ['Moldes 3D', 'Madeira'] },
  { name: 'Frascos del Plata', region: 'Gran Buenos Aires, AR', specialty: 'Vidros temperados acetinados e tampas finas', contact: '+54 11 5432-1100', tags: ['Envases', 'Frascos'] },
];

const forumPosts = [
  {
    author: 'Caroline Silva',
    avatarLetters: 'CS',
    courseName: 'Mentoria Premium',
    time: '2h atrás',
    title: 'Minhas primeiras velas de copo desmoldadas utilizando a cera dura de arroz!',
    content: 'Chocada com a dureza e o brilho! Os testes de queima com pavio de madeira deram uma chama perfeitamente limpa e sem fuligem. Foto anexa para feedback da Professora!',
    comments: [
      { author: 'Ivana Academy', text: 'Excelente acabamento, Carol! A contração da cera de arroz é ideal para climas quentes. O pavio está impecável.' },
    ],
  },
  {
    author: 'Estanislao Perez',
    avatarLetters: 'EP',
    courseName: 'Profesorado de Velas',
    time: '1d atrás',
    title: 'Dúvida com a exalação olfativa em velas de gel cristal',
    content: 'Olá colegas, alguém já testou incorporar perfume puro ao gel? Fiz a aproximadamente 80 graus mas notei que custa ligar por completo. Recomendam subir para 90 graus?',
    comments: [
      { author: 'Ivana Academy', text: 'Olá Estanislao! No gel cristal técnico a temperatura recomendada de vertimento de fragrância é de 88 graus. Misture sem incorporar ar por 3 minutos contínuos.' },
    ],
  },
];

export default function CandlesStudentPortal({ onClose }: CandlesStudentPortalProps) {
  const [activeTab, setActiveTab] = useState<'classroom' | 'downloads' | 'suppliers' | 'community'>('classroom');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col md:flex-row bg-[#1c1c1a]/95 backdrop-blur-md">

      {/* Sidebar */}
      <div className="w-full md:w-80 bg-[#282725] border-r border-[#3d3a37] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="text-primary-fixed-dim w-6 h-6" />
              <span className="font-display text-lg font-bold text-white tracking-tight">Ivana Portal</span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-white/70 hover:text-white p-2"
            >
              &times;
            </button>
          </div>

          <div className="border border-primary-fixed-dim/20 bg-primary/10 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] text-primary-fixed-dim font-bold uppercase tracking-widest font-label">
              <Award className="w-3.5 h-3.5" />
              ÁREA DEMO
            </div>
            <p className="text-white text-xs font-semibold">
              Bem-vinda de volta! Continue de onde parou.
            </p>
            <div className="w-full bg-[#1c1c1a]/50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full w-[65%]"></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-white/50">
              <span>Progresso do curso:</span>
              <span className="font-bold text-white/80">65% Concluído</span>
            </div>
          </div>

          <nav className="space-y-2">
            {([
              { key: 'classroom', label: 'Sala de Aula', icon: Play },
              { key: 'downloads', label: 'Materiais', icon: BookOpen },
              { key: 'suppliers', label: 'Fornecedores', icon: MapPin },
              { key: 'community', label: 'Comunidade', icon: MessageSquare },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-label uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  activeTab === key
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#1c1c1a] border border-[#3d3a37] text-white hover:bg-[#1c1c1a]/70 py-3 rounded-xl font-label text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
        >
          Voltar para a Landing
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[#1c1c1a] overflow-y-auto">

        <div className="h-20 border-b border-[#31302e] px-6 sm:px-10 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-white text-lg font-bold font-display">Minha Área do Aluno</h1>
            <p className="text-white/50 text-[10.5px] uppercase tracking-wide font-label">Demonstração — Ivana Academy</p>
          </div>
          <button
            onClick={onClose}
            className="hidden md:flex items-center gap-2 bg-[#282725] hover:bg-[#3d3a37] text-white text-xs font-semibold font-label uppercase p-3 rounded-xl transition-colors cursor-pointer"
          >
            <span>&times;</span> Fechar
          </button>
        </div>

        <div className="p-6 sm:p-10 flex-1">
          {activeTab === 'classroom' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              <div className="lg:col-span-8 space-y-6">
                <div className="aspect-video bg-black rounded-2xl relative overflow-hidden ring-1 ring-[#31302e] shadow-2xl flex items-center justify-center group cursor-pointer">
                  <img
                    src="/images/courses/imersion.jpg"
                    alt="Aula de laboratório de velas"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                  <div className="relative text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/95 text-on-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20 mx-auto group-hover:scale-110 transition-transform duration-500">
                      <Play className="w-10 h-10 fill-white pl-1" />
                    </div>
                    <div>
                      <span className="inline-block bg-[#1c1c1a]/85 border border-[#3d3a37] text-white/95 text-[10px] uppercase font-label font-bold px-3 py-1.5 rounded-full tracking-wider">
                        Aula em andamento
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-primary-fixed-dim animate-pulse" />
                      <span>HD Streaming Ativado</span>
                    </div>
                    <span>0:00 / 18:45</span>
                  </div>
                </div>

                <div className="bg-[#282725] p-6 rounded-2xl border border-[#3d3a37] space-y-3">
                  <div className="flex gap-2 text-primary-fixed-dim text-xs font-semibold font-label uppercase">
                    <Calendar className="w-4 h-4" />
                    <span>Módulo II — Ciência dos Aromas</span>
                  </div>
                  <h3 className="text-white text-xl font-bold font-display">
                    Fórmula Integrada de Concentração e Absorção Lipofílica
                  </h3>
                  <p className="text-white/60 text-sm font-body leading-relaxed">
                    Nesta aula prática avançada no laboratório do ateliê, exploramos minuciosamente o
                    coeficiente de fixação das essências de notas florais e amadeiradas em cera de arroz
                    e palma, a fluxo controlado de calor.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest block font-label px-2">
                  Progresso das Aulas
                </span>

                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className={`p-4 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${
                        cls.isActive
                          ? 'bg-primary/10 border-primary ring-1 ring-primary'
                          : 'bg-[#282725] border-[#3d3a37] hover:bg-[#32312e] text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          cls.isActive
                            ? 'bg-primary text-on-primary'
                            : cls.isCompleted
                              ? 'bg-primary-fixed-dim/20 text-primary-fixed-dim'
                              : 'bg-[#1c1c1a] text-white/50'
                        }`}>
                          {cls.isCompleted ? <CheckCircle className="w-4 h-4" /> : cls.id}
                        </div>
                        <span className="text-xs text-white font-semibold font-body text-left line-clamp-2">
                          {cls.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/40 shrink-0 select-none ml-2">
                        {cls.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#282725] rounded-2xl border border-[#3d3a37]">
                <h3 className="text-white text-lg font-bold font-display mb-2">Materiais de Apoio</h3>
                <p className="text-white/60 text-sm font-body leading-relaxed">
                  Planilhas, guias e fichas técnicas exclusivas para alunas matriculadas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {downloads.map((dl, i) => (
                  <div key={i} className="p-5 bg-[#282725] hover:bg-[#32312e] rounded-xl border border-[#3d3a37] flex items-center justify-between gap-4 transition-colors">
                    <div>
                      <h4 className="text-white text-sm font-bold font-display">{dl.title}</h4>
                      <div className="flex gap-2 text-[10px] text-white/50 font-label uppercase mt-1">
                        <span className="bg-[#1c1c1a] px-2 py-0.5 rounded-sm font-mono text-primary-fixed-dim">{dl.type}</span>
                        <span>{dl.size}</span>
                      </div>
                    </div>
                    <button className="bg-primary hover:bg-primary/95 text-on-primary p-3 rounded-lg flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#282725] rounded-2xl border border-[#3d3a37]">
                <h3 className="text-white text-lg font-bold font-display mb-2">Fornecedores Exclusivos</h3>
                <p className="text-white/60 text-sm font-body leading-relaxed">
                  Lista validada de fornecedores recomendados no Brasil e na Argentina.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suppliers.map((sup, i) => (
                  <div key={i} className="p-6 bg-[#282725] rounded-xl border border-[#3d3a37] space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-white text-base font-bold font-display">{sup.name}</h4>
                        <span className="text-[10px] font-label text-white/50 uppercase flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-primary-fixed-dim" />
                          {sup.region}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sup.tags.map((tag, idx) => (
                          <span key={idx} className="bg-primary/20 text-primary-fixed-dim px-2 py-0.5 text-[9px] font-bold rounded-sm uppercase tracking-wide font-label">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-white/70 text-xs font-body">
                      {sup.specialty}
                    </p>

                    <div className="pt-3 border-t border-[#3d3a37] flex items-center justify-between text-xs">
                      <span className="text-white/50 font-label">Contato:</span>
                      <a href={`tel:${sup.contact}`} className="text-primary-fixed-dim font-bold hover:underline py-1 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {sup.contact}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6 max-w-3xl">
              {forumPosts.map((post, i) => (
                <div key={i} className="p-6 bg-[#282725] rounded-xl border border-[#3d3a37] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-on-primary text-sm shadow-xs">
                        {post.avatarLetters}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{post.author}</span>
                        <span className="text-[9px] font-label text-primary-fixed-dim uppercase tracking-wider">{post.courseName} &bull; {post.time}</span>
                      </div>
                    </div>
                    <Flame className="w-5 h-5 text-tertiary-container" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white text-base font-bold font-display">{post.title}</h4>
                    <p className="text-white/80 text-sm font-body leading-relaxed">{post.content}</p>
                  </div>

                  {post.comments.length > 0 && (
                    <div className="pt-4 border-t border-[#3d3a37] space-y-3">
                      {post.comments.map((com, idx) => (
                        <div key={idx} className="bg-[#1c1c1a]/40 p-4 rounded-xl border-l-2 border-primary space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              {com.author}
                              <span className="bg-primary text-on-primary text-[8px] font-bold font-label uppercase px-2 py-0.5 rounded-full scale-90">
                                FADA
                              </span>
                            </span>
                            <Sparkles className="w-3.5 h-3.5 text-primary-fixed-dim" />
                          </div>
                          <p className="text-white/70 text-xs italic font-body">{com.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
