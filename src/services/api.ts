import { GroundingResponse, WikipediaResult, DuckDuckGoResult, CustomLLMConfig } from '../types';

/**
 * Consulta a API no servidor para enriquecimento histórico com Google Search Grounding (@[Use Google Search data])
 */
export async function fetchSearchGrounding(
  ruaNome: string,
  homenageado: string,
  resumoAtual: string
): Promise<GroundingResponse> {
  const response = await fetch('/api/gemini/search-grounding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ruaNome, homenageado, resumoAtual }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status}: Falha ao buscar contexto histórico.`);
  }

  return response.json();
}

/**
 * Consulta a API no servidor para enriquecimento geográfico com Google Maps Grounding (@[Use Google Maps data])
 */
export async function fetchMapsGrounding(
  ruaNome: string,
  lat: number,
  lng: number,
  bairro: string
): Promise<GroundingResponse> {
  const response = await fetch('/api/gemini/maps-grounding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ruaNome, lat, lng, bairro }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status}: Falha ao buscar locais próximos.`);
  }

  return response.json();
}

/**
 * Consulta a API no servidor para buscar resumo e link na Wikipédia (Buscador Secundário)
 */
export async function fetchWikipediaSearch(query: string): Promise<WikipediaResult> {
  const response = await fetch('/api/secondary-search/wikipedia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status}: Verbete não encontrado na Wikipédia.`);
  }

  return response.json();
}

/**
 * Consulta a API no servidor para resumos instantâneos e tópicos no DuckDuckGo (Buscador Secundário)
 */
export async function fetchDuckDuckGoSearch(query: string): Promise<DuckDuckGoResult> {
  const response = await fetch('/api/secondary-search/duckduckgo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status}: Falha na busca DuckDuckGo.`);
  }

  return response.json();
}

/**
 * Envia prompt para LLM personalizada configurada pelo usuário (ou Gemini padrão)
 */
export async function fetchCustomLLMChat(
  config: CustomLLMConfig,
  prompt: string,
  systemInstruction?: string
): Promise<{ text: string }> {
  const response = await fetch('/api/custom-llm/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpointUrl: config.enabled ? config.endpointUrl : '',
      apiKey: config.enabled ? config.apiKey : '',
      modelName: config.enabled ? config.modelName : 'gemini-2.5-flash',
      temperature: config.temperature,
      prompt,
      systemInstruction,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP ${response.status}: Falha ao gerar resposta com LLM.`);
  }

  return response.json();
}
