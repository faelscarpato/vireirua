import { CityId, CityConfig, RuaComMeta } from '../types';
import { CITIES_CONFIG } from './citiesConfig';
import { RUAS_DATA as RUAS_PEDREIRA } from './ruasPedreira';
import { RUAS_OURO_PRETO_DATA } from './ruasOuroPreto';
import { RUAS_PARATY_DATA } from './ruasParaty';
import { RUAS_SALVADOR_DATA } from './ruasSalvador';
import { categorizarEixo, EIXOS_INFO } from '../utils/eixosCulturais';
import { calcularGeoHash, extrairAnoDecada } from '../utils/geoHash';

const CITIES_DATA_MAP = {
  pedreira: RUAS_PEDREIRA,
  ouro_preto: RUAS_OURO_PRETO_DATA,
  paraty: RUAS_PARATY_DATA,
  salvador: RUAS_SALVADOR_DATA
};

/**
 * Retorna a lista de todas as cidades disponíveis no aplicativo
 */
export function getCitiesList(): CityConfig[] {
  return Object.values(CITIES_CONFIG);
}

/**
 * Retorna a configuração de uma cidade específica
 */
export function getCityConfig(cityId: CityId): CityConfig {
  return CITIES_CONFIG[cityId] || CITIES_CONFIG.pedreira;
}

/**
 * Retorna a lista completa de ruas para a cidade selecionada, enriquecida
 * com metadados computados (coordenadas determinísticas sobre os bairros da cidade,
 * categorização de eixo e década de batismo).
 */
export function getRuasByCity(cityId: CityId = 'pedreira'): RuaComMeta[] {
  const cityConfig = getCityConfig(cityId);
  const rawData = CITIES_DATA_MAP[cityId] || RUAS_PEDREIRA;

  return Object.entries(rawData).map(([nome, data]) => {
    const eixo = categorizarEixo(nome, data.resumo);
    const geo = calcularGeoHash(nome, cityConfig.bairros);
    const { ano, decada } = extrairAnoDecada(data.lei, nome);
    const infoEixo = EIXOS_INFO[eixo];

    return {
      id: `${cityId}_${nome.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      nome,
      ...data,
      eixo,
      decada,
      ano,
      lat: geo.lat,
      lng: geo.lng,
      bairroEstetico: geo.bairroEstetico,
      iconeEmoji: infoEixo.emoji,
      corEixo: infoEixo.corHex,
      cidadeId: cityId
    };
  });
}
