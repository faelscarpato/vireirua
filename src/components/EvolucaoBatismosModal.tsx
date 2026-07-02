import React, { useMemo } from 'react';
import { RuaComMeta, EstatisticaDecada, CityConfig } from '../types';
import { EIXOS_INFO } from '../utils/eixosCulturais';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend
} from 'recharts';
import { TrendingUp, X, Calendar, Filter, Sparkles, Award, Layers } from 'lucide-react';

interface EvolucaoBatismosModalProps {
  ruas: RuaComMeta[];
  isOpen: boolean;
  onClose: () => void;
  decadaAtiva: string | null;
  onSelectDecada: (decada: string | null) => void;
  currentCity?: CityConfig;
}

export const EvolucaoBatismosModal: React.FC<EvolucaoBatismosModalProps> = ({
  ruas,
  isOpen,
  onClose,
  decadaAtiva,
  onSelectDecada,
  currentCity
}) => {
  const cityName = currentCity ? currentCity.nome : 'Pedreira';
  if (!isOpen) return null;

  // 1. Calcular estatísticas por década
  const statsDecadas = useMemo(() => {
    const decadasLista = ['Colonial', '1900s-1950s', '1960s', '1970s', '1980s', '1990s', '2000s+'];
    const mapa: Record<string, EstatisticaDecada> = {};

    decadasLista.forEach((dec) => {
      mapa[dec] = {
        decada: dec,
        total: 0,
        militar: 0,
        pioneiros: 0,
        ciencia_artes: 0,
        religiao: 0,
        natureza_outros: 0
      };
    });

    ruas.forEach((r) => {
      const dec = r.decada || '1960s';
      if (mapa[dec]) {
        mapa[dec].total += 1;
        if (r.eixo !== 'all') {
          mapa[dec][r.eixo] += 1;
        }
      }
    });

    return Object.values(mapa);
  }, [ruas]);

  // 2. Dados globais para o gráfico de Pizza (proporção por eixo)
  const dadosPizza = useMemo(() => {
    const eixos = ['militar', 'pioneiros', 'ciencia_artes', 'religiao', 'natureza_outros'] as const;
    return eixos.map((eixo) => ({
      name: EIXOS_INFO[eixo].label.split('&')[0].trim(),
      value: ruas.filter(r => r.eixo === eixo).length,
      color: EIXOS_INFO[eixo].corHex
    })).filter(item => item.value > 0);
  }, [ruas]);

  // Contexto histórico por década selecionada ou geral
  const contextoDecadas: Record<string, { titulo: string; desc: string }> = {
    '1960s': {
      titulo: '1960s: Consolidação do Núcleo Urbano & Civismo',
      desc: 'Período de batismos focados nas grandes referências nacionais, expedições da FEB e vultos da proclamação da república, refletindo a urbanização do Centro Histórico.'
    },
    '1970s': {
      titulo: '1970s: O Boom da Porcelana & Expansão Operária',
      desc: 'Com o rápido crescimento das indústrias cerâmicas e manufaturas de louça, surgiram novos loteamentos como a Vila Monte Alegre, batizados em homenagem a engenheiros militares e pracinhas.'
    },
    '1980s': {
      titulo: '1980s: Povoamento dos Bairros & Homenagem às Famílias',
      desc: 'Década de expressivo reconhecimento às famílias fundadoras (Peron, Marchi, Baldasso, Steula) e aos doutores e educadores que estruturaram a saúde e o ensino do município.'
    },
    '1990s': {
      titulo: '1990s: Loteamentos Planejados & Alamedas',
      desc: 'Abertura de residenciais mais afastados do vale do Jaguari, dando início ao uso frequente de alamedas temáticas com nomes da flora nativa e árvores da Mata Atlântica.'
    },
    '2000s+': {
      titulo: '2000s+: Modernização & Memória Viva',
      desc: 'Período de integração de novos loteamentos industriais e turísticos, preservando o tributo a líderes comunitários e à tradição católica local.'
    }
  };

  const decadaSelecionadaInfo = decadaAtiva ? contextoDecadas[decadaAtiva] : null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#0a0a0b]/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0f0f10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-6 bg-[#1a1a1c] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] shadow-lg">
              <TrendingUp className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#c5a059]/15 text-[#c5a059] font-mono px-2 py-0.5 rounded border border-[#c5a059]/30 uppercase font-bold">
                  Análise Cronológica
                </span>
                <span className="text-xs text-[#dcdcdc]/60 font-mono">1960s – 2000s+</span>
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-[#f5f2ed] mt-1 tracking-tight">
                Evolução de Batismos & Crescimento Urbano
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded bg-[#0a0a0b] hover:bg-white/10 text-[#dcdcdc]/60 hover:text-[#f5f2ed] border border-white/10 transition-colors"
            title="Fechar Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* Instrução interativa */}
          <div className="bg-[#0a0a0b]/60 border border-[#c5a059]/30 rounded p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#c5a059] shrink-0" />
              <p className="text-xs text-[#dcdcdc] font-serif">
                💡 <strong>Dica Interativa:</strong> Clique em uma era no gráfico abaixo ou nos botões para <strong>filtrar o mapa em tempo real</strong> e visualizar como a malha urbana de {cityName} evoluiu naquela época!
              </p>
            </div>
            {decadaAtiva && (
              <button
                onClick={() => onSelectDecada(null)}
                className="px-3 py-1.5 rounded bg-[#d9777f]/20 hover:bg-[#d9777f]/30 text-[#d9777f] border border-[#d9777f]/30 text-xs font-semibold transition-all flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpar filtro ({decadaAtiva})</span>
              </button>
            )}
          </div>

          {/* Gráfico 1: Barras por Década */}
          <div className="bg-[#0a0a0b]/60 border border-white/10 rounded p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-serif font-bold text-sm text-[#f5f2ed] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c5a059]" /> Volume de Vias Batizadas por Década
              </h3>
              <span className="text-[11px] text-[#dcdcdc]/60 font-mono">Total cadastrado: {ruas.length} vias</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsDecadas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="decada" stroke="#888" fontSize={12} tickLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#f5f2ed' }}
                    labelStyle={{ color: '#c5a059', fontWeight: 'bold' }}
                  />
                  <Bar 
                    dataKey="total" 
                    name="Vias batizadas" 
                    radius={[8, 8, 0, 0]}
                    cursor="pointer"
                    onClick={(data: any) => {
                      const dec = data?.decada || data?.payload?.decada;
                      if (dec) {
                        onSelectDecada(dec === decadaAtiva ? null : dec);
                      }
                    }}
                  >
                    {statsDecadas.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.decada === decadaAtiva ? '#c5a059' : '#4a4a4f'}
                        opacity={decadaAtiva && entry.decada !== decadaAtiva ? 0.4 : 0.9}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Botões de Filtro Rápido de Década */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              {statsDecadas.map((st) => {
                const isSelected = decadaAtiva === st.decada;
                return (
                  <button
                    key={st.decada}
                    onClick={() => onSelectDecada(isSelected ? null : st.decada)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-md shadow-[#c5a059]/20 font-bold'
                        : 'bg-[#1a1a1c] text-[#dcdcdc] border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>{st.decada}</span>
                    <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                      isSelected ? 'bg-black text-[#c5a059]' : 'bg-[#0a0a0b] text-[#dcdcdc]/60'
                    }`}>
                      {st.total}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contexto Histórico Detalhado */}
          {decadaSelecionadaInfo ? (
            <div className="bg-[#1a1a1c] border border-[#c5a059]/40 rounded p-5 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#c5a059] shrink-0" />
                <h4 className="font-serif font-bold text-base text-[#c5a059]">
                  {decadaSelecionadaInfo.titulo}
                </h4>
              </div>
              <p className="text-sm text-[#dcdcdc] leading-relaxed font-normal font-serif">
                {decadaSelecionadaInfo.desc}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(contextoDecadas).map(([dec, info]) => (
                <div 
                  key={dec}
                  onClick={() => onSelectDecada(dec)}
                  className="bg-[#0a0a0b]/60 border border-white/10 rounded p-4 space-y-1.5 cursor-pointer transition-all hover:border-[#c5a059]/50 hover:bg-[#1a1a1c]/60"
                >
                  <span className="text-xs font-bold text-[#c5a059] font-mono">📅 {dec}</span>
                  <h5 className="font-serif font-bold text-sm text-[#f5f2ed]">{info.titulo.split(':')[1]}</h5>
                  <p className="text-xs text-[#dcdcdc]/70 leading-relaxed line-clamp-2 font-serif">{info.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Gráfico 2: Proporção por Eixo Cultural */}
          <div className="bg-[#0a0a0b]/60 border border-white/10 rounded p-5 space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#f5f2ed] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c5a059]" /> Distribuição de Homenagens por Eixo Cultural
            </h3>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPizza}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {dadosPizza.map((entry, idx) => (
                      <Cell key={`pie-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#f5f2ed' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Rodapé */}
        <div className="p-4 bg-[#0a0a0b] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-[#dcdcdc]/60 font-mono">
            📊 Dados processados dinamicamente dos decretos legislativos
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-[#c5a059] hover:bg-[#d4b06a] text-black font-bold text-xs transition-all shadow-md shadow-[#c5a059]/20"
          >
            Voltar ao Mapa
          </button>
        </div>
      </div>
    </div>
  );
};
