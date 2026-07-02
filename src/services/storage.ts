import { LembrancaFamilia, CustomLLMConfig } from '../types';

const STORAGE_KEY = 'pedreira_mapa_lembrancas_v1';

const LEMBRANCAS_INiciais: LembrancaFamilia[] = [
  {
    id: 'lembranca_1',
    ruaNome: 'Rua Soldado Hilário Zanesco',
    autor: 'Antônio Zanesco Neto',
    relacao: 'Parente da família e pesquisador',
    periodo: 'Anos 1940 (Segunda Guerra)',
    relato: 'Meu avô conheceu o jovem Hilário em Amparo antes de embarcarem para a campanha da Itália com a FEB. Ele contava que Hilário era um rapaz de sorriso fácil, muito corajoso e sempre disposto a ajudar os companheiros do Regimento Sampaio. Guardamos uma foto antiga em sépia com carimbo da Força Expedicionária como um verdadeiro relicário de família.',
    dataEnvio: '2026-05-14T10:30:00Z',
    curtidas: 24
  },
  {
    id: 'lembranca_2',
    ruaNome: 'Avenida Brigadeiro Faria Lima',
    autor: 'Dona Maria Tereza Steula',
    relacao: 'Moradora há mais de 50 anos',
    periodo: 'Anos 1970 (Urbanização)',
    relato: 'Lembro claramente quando esta avenida era apenas uma estrada de chão batido que levava aos chácaras da Vila Monte Alegre. Quando a prefeitura abriu e asfaltou nos anos 1970, fizemos uma grande festa de rua com direito a desfile da corporação musical e mesas de doces caseiros na calçada!',
    dataEnvio: '2026-06-01T15:20:00Z',
    curtidas: 18
  },
  {
    id: 'lembranca_3',
    ruaNome: 'Avenida Doutor Silvio de Aguiar Maia',
    autor: 'Luiz Carlos Peron',
    relacao: 'Nascido em Pedreira e filho de ceramista',
    periodo: 'Anos 1960',
    relato: 'O Dr. Silvio era um anjo na terra. Atendia de madrugada no hospital sem perguntar se a família tinha dinheiro para pagar. Ele fez o parto de quatro dos meus irmãos em noites de chuva forte, e meu pai sempre levava peças de porcelana pintada à mão para presentear o consultório dele.',
    dataEnvio: '2026-06-12T09:15:00Z',
    curtidas: 31
  },
  {
    id: 'lembranca_4',
    ruaNome: 'Rua Maestro Carlos Gomes',
    autor: 'Helena Volpim',
    relacao: 'Neta de músicos da Lira Pedreirense',
    periodo: 'Anos 1980',
    relato: 'Nos domingos de tarde, as famílias se sentavam nas varandas desta rua com violões, cavaquinhos e acordeons para tocar valsas e dobrados em homenagem à tradição musical do Maestro Carlos Gomes. Era um tempo mágico em que as crianças brincavam na rua até o anoitecer.',
    dataEnvio: '2026-06-20T18:45:00Z',
    curtidas: 15
  },
  {
    id: 'lembranca_5',
    ruaNome: 'Rua Armando Peron',
    autor: 'Giovanni Marchi',
    relacao: 'Ex-pintor de porcelana',
    periodo: 'Anos 1970 e 1980',
    relato: 'Trabalhei nas indústrias cerâmicas fundadas por Armando Peron. O barulho dos fornos de queima e o perfume da tinta esmalte faziam parte do dia a dia desta rua. No fim do expediente, centenas de operários saíam de bicicleta ao mesmo tempo, enchendo a rua de vida e orgulho pelo nosso artesanato.',
    dataEnvio: '2026-06-25T14:10:00Z',
    curtidas: 27
  },
  {
    id: 'lembranca_6',
    ruaNome: 'Ponte Queimada',
    autor: 'Prof. Cláudio Alvarenga',
    relacao: 'Historiador e professor local',
    periodo: '1932 (Revolução Constitucionalista)',
    relato: 'Os relatos que ouvi das minhas tias avós sobre o inverno de 1932 são impressionantes. O céu do vale do Jaguari ficou cinza com a fumaça da velha ponte de madeira em chamas. Os soldados paulistas se entrincheiraram nas margens para defender o avanço para as terras de Amparo e Campinas.',
    dataEnvio: '2026-06-28T11:00:00Z',
    curtidas: 42
  },
  {
    id: 'lembranca_7',
    ruaNome: 'Rua Direita',
    autor: 'Antônio de Pádua (Ouro Preto)',
    relacao: 'Guia de turismo e neto de artesão',
    periodo: 'Anos 1960',
    relato: 'Meu avô esculpia anjos em pedra-sabão bem em frente ao casarão do Conde de Bobadela. O barulho dos martelos ecoava nas ladeiras da Rua Direita desde o amanhecer até o sino da Igreja do Pilar bater o ângelus das seis da tarde.',
    dataEnvio: '2026-06-29T09:30:00Z',
    curtidas: 35
  },
  {
    id: 'lembranca_8',
    ruaNome: 'Rua do Comércio',
    autor: 'Maria da Paz Caiçara (Paraty)',
    relacao: 'Tradição caiçara do Centro Histórico',
    periodo: 'Anos 1950',
    relato: 'Antes da abertura da estrada Rio-Santos, a Rua do Comércio recebia os saveiros carregados de café e farinha de mandioca na maré alta. Nas noites de lua cheia, as crianças brincavam descalças nas pedras pé de moleque enquanto as escunas atracavam no cais.',
    dataEnvio: '2026-06-30T14:15:00Z',
    curtidas: 28
  },
  {
    id: 'lembranca_9',
    ruaNome: 'Ladeira do Pelourinho',
    autor: 'Mestre Dinho do Pelô (Salvador)',
    relacao: 'Percussionista do Centro Histórico',
    periodo: 'Anos 1970 e 1980',
    relato: 'As pedras desta ladeira vibram com os tambores da resistência. Vi o nascimento do bloco afro no casarão nº 68, quando ensaiávamos debaixo de chuva para celebrar nosso orgulho e ancestralidade. O Pelourinho é o coração que nunca para de bater em Salvador.',
    dataEnvio: '2026-07-01T16:40:00Z',
    curtidas: 49
  }
];

/**
 * Obtém todas as lembranças do localStorage, mesclando com as iniciais se for primeira vez
 */
export function getLembrancas(): LembrancaFamilia[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(LEMBRANCAS_INiciais));
      return LEMBRANCAS_INiciais;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Erro ao ler lembranças do localStorage', e);
    return LEMBRANCAS_INiciais;
  }
}

/**
 * Obtém lembranças específicas para uma rua
 */
export function getLembrancasPorRua(nomeRua: string): LembrancaFamilia[] {
  const todas = getLembrancas();
  return todas
    .filter(l => l.ruaNome.toLowerCase() === nomeRua.toLowerCase())
    .sort((a, b) => new Date(b.dataEnvio).getTime() - new Date(a.dataEnvio).getTime());
}

/**
 * Salva uma nova lembrança oral no localStorage
 */
export function adicionarLembranca(nova: Omit<LembrancaFamilia, 'id' | 'dataEnvio' | 'curtidas'>): LembrancaFamilia {
  const todas = getLembrancas();
  const lembrancaCompleta: LembrancaFamilia = {
    ...nova,
    id: `lembranca_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    dataEnvio: new Date().toISOString(),
    curtidas: 1
  };
  
  todas.unshift(lembrancaCompleta);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todas));
  } catch (e) {
    console.error('Erro ao salvar no localStorage', e);
  }
  return lembrancaCompleta;
}

/**
 * Incrementa curtidas de um relato
 */
export function curtirLembranca(id: string): LembrancaFamilia[] {
  const todas = getLembrancas();
  const index = todas.findIndex(l => l.id === id);
  if (index !== -1) {
    todas[index].curtidas += 1;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todas));
    } catch (e) {
      console.error('Erro ao curtir no localStorage', e);
    }
  }
  return todas;
}

const STORAGE_KEY_LLM = 'pedreira_custom_llm_config_v1';

export const DEFAULT_LLM_CONFIG: CustomLLMConfig = {
  enabled: false,
  provider: 'gemini-default',
  endpointUrl: '',
  apiKey: '',
  modelName: 'gemini-3.5-flash',
  temperature: 0.7,
  useSecondarySearchAsContext: true,
};

export function getCustomLLMConfig(): CustomLLMConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEY_LLM);
    if (data) {
      return { ...DEFAULT_LLM_CONFIG, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Erro ao ler configuração da LLM no localStorage', e);
  }
  return DEFAULT_LLM_CONFIG;
}

export function saveCustomLLMConfig(config: CustomLLMConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_LLM, JSON.stringify(config));
  } catch (e) {
    console.error('Erro ao salvar configuração da LLM no localStorage', e);
  }
}
