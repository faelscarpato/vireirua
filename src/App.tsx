import React, { useState, useMemo } from 'react';
import { EixoCultural, RuaComMeta, CityId } from './types';
import { getCityConfig, getRuasByCity } from './data/cidadesRepository';
import { Navbar } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { SidebarList } from './components/SidebarList';
import { StreetDetailModal } from './components/StreetDetailModal';
import { EvolucaoBatismosModal } from './components/EvolucaoBatismosModal';
import { AboutModal } from './components/AboutModal';
import { AISettingsModal } from './components/AISettingsModal';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  // 1. Estados de seleção da Cidade
  const [selectedCity, setSelectedCity] = useState<CityId>('pedreira');
  const currentCityConfig = useMemo(() => getCityConfig(selectedCity), [selectedCity]);
  
  // 2. Carregar lista enriquecida de ruas da cidade selecionada
  const todasRuas = useMemo(() => getRuasByCity(selectedCity), [selectedCity]);

  // 3. Estados da aplicação (filtros, buscas e modais)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEixo, setSelectedEixo] = useState<EixoCultural>('all');
  const [decadaAtiva, setDecadaAtiva] = useState<string | null>(null);
  const [tipoBusca, setTipoBusca] = useState<'tudo' | 'nome' | 'homenageado' | 'lei'>('tudo');
  const [selectedRua, setSelectedRua] = useState<RuaComMeta | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEvolucaoOpen, setIsEvolucaoOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

  // Handler para trocar de cidade e limpar filtros
  const handleSelectCity = (cityId: CityId) => {
    setSelectedCity(cityId);
    setSelectedRua(null);
    setSearchQuery('');
    setDecadaAtiva(null);
    setSelectedEixo('all');
    setTipoBusca('tudo');
  };

  const handleClearFilters = () => {
    setSelectedEixo('all');
    setDecadaAtiva(null);
    setTipoBusca('tudo');
    setSearchQuery('');
  };

  // 4. Filtrar ruas com base nas buscas, tipo de busca, era histórica e eixos
  const ruasFiltradas = useMemo(() => {
    return todasRuas.filter((rua) => {
      // Filtro de Eixo Cultural
      if (selectedEixo !== 'all' && rua.eixo !== selectedEixo) {
        return false;
      }

      // Filtro de Era / Década
      if (decadaAtiva && rua.decada !== decadaAtiva) {
        return false;
      }

      // Filtro de Busca Textual (Nome, Homenageado ou Lei dependendo de tipoBusca)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const nomeMatch = rua.nome.toLowerCase().includes(query);
        const homMatch = rua.homenageado.toLowerCase().includes(query);
        const leiMatch = rua.lei.toLowerCase().includes(query);
        const resMatch = rua.resumo.toLowerCase().includes(query);
        const decMatch = rua.decada.toLowerCase().includes(query) || rua.ano.toString().includes(query);

        if (tipoBusca === 'nome') return nomeMatch;
        if (tipoBusca === 'homenageado') return homMatch;
        if (tipoBusca === 'lei') return leiMatch;
        return nomeMatch || homMatch || resMatch || leiMatch || decMatch;
      }

      return true;
    });
  }, [todasRuas, selectedEixo, decadaAtiva, searchQuery, tipoBusca]);

  // 5. Calcular contagem de cada eixo na busca/década atual
  const contagensEixos = useMemo(() => {
    const contagem: Record<EixoCultural, number> = {
      all: 0,
      militar: 0,
      pioneiros: 0,
      ciencia_artes: 0,
      religiao: 0,
      natureza_outros: 0
    };

    todasRuas.forEach((rua) => {
      if (decadaAtiva && rua.decada !== decadaAtiva) return;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const hit = rua.nome.toLowerCase().includes(query) ||
                    rua.homenageado.toLowerCase().includes(query) ||
                    rua.resumo.toLowerCase().includes(query) ||
                    rua.lei.toLowerCase().includes(query);
        if (!hit) return;
      }

      contagem.all += 1;
      if (rua.eixo !== 'all') {
        contagem[rua.eixo] += 1;
      }
    });

    return contagem;
  }, [todasRuas, decadaAtiva, searchQuery]);

  // Handler para selecionar uma rua no mapa ou na lista
  const handleSelectRua = (rua: RuaComMeta) => {
    setSelectedRua(rua);
    // Em telas mobile, retrair a lista para focar no mapa e no modal
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const hasActiveFilters = selectedEixo !== 'all' || decadaAtiva !== null || tipoBusca !== 'tudo' || searchQuery.trim() !== '';

  // Helper de aba ativa para o MobileBottomNav (Ergonomia Mobile-First)
  const mobileActiveTab = useMemo<'mapa' | 'catalogo' | 'evolucao' | 'sobre'>(() => {
    if (isAboutOpen) return 'sobre';
    if (isEvolucaoOpen) return 'evolucao';
    if (isSidebarOpen) return 'catalogo';
    return 'mapa';
  }, [isAboutOpen, isEvolucaoOpen, isSidebarOpen]);

  const handleSelectMobileTab = (tab: 'mapa' | 'catalogo' | 'evolucao' | 'sobre') => {
    if (tab === 'mapa') {
      setIsSidebarOpen(false);
      setIsEvolucaoOpen(false);
      setIsAboutOpen(false);
      setSelectedRua(null);
    } else if (tab === 'catalogo') {
      setIsSidebarOpen(true);
      setIsEvolucaoOpen(false);
      setIsAboutOpen(false);
    } else if (tab === 'evolucao') {
      setIsEvolucaoOpen(true);
      setIsAboutOpen(false);
    } else if (tab === 'sobre') {
      setIsAboutOpen(true);
      setIsEvolucaoOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0b] text-[#dcdcdc] font-sans">
      {/* Cabeçalho / Barra de Navegação e Busca Avançada */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedEixo={selectedEixo}
        onSelectEixo={setSelectedEixo}
        contagensEixos={contagensEixos}
        onOpenEvolucao={() => setIsEvolucaoOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenAISettings={() => setIsAISettingsOpen(true)}
        decadaAtiva={decadaAtiva}
        onClearDecada={() => setDecadaAtiva(null)}
        onSelectDecada={setDecadaAtiva}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        currentCity={currentCityConfig}
        ruas={todasRuas}
        tipoBusca={tipoBusca}
        onSelectTipoBusca={setTipoBusca}
        onSelectRua={handleSelectRua}
        totalResultados={ruasFiltradas.length}
      />

      {/* Corpo Principal (Mapa + Sidebar Drawer) */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Mapa Interativo Leaflet */}
        <InteractiveMap
          ruas={ruasFiltradas}
          selectedRua={selectedRua}
          onSelectRua={handleSelectRua}
          currentCity={currentCityConfig}
        />

        {/* Painel Lateral com Lista de Vias */}
        <SidebarList
          ruas={ruasFiltradas}
          selectedRua={selectedRua}
          onSelectRua={handleSelectRua}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          currentCity={currentCityConfig}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      </main>

      {/* Modal 1: Ficha Detalhada da Via + Mural Oral + IA Grounding */}
      <StreetDetailModal
        rua={selectedRua}
        onClose={() => setSelectedRua(null)}
        currentCity={currentCityConfig}
      />

      {/* Modal 2: Evolução Cronológica de Batismos (Análise de Dados) */}
      <EvolucaoBatismosModal
        ruas={todasRuas}
        isOpen={isEvolucaoOpen}
        onClose={() => setIsEvolucaoOpen(false)}
        decadaAtiva={decadaAtiva}
        onSelectDecada={(decada) => {
          setDecadaAtiva(decada);
          setIsEvolucaoOpen(false);
        }}
        currentCity={currentCityConfig}
      />

      {/* Modal 3: Metodologia e Hipótese */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        currentCity={currentCityConfig}
      />

      {/* Modal 4: Configurações de LLMs Personalizados & Buscadores Secundários */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar (Ergonomia mobile-first) */}
      <MobileBottomNav
        activeTab={mobileActiveTab}
        onSelectTab={handleSelectMobileTab}
        totalRuas={ruasFiltradas.length}
      />
    </div>
  );
}
