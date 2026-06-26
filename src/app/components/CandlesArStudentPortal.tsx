// src/app/components/candles-ar/CandlesArStudentPortal.tsx
// Portal del Alumno demo en ES-AR. Misma experiencia que la versión
// PT-BR pero con textos en español y datos adaptados a Argentina.

import { useState } from 'react';
import {
  Play, BookOpen, Download, Phone, MapPin,
  MessageSquare, Sparkles, CheckCircle,
  ChevronRight, Award, Flame, Calendar,
} from 'lucide-react';

interface CandlesArStudentPortalProps {
  onClose: () => void;
}

const classes = [
  { id: 1, title: 'Química de Ceras Vegetales y Parafinas',     duration: '16:10', isCompleted: true },
  { id: 2, title: 'Coeficientes de Temperatura y Vaciado',       duration: '22:30', isActive: true },
  { id: 3, title: 'Termodinámica de la Combustión y Mechas',     duration: '19:45' },
  { id: 4, title: 'Fragancias de Alta Gama: Flash Point',        duration: '14:20' },
  { id: 5, title: 'Colorimetría y Mármol en Cera',               duration: '25:00' },
];

const downloads = [
  { title: 'Planilla de Costos y Fijación de Precios',         size: '1.2 MB', type: 'Excel Spreadsheet' },
  { title: 'Guía de Diámetros y Selección de Pabilos (AR/BR)', size: '2.6 MB', type: 'PDF Document' },
  { title: 'Ficha de Prueba de Quema y Control de Lotes',      size: '780 KB', type: 'PDF Document' },
  { title: 'Normativas de Etiquetado para ANMAT y ANVISA',     size: '1.3 MB', type: 'PDF Document' },
];

const suppliers = [
  { name: 'Esencias Fine Fragancias ARG', region: 'Buenos Aires, AR', specialty: 'Aceites esenciales puros y fragancias de perfumería importada', contact: '+54 11 4321-5678', tags: ['Premium', 'Aceite Puro'] },
  { name: 'Ceras del Plata',              region: 'Gran Buenos Aires, AR', specialty: 'Cera de soja refinada APF y parafina de alta translucidez', contact: '+54 11 2233-4455', tags: ['Ecológico', 'Pilar Blend'] },
  { name: 'Pabilos y Moldes del Sur',     region: 'Rosario, AR', specialty: 'Pabilos de madera orgánica, moldes de silicona 3D premium', contact: '+54 341 555-1234', tags: ['Moldes 3D', 'Madera'] },
  { name: 'Envases Cristal Boutique',     region: 'Córdoba, AR', specialty: 'Frascos de vidrio templado satinado y tapas de lujo', contact: '+54 351 444-9876', tags: ['Envases', 'Frascos'] },
];

const forumPosts = [
  {
    author:       'Valentina Torres',
    avatarLetters:'VT',
    courseName:   'Profesorado en Velas',
    time:         'Hace 3h',
    title:        '¡Mi primera vela en molde de silicona con base de cera dura perfectamente desmoldada!',
    content:      'No podía creer el resultado. La técnica de temperatura de vertido a 62°C que explica Ivana eliminó completamente el frosting y las grietas. ¡Foto en el foro!',
    comments:     [{ author: 'Ivana Academy', text: '¡Excelente, Valentina! Ese punto de vertido es clave para el Pilar Blend. El acabado es impecable.' }],
  },
  {
    author:       'Marcela Giménez',
    avatarLetters:'MG',
    courseName:   'Tecnicatura en Arte y Diseño',
    time:         'Hace 1d',
    title:        'Consulta sobre pigmentos liposolubles para velas de mármol',
    content:      'Hola a todas. Estoy trabajando el módulo de colorimetría. ¿Qué concentración de anilina a la grasa recomiendan para un mármol negro intenso sin que sangre el color?',
    comments:     [{ author: 'Ivana Academy', text: 'Hola Marcela. Para mármol profundo en cera soja, máximo 0.5% de anilina negra. Mezcla a 70°C e incorpora en espiral. No uses más de 3 capas de color o se fusionan.' }],
  },
];

export default function CandlesArStudentPortal({ onClose }: CandlesArStudentPortalProps) {
  const [activeTab, setActiveTab] = useState<'classroom' | 'downloads' | 'suppliers' | 'community'>('classroom');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col md:flex-row bg-[#1c1c1a]/95 backdrop-blur-md">

      {/* Sidebar */}
      <div className="w-full md:w-80 bg-[#282725] border-r border-[#3d3a37] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="text-primary-fixed-dim w-6 h-6" />
              <span className="font-serif text-lg font-bold text-white tracking-tight">Ivana Portal AR</span>
            </div>
            <button onClick={onClose} className="md:hidden text-white/70 hover:text-white p-2">&times;</button>
          </div>

          <div className="border border-primary-fixed-dim/20 bg-primary/10 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] text-primary-fixed-dim font-bold uppercase tracking-widest font-mono">
              <Award className="w-3.5 h-3.5" />
              ÁREA DEMO
            </div>
            <p className="text-white text-xs font-semibold">¡Bienvenida de nuevo! Continuá donde lo dejaste.</p>
            <div className="w-full bg-[#1c1c1a]/50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full w-[45%]" />
            </div>
            <div className="flex justify-between items-center text-[10px] text-white/50">
              <span>Progreso del curso:</span>
              <span className="font-bold text-white/80">45% Completado</span>
            </div>
          </div>

          <nav className="space-y-2">
            {([
              { key: 'classroom',  label: 'Aula Virtual',     icon: Play },
              { key: 'downloads',  label: 'Materiales',       icon: BookOpen },
              { key: 'suppliers',  label: 'Proveedores',      icon: MapPin },
              { key: 'community',  label: 'Comunidad',        icon: MessageSquare },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  activeTab === key
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5"><Icon className="w-4 h-4 shrink-0" />{label}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#1c1c1a] border border-[#3d3a37] text-white hover:bg-[#1c1c1a]/70 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
        >
          Volver a la Landing
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col bg-[#1c1c1a] overflow-y-auto">

        <div className="h-20 border-b border-[#31302e] px-6 sm:px-10 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-white text-lg font-bold font-serif">Mi Área del Alumno</h1>
            <p className="text-white/50 text-[10.5px] uppercase tracking-wide font-mono">Demostración — Ivana Academy Argentina</p>
          </div>
          <button
            onClick={onClose}
            className="hidden md:flex items-center gap-2 bg-[#282725] hover:bg-[#3d3a37] text-white text-xs font-semibold font-mono uppercase p-3 rounded-xl transition-colors cursor-pointer"
          >
            <span>&times;</span> Cerrar
          </button>
        </div>

        <div className="p-6 sm:p-10 flex-1">

          {activeTab === 'classroom' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="aspect-video bg-black rounded-2xl relative overflow-hidden ring-1 ring-[#31302e] shadow-2xl flex items-center justify-center group cursor-pointer">
                  <img
                    src="/images/courses/candle_professorship.png"
                    alt="Clase de laboratorio de velas"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="relative text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/95 text-on-primary rounded-full flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-transform duration-500">
                      <Play className="w-10 h-10 fill-white pl-1" />
                    </div>
                    <span className="inline-block bg-[#1c1c1a]/85 border border-[#3d3a37] text-white/95 text-[10px] uppercase font-mono font-bold px-3 py-1.5 rounded-full tracking-wider">
                      Clase en curso
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-primary-fixed-dim animate-pulse" />
                      <span>HD Streaming Activo</span>
                    </div>
                    <span>0:00 / 22:30</span>
                  </div>
                </div>

                <div className="bg-[#282725] p-6 rounded-2xl border border-[#3d3a37] space-y-3">
                  <div className="flex gap-2 text-primary-fixed-dim text-xs font-semibold font-mono uppercase">
                    <Calendar className="w-4 h-4" />
                    <span>Módulo II — Física del Vaciado</span>
                  </div>
                  <h3 className="text-white text-xl font-bold font-serif">
                    Coeficientes de Temperatura y Control de Shock Térmico
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    En esta clase técnica avanzada analizamos las variables físicas que previenen defectos estéticos como rechupe, frosting, grietas e internos vacios al enfriar las velas en molde.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest block font-mono px-2">
                  Progreso de Clases
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
                          cls.isActive    ? 'bg-primary text-on-primary'
                          : cls.isCompleted ? 'bg-primary-fixed-dim/20 text-primary-fixed-dim'
                          : 'bg-[#1c1c1a] text-white/50'
                        }`}>
                          {cls.isCompleted ? <CheckCircle className="w-4 h-4" /> : cls.id}
                        </div>
                        <span className="text-xs text-white font-semibold text-left line-clamp-2">{cls.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/40 shrink-0 ml-2">{cls.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#282725] rounded-2xl border border-[#3d3a37]">
                <h3 className="text-white text-lg font-bold font-serif mb-2">Materiales de Estudio</h3>
                <p className="text-white/60 text-sm leading-relaxed">Planillas, guías y fichas técnicas exclusivas para alumnas matriculadas.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {downloads.map((dl, i) => (
                  <div key={i} className="p-5 bg-[#282725] hover:bg-[#32312e] rounded-xl border border-[#3d3a37] flex items-center justify-between gap-4 transition-colors">
                    <div>
                      <h4 className="text-white text-sm font-bold font-serif">{dl.title}</h4>
                      <div className="flex gap-2 text-[10px] text-white/50 font-mono uppercase mt-1">
                        <span className="bg-[#1c1c1a] px-2 py-0.5 rounded-sm text-primary-fixed-dim">{dl.type}</span>
                        <span>{dl.size}</span>
                      </div>
                    </div>
                    <button className="bg-primary hover:bg-primary/95 text-on-primary p-3 rounded-lg flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer">
                      <DownloadIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#282725] rounded-2xl border border-[#3d3a37]">
                <h3 className="text-white text-lg font-bold font-serif mb-2">Proveedores Exclusivos</h3>
                <p className="text-white/60 text-sm leading-relaxed">Lista validada de proveedores recomendados en Argentina y Brasil.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suppliers.map((sup, i) => (
                  <div key={i} className="p-6 bg-[#282725] rounded-xl border border-[#3d3a37] space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-white text-base font-bold font-serif">{sup.name}</h4>
                        <span className="text-[10px] font-mono text-white/50 uppercase flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-primary-fixed-dim" />{sup.region}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sup.tags.map((tag, idx) => (
                          <span key={idx} className="bg-primary/20 text-primary-fixed-dim px-2 py-0.5 text-[9px] font-bold rounded-sm uppercase tracking-wide font-mono">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-white/70 text-xs leading-relaxed">{sup.specialty}</p>
                    <div className="pt-3 border-t border-[#3d3a37] flex items-center justify-between text-xs">
                      <span className="text-white/50 font-mono">Contacto:</span>
                      <a href={`tel:${sup.contact}`} className="text-primary-fixed-dim font-bold hover:underline flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />{sup.contact}
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
                        <span className="text-[9px] font-mono text-primary-fixed-dim uppercase tracking-wider">{post.courseName} · {post.time}</span>
                      </div>
                    </div>
                    <Flame className="w-5 h-5 text-tertiary-container" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white text-base font-bold font-serif">{post.title}</h4>
                    <p className="text-white/80 text-sm leading-relaxed">{post.content}</p>
                  </div>
                  {post.comments.map((com, idx) => (
                    <div key={idx} className="bg-[#1c1c1a]/40 p-4 rounded-xl border-l-2 border-primary space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {com.author}
                          <span className="bg-primary text-on-primary text-[8px] font-bold font-mono uppercase px-2 py-0.5 rounded-full">FADA</span>
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-primary-fixed-dim" />
                      </div>
                      <p className="text-white/70 text-xs italic">{com.text}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Ícone Download inline (não exportado pelo barrel de lucide-react nesta versão)
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
