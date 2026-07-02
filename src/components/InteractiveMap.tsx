import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RuaComMeta, CityConfig } from '../types';
import { EIXOS_INFO } from '../utils/eixosCulturais';
import { Compass, RotateCcw } from 'lucide-react';

interface InteractiveMapProps {
  ruas: RuaComMeta[];
  selectedRua: RuaComMeta | null;
  onSelectRua: (rua: RuaComMeta) => void;
  currentCity?: CityConfig;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  ruas,
  selectedRua,
  onSelectRua,
  currentCity
}) => {
  const center: L.LatLngTuple = currentCity ? currentCity.center : [-22.7410, -46.8995];
  const zoom = currentCity ? currentCity.zoom : 14;
  const cityName = currentCity ? `${currentCity.nome}/${currentCity.estado}` : 'Pedreira/SP';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // 1. Inicializar o Mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centro da área urbana de Pedreira/SP
    const pedreiraCenter: L.LatLngTuple = [-22.7410, -46.8995];

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: true,
      maxBounds: [
        [-35.00, -75.00],
        [6.00, -33.00]
      ],
      minZoom: 10,
      maxZoom: 18
    });

    // Camada escura elegante (Stadia Alidade Smooth Dark ou CartoDB Dark)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Controle de zoom no topo à direita
    L.control.zoom({ position: 'topright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Atualizar Marcadores quando a lista de ruas mudar (filtros)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markersMapRef.current.clear();

    ruas.forEach((rua) => {
      const info = EIXOS_INFO[rua.eixo];
      const isSelected = selectedRua?.id === rua.id;

      // Criar ícone HTML customizado com o Emoji e cor do eixo
      const customIcon = L.divIcon({
        className: 'custom-pin-icon',
        html: `
          <div style="
            background-color: ${info.corHex}20;
            border: 2px solid ${info.corHex};
            color: #ffffff;
            width: ${isSelected ? '38px' : '30px'};
            height: ${isSelected ? '38px' : '30px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '18px' : '14px'};
            box-shadow: 0 0 ${isSelected ? '20px' : '8px'} ${info.corHex}80;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
          ">
            <span>${rua.iconeEmoji}</span>
            ${isSelected ? `
              <span style="
                position: absolute;
                bottom: -4px;
                width: 6px;
                height: 6px;
                background-color: #c5a059;
                border-radius: 50%;
                box-shadow: 0 0 8px #c5a059;
              "></span>
            ` : ''}
          </div>
        `,
        iconSize: [isSelected ? 38 : 30, isSelected ? 38 : 30],
        iconAnchor: [isSelected ? 19 : 15, isSelected ? 19 : 15]
      });

      const marker = L.marker([rua.lat, rua.lng], { icon: customIcon });

      marker.bindTooltip(`
        <div class="text-left font-sans">
          <div class="text-[#c5a059] font-serif font-bold text-xs">${rua.nome}</div>
          <div class="text-[#f5f2ed] text-[10px]">${rua.homenageado}</div>
          <div class="text-[#dcdcdc]/60 text-[9px] mt-0.5 font-mono">📍 ${rua.bairroEstetico} (${rua.decada})</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -14],
        opacity: 0.95
      });

      marker.on('click', () => {
        onSelectRua(rua);
      });

      layer.addLayer(marker);
      markersMapRef.current.set(rua.id, marker);
    });
  }, [ruas, selectedRua]);

  // 3. Centralizar quando a cidade mudar
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !currentCity) return;

    map.flyTo(currentCity.center, currentCity.zoom, {
      animate: true,
      duration: 1.5
    });
  }, [currentCity?.id]);

  // 4. Centralizar no pino selecionado
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedRua) return;

    map.flyTo([selectedRua.lat, selectedRua.lng], 16, {
      animate: true,
      duration: 1.2
    });

    const marker = markersMapRef.current.get(selectedRua.id);
    if (marker) {
      marker.openTooltip();
    }
  }, [selectedRua]);

  // Botão para resetar vista
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(center, zoom, { duration: 1.0 });
    }
  };

  return (
    <div className="relative w-full h-full bg-[#050506] overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Botões Flutuantes sobre o Mapa */}
      <div className="absolute bottom-20 md:bottom-6 right-4 md:right-6 z-20 flex flex-col gap-2">
        <button
          onClick={handleResetView}
          className="flex items-center gap-2 bg-[#0f0f10]/95 hover:bg-[#1a1a1c] text-[#f5f2ed] px-3.5 py-2 rounded border border-white/10 shadow-lg backdrop-blur-md text-xs font-semibold transition-all group min-h-[44px]"
          title={`Centralizar em ${cityName}`}
        >
          <RotateCcw className="w-4 h-4 text-[#c5a059] group-hover:-rotate-45 transition-transform" />
          <span>Centralizar {cityName}</span>
        </button>
      </div>

      {/* Legenda Flutuante Discreta no canto inferior esquerdo */}
      <div className="absolute bottom-20 md:bottom-6 left-4 md:left-6 z-20 hidden sm:flex items-center gap-2 bg-[#0f0f10]/95 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded shadow-lg text-[11px] text-[#dcdcdc]/70">
        <Compass className="w-4 h-4 text-[#c5a059] animate-spin-slow" />
        <span>Clique nos pinos para ler a história e o mural da via</span>
      </div>
    </div>
  );
};
