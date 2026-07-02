import React from 'react';
import { X, MapPin, Sparkles, BookOpen, Compass, ShieldCheck, Heart } from 'lucide-react';
import { CityConfig } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity?: CityConfig;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, currentCity }) => {
  const cityName = currentCity ? currentCity.nome : 'Pedreira';
  const cityState = currentCity ? currentCity.estado : 'SP';
  const citySub = currentCity ? currentCity.subtitulo : 'Capital da Porcelana';
  const cityFonte = currentCity ? currentCity.fonteLegislativa : 'Câmara Municipal de Pedreira';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#0a0a0b]/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#0f0f10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="p-6 bg-[#1a1a1c] border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] shadow-lg">
              <MapPin className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] bg-[#c5a059]/15 text-[#c5a059] font-mono px-2 py-0.5 rounded border border-[#c5a059]/30 uppercase font-bold">
                Metodologia & Propósito
              </span>
              <h2 className="font-serif font-bold text-xl text-[#f5f2ed] mt-1 tracking-tight">
                Ruas com História | {cityName}/{cityState}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded bg-[#0a0a0b] hover:bg-white/10 text-[#dcdcdc]/60 hover:text-[#f5f2ed] border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#dcdcdc] text-xs md:text-sm leading-relaxed no-scrollbar font-serif">
          
          <div className="bg-[#1a1a1c] border border-[#c5a059]/40 rounded p-5 space-y-2">
            <h3 className="font-serif font-bold text-base text-[#c5a059] flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> O Fato: Mapa Temático & Cultural
            </h3>
            <p>
              Este é um <strong className="text-white">mapa temático e cultural</strong>, não de navegação trânsito ou GPS viário. O objetivo é transformar a malha urbana de {cityName} em um museu a céu aberto, permitindo que cidadãos, estudantes e visitantes descubram quem são as pessoas eternizadas nas placas de rua.
            </p>
          </div>

          <div className="bg-[#0a0a0b]/60 border border-white/10 rounded p-5 space-y-2">
            <h3 className="font-serif font-bold text-base text-[#c5a059] flex items-center gap-2">
              <Compass className="w-4 h-4" /> A Hipótese & Dor Principal
            </h3>
            <p>
              A dor principal que motivou este projeto é a <strong className="text-white">falta de acesso fácil à memória cívica</strong>. Hoje, essa rica informação está dispersa em leis municipais antigas, diários oficiais em papel, acervos cartoriais ou apenas na lembrança de moradores idosos. Ao consolidar tudo em um Webapp PWA interativo, conectamos as gerações à identidade de {cityName}.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-[#f5f2ed] flex items-center gap-2 border-b border-white/10 pb-2">
              <Sparkles className="w-4 h-4 text-[#c5a059]" /> Os 4 Pilares Tecnológicos do Projeto
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0b]/60 p-4 rounded border border-white/10 space-y-1.5">
                <span className="font-bold font-serif text-[#c5a059] flex items-center gap-1.5 text-xs">
                  <span>📍</span> 1. Geolocalização Determinística
                </span>
                <p className="text-xs text-[#dcdcdc]/70">
                  Como dezenas de decretos não contêm coordenadas de GPS, construímos um algoritmo de dispersão matemática baseada em hash que posiciona cada via esteticamente em seu respectivo bairro de forma 100% consistente.
                </p>
              </div>

              <div className="bg-[#0a0a0b]/60 p-4 rounded border border-white/10 space-y-1.5">
                <span className="font-bold font-serif text-[#c5a059] flex items-center gap-1.5 text-xs">
                  <span>🏷️</span> 2. Auto-Categorização por Eixos
                </span>
                <p className="text-xs text-[#dcdcdc]/70">
                  Analisando semanticamente termos como <em className="text-white">Cabo, Soldado, Família Peron, Doutor ou Maestro</em>, o sistema classifica dinamicamente os eixos culturais (militar, pioneiros, ciência/artes, fé e natureza).
                </p>
              </div>

              <div className="bg-[#0a0a0b]/60 p-4 rounded border border-white/10 space-y-1.5">
                <span className="font-bold font-serif text-[#c5a059] flex items-center gap-1.5 text-xs">
                  <span>📨</span> 3. Mural Oral no LocalStorage
                </span>
                <p className="text-xs text-[#dcdcdc]/70">
                  Qualquer cidadão pode enviar uma "Lembrança de Família" para uma rua. O relato é salvo no navegador em tempo real com curtidas e comemoração, criando um arquivo afetivo comunitário.
                </p>
              </div>

              <div className="bg-[#0a0a0b]/60 p-4 rounded border border-white/10 space-y-1.5">
                <span className="font-bold font-serif text-[#c5a059] flex items-center gap-1.5 text-xs">
                  <span>🤖</span> 4. AI Grounding Google Search/Maps
                </span>
                <p className="text-xs text-[#dcdcdc]/70">
                  Integrado com o modelo Gemini 3.5 Flash no servidor, o usuário pode pesquisar biografias na web ou descobrir escolas e comércios no entorno de qualquer via com Google Maps AI.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded bg-[#1a1a1c]/60 border border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#c5a059] shrink-0" />
            <div className="text-xs text-[#dcdcdc]">
              <strong className="text-white">Desenvolvido com carinho para {cityName}/{cityState} ({citySub}).</strong> Todo o código segue boas práticas PWA responsivas, design com contraste acessível e arquitetura full-stack segura.
            </div>
          </div>

        </div>

        {/* Rodapé */}
        <div className="p-4 bg-[#0a0a0b] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-[#dcdcdc]/60 font-mono">
            🏛️ Fonte legislativa: {cityFonte}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-[#c5a059] hover:bg-[#d4b06a] text-black font-bold text-xs shadow-md shadow-[#c5a059]/20 transition-all"
          >
            Entendido, explorar mapa!
          </button>
        </div>
      </div>
    </div>
  );
};
