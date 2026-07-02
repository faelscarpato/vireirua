import React, { useState } from 'react';
import { EixoCultural, CityId, CityConfig, RuaComMeta } from '../types';
import { EIXOS_INFO } from '../utils/eixosCulturais';
import { getCitiesList } from '../data/cidadesRepository';
import { AdvancedSearchBar } from './AdvancedSearchBar';
import { MapPin, TrendingUp, Info, X, Sparkles, ChevronDown, Building2, Check } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedEixo: EixoCultural;
  onSelectEixo: (eixo: EixoCultural) => void;
  contagensEixos: Record<EixoCultural, number>;
  onOpenEvolucao: () => void;
  onOpenAbout: () => void;
  decadaAtiva: string | null;
  onClearDecada: () => void;
  onSelectDecada: (decada: string | null) => void;
  selectedCity: CityId;
  onSelectCity: (cityId: CityId) => void;
  currentCity: CityConfig;
  ruas: RuaComMeta[];
  tipoBusca: 'tudo' | 'nome' | 'homenageado' | 'lei';
  onSelectTipoBusca: (tipo: 'tudo' | 'nome' | 'homenageado' | 'lei') => void;
  onSelectRua: (rua: RuaComMeta) => void;
  totalResultados: number;
  onOpenAISettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedEixo,
  onSelectEixo,
  contagensEixos,
  onOpenEvolucao,
  onOpenAbout,
  onOpenAISettings,
  decadaAtiva,
  onClearDecada,
  onSelectDecada,
  selectedCity,
  onSelectCity,
  currentCity,
  ruas,
  tipoBusca,
  onSelectTipoBusca,
  onSelectRua,
  totalResultados
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const eixos: EixoCultural[] = ['all', 'militar', 'pioneiros', 'ciencia_artes', 'religiao', 'natureza_outros'];
  const citiesList = getCitiesList();

  return (
    <header className="bg-[#0f0f10] border-b border-white/10 z-[1000] px-4 sm:px-6 py-3 shadow-xl relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3.5">
        
        {/* Logo, Título & Seletor de Cidades */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#c5a059] flex items-center justify-center shadow-lg shadow-[#c5a059]/20 text-black font-bold text-lg shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif font-bold text-lg sm:text-xl text-[#f5f2ed] tracking-tight">
                  Ruas com <span className="text-[#c5a059] opacity-90">História</span>
                </h1>

                {/* Seletor de Cidades (Dropdown / Popover) */}
                <div className="relative inline-block">
                  <button
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1a1a1c] hover:bg-white/10 text-[#c5a059] border border-[#c5a059]/40 text-xs font-mono font-bold uppercase transition-all shadow-sm"
                    title="Mudar Cidade"
                  >
                    <Building2 className="w-3 h-3 text-[#c5a059]" />
                    <span>{currentCity.nome}/{currentCity.estado}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCityDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-[#0f0f10] border border-white/15 rounded-xl shadow-2xl py-2 z-[3000] animate-fadeIn">
                      <div className="px-3 py-1.5 border-b border-white/10 text-[10px] text-[#c5a059] font-mono uppercase font-bold tracking-wider">
                        🏛️ Cidades Cadastradas ({citiesList.length})
                      </div>
                      <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
                        {citiesList.map((city) => {
                          const isSelected = city.id === selectedCity;
                          return (
                            <button
                              key={city.id}
                              onClick={() => {
                                onSelectCity(city.id);
                                setIsCityDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                                isSelected ? 'bg-[#c5a059]/15 text-[#c5a059]' : 'hover:bg-white/5 text-[#f5f2ed]'
                              }`}
                            >
                              <div>
                                <div className="font-serif font-bold text-sm">
                                  {city.nome} <span className="text-xs font-mono text-[#dcdcdc]/60">/{city.estado}</span>
                                </div>
                                <div className="text-[10px] text-[#dcdcdc]/60 line-clamp-1 font-sans">
                                  {city.subtitulo}
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-[#c5a059] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[10px] text-[#dcdcdc]/50 hidden sm:block font-mono mt-0.5">
                SISTEMA DETERMINÍSTICO • DB_HASH: {currentCity.dbHash}
              </p>
            </div>
          </div>

          {/* Mobile botões de ação */}
          <div className="flex lg:hidden items-center gap-1.5">
            {onOpenAISettings && (
              <button
                onClick={onOpenAISettings}
                className="p-2 rounded bg-[#58b38a]/10 text-[#58b38a] border border-[#58b38a]/30 hover:bg-[#58b38a]/20 transition-colors"
                title="Configurações de IA & Buscadores Secundários"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onOpenEvolucao}
              className="p-2 rounded bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 hover:bg-[#c5a059]/20 transition-colors"
              title="Evolução Histórica das Vias"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAbout}
              className="p-2 rounded bg-[#1a1a1c] text-[#dcdcdc] border border-white/10 hover:bg-white/10 transition-colors"
              title="Metodologia e Propósito"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de Busca Avançada */}
        <div className="w-full lg:w-auto flex-1 flex justify-center max-w-xl">
          <AdvancedSearchBar
            ruas={ruas}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            selectedEixo={selectedEixo}
            onSelectEixo={onSelectEixo}
            decadaAtiva={decadaAtiva}
            onSelectDecada={onSelectDecada}
            tipoBusca={tipoBusca}
            onSelectTipoBusca={onSelectTipoBusca}
            onSelectRua={onSelectRua}
            totalResultados={totalResultados}
            currentCity={currentCity}
          />
        </div>

        {/* Botões de Ação Desktop */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {onOpenAISettings && (
            <button
              onClick={onOpenAISettings}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#58b38a]/10 hover:bg-[#58b38a]/20 text-[#58b38a] border border-[#58b38a]/30 text-xs font-medium transition-all shadow-sm cursor-pointer"
              title="Configurações de IA & Buscadores Secundários"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>IA & Buscadores</span>
            </button>
          )}
          <button
            onClick={onOpenEvolucao}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 font-medium text-xs transition-all shadow-sm group"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#c5a059] group-hover:scale-110 transition-transform" />
            <span>Evolução Histórica</span>
          </button>
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#1a1a1c] hover:bg-white/10 text-[#dcdcdc] border border-white/10 text-xs font-medium transition-all"
          >
            <Info className="w-3.5 h-3.5 text-[#dcdcdc]/60" />
            <span>Metodologia</span>
          </button>
        </div>

      </div>

      {/* Filtros de Eixos Culturais & Alerta de Década */}
      <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-3 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold whitespace-nowrap mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#c5a059]" /> Eixos:
          </span>
          {eixos.map((eixo) => {
            const info = EIXOS_INFO[eixo];
            const isSelected = selectedEixo === eixo;
            const count = contagensEixos[eixo] || 0;

            return (
              <button
                key={eixo}
                onClick={() => onSelectEixo(eixo)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? `${info.corBgClass} ${info.corTextClass} ${info.corBorderClass} ring-1 ring-current shadow-sm font-bold`
                    : 'bg-[#1a1a1c] text-[#dcdcdc]/60 border-white/10 hover:border-white/20 hover:text-[#f5f2ed]'
                }`}
              >
                <span>{info.emoji}</span>
                <span>{info.label.split('&')[0].trim()}</span>
                <span className={`ml-0.5 px-1.5 py-0.2 rounded font-mono text-[9px] ${
                  isSelected ? 'bg-white/10 text-current font-bold' : 'bg-[#0a0a0b] text-[#dcdcdc]/50'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Alerta de Década Selecionada */}
        {decadaAtiva && (
          <div className="flex items-center gap-2 bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#f5f2ed] px-3 py-1 rounded text-xs whitespace-nowrap animate-pulse font-mono shrink-0">
            <span>📅 ERA: <strong className="text-[#c5a059]">{decadaAtiva}</strong></span>
            <button
              onClick={onClearDecada}
              className="text-[#c5a059] hover:text-white bg-[#c5a059]/20 rounded p-0.5"
              title="Limpar filtro de década"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
