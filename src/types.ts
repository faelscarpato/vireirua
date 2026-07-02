export type EixoCultural = 
  | 'all' 
  | 'militar' 
  | 'pioneiros' 
  | 'ciencia_artes' 
  | 'religiao' 
  | 'natureza_outros';

export type CityId = 'pedreira' | 'ouro_preto' | 'paraty' | 'salvador';

export interface BairroEstetico {
  nome: string;
  lat: number;
  lng: number;
  raio: number;
}

export interface CityConfig {
  id: CityId;
  nome: string;
  estado: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  center: [number, number];
  zoom: number;
  bairros: BairroEstetico[];
  fonteLegislativa: string;
  linkLegislativo: string;
  dbHash: string;
}

export interface SearchFilters {
  query: string;
  eixo: EixoCultural;
  decada: string | null;
  tipoBusca: 'tudo' | 'nome' | 'homenageado' | 'lei';
}

export interface RuaData {
  homenageado: string;
  resumo: string;
  lei: string;
  fonte: string;
  link: string;
}

export interface RuaComMeta extends RuaData {
  id: string;
  nome: string;
  eixo: EixoCultural;
  decada: string;
  ano: number;
  lat: number;
  lng: number;
  bairroEstetico: string;
  iconeEmoji: string;
  corEixo: string;
  cidadeId?: CityId;
}

export interface LembrancaFamilia {
  id: string;
  ruaNome: string;
  autor: string;
  relacao: string;
  relato: string;
  periodo: string;
  dataEnvio: string;
  curtidas: number;
}

export interface GroundingCitation {
  title: string;
  uri: string;
}

export interface GroundingResponse {
  text: string;
  citations: GroundingCitation[];
}

export interface EstatisticaDecada {
  decada: string;
  total: number;
  militar: number;
  pioneiros: number;
  ciencia_artes: number;
  religiao: number;
  natureza_outros: number;
}

export interface WikipediaResult {
  title: string;
  extract: string;
  thumbnail?: string | null;
  url: string;
}

export interface DuckDuckGoResult {
  heading: string;
  abstract: string;
  abstractSource: string;
  abstractUrl: string;
  relatedTopics: { Text: string; FirstURL: string }[];
}

export interface CustomLLMConfig {
  enabled: boolean;
  provider: 'gemini-default' | 'openrouter' | 'groq' | 'ollama' | 'custom';
  endpointUrl: string;
  apiKey: string;
  modelName: string;
  temperature: number;
  useSecondarySearchAsContext: boolean;
}

