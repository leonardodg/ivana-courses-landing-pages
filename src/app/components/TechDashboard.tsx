import { useState } from 'react';
import { Database, Cpu, Layers, Play, RefreshCw, CheckCircle2, Terminal, Shield, ArrowRight } from 'lucide-react';
import { Language, CategoryId } from '../classes/types';

interface TechDashboardProps {
  language: Language;
  activeCategoryId: CategoryId;
}

export default function TechDashboard({ language, activeCategoryId }: TechDashboardProps) {
  const [cacheStatus, setCacheStatus] = useState<'idle' | 'fetching' | 'hit' | 'miss'>('idle');
  const [latency, setLatency] = useState<number | null>(null);
  const [simulatedStore, setSimulatedStore] = useState<{ hits: number; misses: number }>({ hits: 0, misses: 0 });
  const [isCachedInRedis, setIsCachedInRedis] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<'postgres' | 'redis' | 'flow'>('flow');

  const handleSimulateRequest = () => {
    setCacheStatus('fetching');
    setLatency(null);

    setTimeout(() => {
      if (isCachedInRedis) {
        // Cache Hit
        setLatency(Math.floor(Math.random() * 2) + 1); // 1-3 ms
        setCacheStatus('hit');
        setSimulatedStore(prev => ({ ...prev, hits: prev.hits + 1 }));
      } else {
        // Cache Miss
        setLatency(Math.floor(Math.random() * 80) + 45); // 45-125 ms
        setCacheStatus('miss');
        setSimulatedStore(prev => ({ ...prev, misses: prev.misses + 1 }));
        setIsCachedInRedis(true); // Now cached
      }
    }, 800);
  };

  const handleClearCache = () => {
    setIsCachedInRedis(false);
    setCacheStatus('idle');
    setLatency(null);
  };

  const t = {
    pt: {
      title: 'Plano de Engenharia: PostgreSQL & Redis',
      subtitle: 'Estruturação lógica de banco de dados e caching de alto desempenho planejado para Ivana Academy.',
      tabFlow: 'Simulação de Requisição & Caching',
      tabPostgres: 'Esquema PostgreSQL (Tabelas SQL)',
      tabRedis: 'Estratégia de Cache do Redis',
      isCachedLabel: 'Status do Redis para',
      cached: 'Mapeado em Cache',
      notCached: 'Expirado / Não Mapeado',
      cacheMetrics: 'Métricas de Cache Simuladas',
      hits: 'Sucessos (Cache Hits)',
      misses: 'Leituras no Banco (Cache Misses)',
      btnRun: 'Disparar Requisição API',
      btnClear: 'Invalidar Cache (DEL)',
      fetching: 'Processando requisição...',
      responseTxt: 'Resposta recebida em',
      resultHit: 'REDIS HIT: Dados entregues instantaneamente do cache em memória RAM.',
      resultMiss: 'REDIS MISS: Dados buscados no PostgreSQL; salvando em cache Redis por 24h.',
      sqlDescription: 'Para garantir integridade transacional de registros, inscrições e leads captados:',
      postgresCode: `--- Esquema estrutural do Banco PostgreSQL do Ivana Academy

-- 1. Tabela de Categorias
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name_pt VARCHAR(100) NOT NULL,
    name_es VARCHAR(100) NOT NULL,
    theme_color VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Cursos & Workshops
CREATE TABLE courses (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
    title_pt VARCHAR(150) NOT NULL,
    title_es VARCHAR(150) NOT NULL,
    duracao_pt VARCHAR(50),
    duracao_es VARCHAR(50),
    modalidade VARCHAR(30) CHECK (modalidade IN ('presencial', 'virtual', 'hibrido')),
    location_pt VARCHAR(200),
    location_es VARCHAR(200),
    materials_pt TEXT,
    materials_es TEXT,
    description_pt TEXT,
    description_es TEXT,
    features_pt TEXT[], -- Array de destaques
    features_es TEXT[],
    rating DECIMAL(3,2) DEFAULT 5.0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Leads Captados (Mapeamento Comercial)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    course_id VARCHAR(100) REFERENCES courses(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      redisDescription: 'As consultas de catálogos e cursos costumam ter alta leitura e pouca alteração. Usaremos o Redis para aliviar o banco relacional e garantir tempos de reposta na casa de 1-3ms.',
      redisCode: `// Lógica de manipulação de Cache em Node.js (Express + Redis)
import { createClient } from 'redis';
import { Pool } from 'pg';

const redis = createClient({ url: process.env.REDIS_URL });
const pgPool = pool({ connectionString: process.env.DATABASE_URL });

export async function getCoursesByCategoryId(categoryId: string) {
  const cacheKey = \`courses:category:\${categoryId}\`;

  // 1. Tentar ler do Redis
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return {
      source: 'REDIS_CACHE_HIT',
      data: JSON.parse(cachedData)
    };
  }

  // 2. Tentar ler do PostgreSQL (Redis Miss)
  const queryResult = await pgPool.query(
    'SELECT * FROM courses WHERE category_id = $1 ORDER BY id',
    [categoryId]
  );
  
  const courses = queryResult.rows;

  // 3. Salvar no Redis com TTL de 24 horas (86400 segundos) para auto-expiração
  await redis.setEx(cacheKey, 86400, JSON.stringify(courses));

  return {
    source: 'POSTGRESQL_READ_MISS',
    data: courses
  };
}`
    },
    es: {
      title: 'Plano de Ingeniería: PostgreSQL & Redis',
      subtitle: 'Estructura modular de base de datos y caching de alta velocidad planeado para Ivana Academy.',
      tabFlow: 'Simulación de Petición & Cache',
      tabPostgres: 'Esquema PostgreSQL (Tablas SQL)',
      tabRedis: 'Estrategia de Cache en Redis',
      isCachedLabel: 'Estado de Redis para',
      cached: 'Guardado en Caché',
      notCached: 'Expirado / Sin Caché',
      cacheMetrics: 'Métricas de Caché Simuladas',
      hits: 'Aciertos (Cache Hits)',
      misses: 'Peticiones SQL (Cache Misses)',
      btnRun: 'Disparar Solicitud API',
      btnClear: 'Invalidar Caché (DEL)',
      fetching: 'Procesando solicitud...',
      responseTxt: 'Respuesta recibida en',
      resultHit: 'REDIS HIT: Información provista instantáneamente desde la memoria RAM del servidor.',
      resultMiss: 'REDIS MISS: No se encontró en caché. Información leída desde PostgreSQL y guardada en Redis por 24h.',
      sqlDescription: 'Para asegurar la integridad en inscripciones, registros de estudiantes y prospectos comerciales (leads):',
      postgresCode: `--- Esquema estructural de Base de Datos PostgreSQL para Ivana Academy

-- 1. Tabla de Categorías
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name_pt VARCHAR(100) NOT NULL,
    name_es VARCHAR(100) NOT NULL,
    theme_color VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Cursos & Talleres
CREATE TABLE courses (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
    title_pt VARCHAR(150) NOT NULL,
    title_es VARCHAR(150) NOT NULL,
    duracao_pt VARCHAR(50),
    duracao_es VARCHAR(50),
    modalidade VARCHAR(30) CHECK (modalidade IN ('presencial', 'virtual', 'hibrido')),
    location_pt VARCHAR(200),
    location_es VARCHAR(200),
    materials_pt TEXT,
    materials_es TEXT,
    description_pt TEXT,
    description_es TEXT,
    features_pt TEXT[], -- Conjunto de especificaciones
    features_es TEXT[],
    rating DECIMAL(3,2) DEFAULT 5.0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Leads (Ventas / Campañas)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    course_id VARCHAR(100) REFERENCES courses(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      redisDescription: 'Los catálogos y cursos tienen alta lectura pero baja tasa de modificación. Se implementa Redis para descargar base de datos relacional y responder respuestas en 1-3 milisegundos.',
      redisCode: `// Lógica de control de Caché en Node.js (Express + Redis)
import { createClient } from 'redis';
import { Pool } from 'pg';

const redis = createClient({ url: process.env.REDIS_URL });
const pgPool = pool({ connectionString: process.env.DATABASE_URL });

export async function getCoursesByCategoryId(categoryId: string) {
  const cacheKey = \`courses:category:\${categoryId}\`;

  // 1. Intentar recuperación desde Redis
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return {
      source: 'REDIS_CACHE_HIT',
      data: JSON.parse(cachedData)
    };
  }

  // 2. Leer desde PostgreSQL como respaldo
  const queryResult = await pgPool.query(
    'SELECT * FROM courses WHERE category_id = $1 ORDER BY id',
    [categoryId]
  );
  
  const courses = queryResult.rows;

  // 3. Almacenar en Redis aplicando TTL de 24 horas (86400 segundos) de autoexpiración
  await redis.setEx(cacheKey, 86400, JSON.stringify(courses));

  return {
    source: 'POSTGRESQL_READ_MISS',
    data: courses
  };
}`
    }
  }[language];

  return (
    <div id="tech-blueprint" className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>Architecture Board & Back-End Lab</span>
          </div>
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-slate-100">{t.title}</h3>
          <p className="text-sm text-slate-400 mt-1">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-850 px-3 py-1.5 rounded-full border border-slate-800 text-xs text-slate-400">
          <span>{t.isCachedLabel} <span className="font-mono text-sky-400 uppercase font-semibold">{activeCategoryId}</span>:</span>
          {isCachedInRedis ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              {t.cached}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/40 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              {t.notCached}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTab('flow')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs md:text-sm tracking-wide transition-all ${
            selectedTab === 'flow' 
              ? 'bg-rose-500 text-white shadow-md shadow-rose-900/30' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
          }`}
        >
          <Layers className="w-4 h-4" />
          {t.tabFlow}
        </button>
        <button
          onClick={() => setSelectedTab('postgres')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs md:text-sm tracking-wide transition-all ${
            selectedTab === 'postgres' 
              ? 'bg-rose-500 text-white shadow-md shadow-rose-900/30' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
          }`}
        >
          <Database className="w-4 h-4" />
          {t.tabPostgres}
        </button>
        <button
          onClick={() => setSelectedTab('redis')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs md:text-sm tracking-wide transition-all ${
            selectedTab === 'redis' 
              ? 'bg-rose-500 text-white shadow-md shadow-rose-900/30' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
          }`}
        >
          <Cpu className="w-4 h-4" />
          {t.tabRedis}
        </button>
      </div>

      {/* Tab Context */}
      {selectedTab === 'flow' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-950 rounded-xl p-5 border border-slate-800">
            <h4 className="text-sm font-semibold text-rose-300 mb-4 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              API Fetch Request Simulator
            </h4>

            {/* Simulated Server Screen */}
            <div className="aspect-[16/9] bg-black text-terminal-green font-mono text-xs rounded-lg p-4 overflow-y-auto border border-slate-850 flex flex-col justify-between">
              <div className="space-y-1">
                <p className="text-slate-500"># System Listening. Press trigger button below.</p>
                <p className="text-slate-400">GET /api/courses/{activeCategoryId} HTTP/1.1</p>
                <p className="text-slate-400">Host: api.ivana.academy</p>
                
                {cacheStatus === 'fetching' && (
                  <p className="text-amber-400 animate-pulse mt-2">&gt;&gt; {t.fetching}</p>
                )}

                {cacheStatus === 'hit' && (
                  <>
                    <p className="text-slate-500 mt-2">&gt;&gt; [REDIS KEY] courses:category:{activeCategoryId}</p>
                    <p className="text-emerald-400 font-bold">&gt;&gt; REDIS CACHE HIT ⚡</p>
                    <p className="text-slate-200"># Returning JSON directly from RAM in {latency}ms.</p>
                  </>
                )}

                {cacheStatus === 'miss' && (
                  <>
                    <p className="text-slate-500 mt-2">&gt;&gt; [REDIS KEY] courses:category:{activeCategoryId} NOT FOUND</p>
                    <p className="text-amber-400 font-bold">&gt;&gt; REDIS CACHE MISS 💾</p>
                    <p className="text-blue-400">&gt;&gt; Executed PostgreSQL: SELECT * FROM courses WHERE category_id = &apos;{activeCategoryId}&apos;</p>
                    <p className="text-terminal-green">&gt;&gt; PostgreSQL Row count: {activeCategoryId === 'velas' ? 5 : activeCategoryId === 'saboaria' ? 2 : activeCategoryId === 'resinas' ? 1 : activeCategoryId === 'macrame' ? 1 : 3}</p>
                    <p className="text-purple-400">&gt;&gt; REDIS SETEX courses:category:{activeCategoryId} 86400 [DATA]</p>
                    <p className="text-slate-200"># Data requested, stored in Redis & delivered in {latency}ms.</p>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-900 mt-4 pt-2 text-[10px] text-slate-500 font-bold">
                <span>PORT: 6379 (Redis) / 5432 (PostgreSQL)</span>
                <span>STATE: {cacheStatus.toUpperCase()}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={handleSimulateRequest}
                disabled={cacheStatus === 'fetching'}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg font-mono tracking-wide transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {t.btnRun}
              </button>
              <button
                onClick={handleClearCache}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs px-4 py-2.5 rounded-lg font-mono tracking-wide transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {t.btnClear}
              </button>
            </div>
          </div>

          {/* Metrics Column */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950 rounded-xl p-5 border border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-rose-300 mb-4 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                {t.cacheMetrics}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {language === 'pt' 
                  ? 'Entenda a diferença de latência. O Redis (In-Memory) responde em média 100x mais rápido que o PostgreSQL (Leitura física em SSD/Disco).' 
                  : 'Comprende la diferencia de velocidad. El motor de Redis en memoria RAM responde hasta 100 veces más rápido que leer el almacenamiento físico de PostgreSQL.'}
              </p>

              <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400">{t.hits}</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">{simulatedStore.hits}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: simulatedStore.hits + simulatedStore.misses > 0 
                          ? `${(simulatedStore.hits / (simulatedStore.hits + simulatedStore.misses)) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-1">~ 1ms-2ms Response Time</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400">{t.misses}</span>
                    <span className="text-amber-400 font-mono font-bold text-sm">{simulatedStore.misses}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: simulatedStore.hits + simulatedStore.misses > 0 
                          ? `${(simulatedStore.misses / (simulatedStore.hits + simulatedStore.misses)) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono block mt-1">~ 50ms-120ms SQL Query Delay</span>
                </div>
              </div>
            </div>

            {hasResults(latency) && (
              <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-850">
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">{t.responseTxt}</p>
                <p className="text-lg font-mono font-bold text-slate-100 flex items-center gap-1.5">
                  <span className={`${latency! < 5 ? 'text-emerald-400' : 'text-amber-400'}`}>{latency} ms</span>
                  <span className="text-xs text-slate-500">({latency! < 5 ? 'Ultra fast RAM Cache' : 'Database query executed'})</span>
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {cacheStatus === 'hit' ? t.resultHit : t.resultMiss}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTab === 'postgres' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            {t.sqlDescription}
          </p>
          <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-800 font-mono text-xs text-rose-300">
            <pre className="whitespace-pre">{t.postgresCode}</pre>
          </div>
        </div>
      )}

      {selectedTab === 'redis' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-body-md">
            {t.redisDescription}
          </p>
          <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto border border-slate-800 font-mono text-xs text-emerald-400">
            <pre className="whitespace-pre">{t.redisCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function hasResults(val: number | null): boolean {
  return val !== null;
}
