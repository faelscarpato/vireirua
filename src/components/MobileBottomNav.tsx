import React from 'react';
import { Map, Layers, TrendingUp, Info } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'mapa' | 'catalogo' | 'evolucao' | 'sobre';
  onSelectTab: (tab: 'mapa' | 'catalogo' | 'evolucao' | 'sobre') => void;
  totalRuas: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  totalRuas,
}) => {
  return (
    <nav aria-label="Navegação Principal Mobile" className="fixed bottom-0 left-0 right-0 h-16 bg-[#0f0f10]/95 backdrop-blur-xl border-t border-white/10 z-[3500] flex md:hidden items-center justify-around px-2 shadow-2xl">
      {/* Tab 1: Mapa */}
      <button
        onClick={() => onSelectTab('mapa')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] px-2 py-1 rounded-xl transition-all relative ${
          activeTab === 'mapa'
            ? 'text-[#c5a059] font-bold'
            : 'text-[#dcdcdc]/60 hover:text-[#f5f2ed]'
        }`}
      >
        <Map className={`w-5 h-5 transition-transform ${activeTab === 'mapa' ? 'scale-110' : ''}`} />
        <span className="text-[11px] mt-0.5 tracking-tight font-serif">Mapa</span>
        {activeTab === 'mapa' && (
          <span className="absolute bottom-0 w-8 h-0.5 bg-[#c5a059] rounded-full animate-fadeIn" />
        )}
      </button>

      {/* Tab 2: Catálogo */}
      <button
        onClick={() => onSelectTab('catalogo')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] px-2 py-1 rounded-xl transition-all relative ${
          activeTab === 'catalogo'
            ? 'text-[#c5a059] font-bold'
            : 'text-[#dcdcdc]/60 hover:text-[#f5f2ed]'
        }`}
      >
        <div className="relative">
          <Layers className={`w-5 h-5 transition-transform ${activeTab === 'catalogo' ? 'scale-110' : ''}`} />
          <span className="absolute -top-1.5 -right-3 px-1 py-0.2 min-w-[16px] text-center bg-[#c5a059] text-black font-mono text-[9px] font-extrabold rounded-full shadow">
            {totalRuas}
          </span>
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight font-serif">Catálogo</span>
        {activeTab === 'catalogo' && (
          <span className="absolute bottom-0 w-8 h-0.5 bg-[#c5a059] rounded-full animate-fadeIn" />
        )}
      </button>

      {/* Tab 3: Evolução */}
      <button
        onClick={() => onSelectTab('evolucao')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] px-2 py-1 rounded-xl transition-all relative ${
          activeTab === 'evolucao'
            ? 'text-[#c5a059] font-bold'
            : 'text-[#dcdcdc]/60 hover:text-[#f5f2ed]'
        }`}
      >
        <TrendingUp className={`w-5 h-5 transition-transform ${activeTab === 'evolucao' ? 'scale-110' : ''}`} />
        <span className="text-[11px] mt-0.5 tracking-tight font-serif">Evolução</span>
        {activeTab === 'evolucao' && (
          <span className="absolute bottom-0 w-8 h-0.5 bg-[#c5a059] rounded-full animate-fadeIn" />
        )}
      </button>

      {/* Tab 4: Sobre */}
      <button
        onClick={() => onSelectTab('sobre')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] px-2 py-1 rounded-xl transition-all relative ${
          activeTab === 'sobre'
            ? 'text-[#c5a059] font-bold'
            : 'text-[#dcdcdc]/60 hover:text-[#f5f2ed]'
        }`}
      >
        <Info className={`w-5 h-5 transition-transform ${activeTab === 'sobre' ? 'scale-110' : ''}`} />
        <span className="text-[11px] mt-0.5 tracking-tight font-serif">Sobre</span>
        {activeTab === 'sobre' && (
          <span className="absolute bottom-0 w-8 h-0.5 bg-[#c5a059] rounded-full animate-fadeIn" />
        )}
      </button>
    </nav>
  );
};
