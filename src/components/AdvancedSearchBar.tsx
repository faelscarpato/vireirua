import React, { useState, useRef, useEffect } from 'react';
import { RuaComMeta, EixoCultural, CityConfig } from '../types';
import { EIXOS_INFO } from '../utils/eixosCulturais';
import { Search, X, Filter, SlidersHorizontal, MapPin, User, Calendar, BookOpen, Sparkles, Check } from 'lucide-react';

interface AdvancedSearchBarProps {
  ruas: RuaComMeta[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEixo: EixoCultural;
  onSelectEixo: (eixo: EixoCultural) => void;
  decadaAtiva: string | null;
  onSelectDecada: (decada: string | null) => void;
  tipoBusca: 'tudo' | 'nome' | 'homenageado' | 'lei';
  onSelectTipoBusca: (tipo: 'tudo' | 'nome' | 'homenageado' | 'lei') => void;
  onSelectRua: (rua: RuaComMeta) => void;
  totalResultados: number;
  currentCity: CityConfig;
}

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  ruas,
  searchQuery,
  onSearchChange,
  selectedEixo,
  onSelectEixo,
  decadaAtiva,
  onSelectDecada,
  tipoBusca,
  onSelectTipoBusca,
  onSelectRua,
  totalResultados,
  currentCity
}) => {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fechar popovers ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calcular sugestões automáticas baseadas no que o usuário digita
  const sugestoes = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];

    const query = searchQuery.toLowerCase().trim();
    const matches: Array<{ rua: RuaComMeta; matchType: string; snippet: string }> = [];

    for (const rua of ruas) {
      if (matches.length >= 7) break; // Limite de 7 sugestões

      const nomeLower = rua.nome.toLowerCase();
      const homLower = rua.homenageado.toLowerCase();
      const leiLower = rua.lei.toLowerCase();
      const decLower = rua.decada.toLowerCase();
      const infoEixo = EIXOS_INFO[rua.eixo];
      const eixoLower = infoEixo.label.toLowerCase();

      if (tipoBusca === 'tudo' || tipoBusca === 'nome') {
        if (nomeLower.includes(query)) {
          matches.push({ rua, matchType: 'Nome', snippet: rua.nome });
          continue;
        }
      }
      if (tipoBusca === 'tudo' || tipoBusca === 'homenageado') {
        if (homLower.includes(query)) {
          matches.push({ rua, matchType: 'Homenageado', snippet: rua.homenageado });
          continue;
        }
      }
      if (tipoBusca === 'tudo') {
        if (eixoLower.includes(query)) {
          matches.push({ rua, matchType: `Eixo: ${infoEixo.label}`, snippet: rua.nome });
          continue;
        }
        if (decLower.includes(query) || rua.ano.toString().includes(query)) {
          matches.push({ rua, matchType: `Período: ${rua.decada}`, snippet: rua.nome });
          continue;
        }
      }
      if (tipoBusca === 'tudo' || tipoBusca === 'lei') {
        if (leiLower.includes(query)) {
          matches.push({ rua, matchType: 'Decreto/Lei', snippet: rua.lei });
          continue;
        }
      }
    }

    return matches;
  }, [ruas, searchQuery, tipoBusca]);

  const decadasDisponiveis = [
    { label: 'Todas as Épocas', value: null },
    { label: 'Século XVIII e XIX (Colonial/Imperial)', value: 'Colonial' },
    { label: 'Anos 1960 e anteriores', value: '1960s' },
    { label: 'Anos 1970', value: '1970s' },
    { label: 'Anos 1980', value: '1980s' },
    { label: 'Anos 1990', value: '1990s' },
    { label: 'Anos 2000 em diante', value: '2000s+' }
  ];

  const hasActiveFilters = selectedEixo !== 'all' || decadaAtiva !== null || tipoBusca !== 'tudo';

  const handleClearFilters = () => {
    onSelectEixo('all');
    onSelectDecada(null);
    onSelectTipoBusca('tudo');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      {/* Barra de Busca e Botão de Filtro */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#c5a059] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsSuggestionsOpen(true);
            }}
            onFocus={() => setIsSuggestionsOpen(true)}
            placeholder={`Buscar por via, homenageado, era ou eixo em ${currentCity.nome}...`}
            className="w-full bg-[#1a1a1c] border border-white/15 rounded-full pl-9 pr-9 py-2 text-sm text-[#f5f2ed] placeholder-[#dcdcdc]/40 focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/40 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                setIsSuggestionsOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#dcdcdc]/40 hover:text-[#f5f2ed] p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Botão de Filtros Avançados */}
        <button
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border shrink-0 ${
            hasActiveFilters || isFilterMenuOpen
              ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-md shadow-[#c5a059]/20 font-bold'
              : 'bg-[#1a1a1c] text-[#dcdcdc] border-white/15 hover:border-white/30 hover:text-white'
          }`}
          title="Opções de Filtros Avançados"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filtros</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-black sm:ml-0.5 animate-pulse" />
          )}
        </button>
      </div>

      {/* Auto-Suggestions Popover (Sugestões ao digitar) */}
      {isSuggestionsOpen && sugestoes.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#0f0f10] border border-white/15 rounded-xl shadow-2xl overflow-hidden z-[2500] animate-fadeIn">
          <div className="p-2.5 bg-[#1a1a1c] border-b border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-[#c5a059] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Sugestões Rápida ({sugestoes.length})
            </span>
            <span className="text-[10px] text-[#dcdcdc]/50">
              Pressione para centralizar no mapa
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
            {sugestoes.map((item, idx) => (
              <button
                key={`${item.rua.id}_${idx}`}
                onClick={() => {
                  onSelectRua(item.rua);
                  setIsSuggestionsOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-white/10 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg shrink-0 p-1 rounded bg-white/5 group-hover:bg-[#c5a059]/20 transition-colors">
                    {item.rua.iconeEmoji}
                  </span>
                  <div className="min-w-0">
                    <div className="font-serif font-bold text-sm text-[#f5f2ed] truncate group-hover:text-[#c5a059] transition-colors">
                      {item.rua.nome}
                    </div>
                    <div className="text-[11px] text-[#dcdcdc]/70 truncate font-sans">
                      {item.rua.homenageado}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/30 font-mono font-semibold whitespace-nowrap">
                    {item.matchType}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popover de Filtros Avançados */}
      {isFilterMenuOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#0f0f10] border border-white/15 rounded-xl shadow-2xl p-4 z-[2500] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#c5a059]" />
              <h3 className="font-serif font-bold text-sm text-[#f5f2ed]">
                Refinar Busca & Filtros ({totalResultados} vias encontradas)
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-[#c5a059] hover:underline font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* 1. Tipo de Busca */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-[#dcdcdc]/60 tracking-wider font-bold">
              1. Campo de Busca Textual:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'tudo', label: 'Tudo (Geral)' },
                { id: 'nome', label: 'Nome da Via' },
                { id: 'homenageado', label: 'Homenageado' },
                { id: 'lei', label: 'Decreto / Lei' }
              ].map((op) => (
                <button
                  key={op.id}
                  onClick={() => onSelectTipoBusca(op.id as any)}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium text-center transition-all border ${
                    tipoBusca === op.id
                      ? 'bg-[#c5a059] text-black font-bold border-[#c5a059]'
                      : 'bg-[#1a1a1c] text-[#dcdcdc]/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Período Histórico / Era */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-[#dcdcdc]/60 tracking-wider font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c5a059]" /> 2. Período / Era Histórica:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {decadasDisponiveis.map((dec) => {
                const isSelected = decadaAtiva === dec.value;
                return (
                  <button
                    key={dec.label}
                    onClick={() => onSelectDecada(dec.value)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all border ${
                      isSelected
                        ? 'bg-[#c5a059] text-black font-bold border-[#c5a059]'
                        : 'bg-[#1a1a1c] text-[#dcdcdc]/80 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {dec.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botão para aplicar/fechar */}
          <div className="pt-2 border-t border-white/10 flex justify-end">
            <button
              onClick={() => setIsFilterMenuOpen(false)}
              className="px-4 py-1.5 rounded bg-[#c5a059] hover:bg-[#d4b06a] text-black font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Ver {totalResultados} resultados no mapa</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
