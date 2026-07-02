import React from 'react';
import { RuaComMeta, CityConfig } from '../types';
import { EIXOS_INFO } from '../utils/eixosCulturais';
import { MapPin, BookOpen, ChevronRight, Calendar, Layers, Filter, X } from 'lucide-react';

interface SidebarListProps {
  ruas: RuaComMeta[];
  selectedRua: RuaComMeta | null;
  onSelectRua: (rua: RuaComMeta) => void;
  isOpen: boolean;
  onToggle: () => void;
  currentCity?: CityConfig;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export const SidebarList: React.FC<SidebarListProps> = ({
  ruas,
  selectedRua,
  onSelectRua,
  isOpen,
  onToggle,
  currentCity,
  hasActiveFilters,
  onClearFilters
}) => {
  const cityName = currentCity ? currentCity.nome : 'Pedreira';
  const cityFonte = currentCity ? currentCity.fonteLegislativa : 'Câmara Municipal de Pedreira / IBGE';
  return (
    <>
      {/* Botão para toggle em dispositivos móveis ou quando o painel estiver retraído */}
      <button
        onClick={onToggle}
        className={`absolute top-20 left-4 z-30 hidden md:flex items-center gap-2 px-3.5 py-2 rounded bg-[#0f0f10]/95 border border-white/10 text-[#f5f2ed] shadow-xl backdrop-blur-md text-xs font-semibold transition-all hover:bg-[#1a1a1c] min-h-[44px] ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <Layers className="w-4 h-4 text-[#c5a059]" />
        <span>Catálogo de Vias ({ruas.length})</span>
      </button>

      {/* Drawer / Sidebar */}
      <aside
        className={`absolute top-0 left-0 bottom-16 md:bottom-0 z-30 w-full sm:w-80 md:w-96 bg-[#0f0f10] backdrop-blur-xl border-r border-white/10 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabeçalho da Sidebar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0a0a0b]/60">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#c5a059]" />
            <div>
              <h2 className="font-serif font-bold text-base text-[#f5f2ed] tracking-tight">
                Catálogo de Vias • {cityName}
              </h2>
              <p className="text-[11px] text-[#dcdcdc]/60 font-mono">
                Exibindo <span className="text-[#c5a059] font-bold">{ruas.length}</span> vias cadastradas
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded bg-[#1a1a1c] text-[#dcdcdc]/60 hover:text-[#f5f2ed] hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Recolher Lista"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Banner de Filtros Ativos na Lista */}
        {hasActiveFilters && (
          <div className="mx-3 mt-3 p-2.5 rounded bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs text-[#f5f2ed] font-serif">
              <Filter className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Filtros ativos ({ruas.length} vias compatíveis)</span>
            </div>
            {onClearFilters && (
              <button
                onClick={onClearFilters}
                className="px-2 py-1 rounded bg-[#c5a059] hover:bg-[#d4b06a] text-black font-bold text-[10px] uppercase transition-all flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Limpar
              </button>
            )}
          </div>
        )}

        {/* Lista de Vias com Scroll */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
          {ruas.length === 0 ? (
            <div className="p-8 text-center bg-[#0a0a0b]/60 rounded border border-white/10 my-4">
              <MapPin className="w-10 h-10 text-[#dcdcdc]/30 mx-auto mb-3" />
              <p className="text-sm font-serif font-bold text-[#f5f2ed]">Nenhuma via encontrada em {cityName}</p>
              <p className="text-xs text-[#dcdcdc]/60 mt-1">
                Tente buscar por outro termo ou limpe os filtros no topo do catálogo.
              </p>
              {onClearFilters && (
                <button
                  onClick={onClearFilters}
                  className="mt-3 px-3 py-1.5 rounded bg-[#c5a059] text-black font-bold text-xs"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          ) : (
            ruas.map((rua) => {
              const infoEixo = EIXOS_INFO[rua.eixo];
              const isSelected = selectedRua?.id === rua.id;

              return (
                <div
                  key={rua.id}
                  onClick={() => onSelectRua(rua)}
                  className={`p-3.5 rounded border transition-all cursor-pointer group relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#1a1a1c] border-[#c5a059]/80 shadow-lg shadow-[#c5a059]/10 ring-1 ring-[#c5a059]/30'
                      : 'bg-[#1a1a1c]/60 border-white/5 hover:border-white/15 hover:bg-[#1a1a1c]'
                  }`}
                >
                  {/* Barra lateral colorida do eixo */}
                  <div
                    className="absolute top-0 bottom-0 left-0 w-1.5 transition-opacity"
                    style={{ backgroundColor: infoEixo.corHex }}
                  />

                  <div className="pl-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-serif font-bold text-sm tracking-tight transition-colors ${
                        isSelected ? 'text-[#c5a059]' : 'text-[#f5f2ed] group-hover:text-[#c5a059]'
                      }`}>
                        {rua.nome}
                      </h3>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-[#c5a059] translate-x-1' : 'text-[#dcdcdc]/30 group-hover:text-[#dcdcdc]'
                      }`} />
                    </div>

                    <p className="text-xs text-[#dcdcdc] font-medium mt-1 line-clamp-1">
                      👤 {rua.homenageado}
                    </p>

                    <p className="text-[11px] text-[#dcdcdc]/70 mt-1 line-clamp-2 leading-relaxed">
                      {rua.resumo}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-1.5 text-[10px]">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium border ${infoEixo.corBgClass} ${infoEixo.corTextClass} ${infoEixo.corBorderClass}`}>
                        <span>{infoEixo.emoji}</span>
                        <span>{infoEixo.label.split('&')[0].trim()}</span>
                      </span>

                      <div className="flex items-center gap-2 text-[#dcdcdc]/50 font-mono">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#c5a059]" />
                          <span>{rua.decada}</span>
                        </span>
                        <span>•</span>
                        <span>📍 {rua.bairroEstetico.split('&')[0].trim()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé do Painel */}
        <div className="p-3 bg-[#0a0a0b]/80 border-t border-white/10 text-center text-[11px] text-[#dcdcdc]/50 font-mono">
          📍 Base de Dados: {cityFonte}
        </div>
      </aside>
    </>
  );
};
