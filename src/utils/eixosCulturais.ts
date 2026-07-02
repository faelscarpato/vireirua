import { EixoCultural } from '../types';

export interface EixoInfo {
  id: EixoCultural;
  label: string;
  emoji: string;
  corHex: string;
  corBgClass: string;
  corTextClass: string;
  corBorderClass: string;
  descricao: string;
}

export const EIXOS_INFO: Record<EixoCultural, EixoInfo> = {
  all: {
    id: 'all',
    label: 'Todos os Eixos',
    emoji: '🗺️',
    corHex: '#c5a059',
    corBgClass: 'bg-[#c5a059]/10',
    corTextClass: 'text-[#c5a059]',
    corBorderClass: 'border-[#c5a059]/30',
    descricao: 'Todas as vias cadastradas no mapa temático de Pedreira.'
  },
  militar: {
    id: 'militar',
    label: 'Militar & Heróis de Guerra',
    emoji: '🛡️',
    corHex: '#d9777f',
    corBgClass: 'bg-[#d9777f]/10',
    corTextClass: 'text-[#d9777f]',
    corBorderClass: 'border-[#d9777f]/30',
    descricao: 'Homenagens a expedicionários da FEB, pracinhas, militares, comandos da Força Aérea e heróis que lutaram pelo país.'
  },
  pioneiros: {
    id: 'pioneiros',
    label: 'Famílias & Pioneiros Fundadores',
    emoji: '🌾',
    corHex: '#e0b354',
    corBgClass: 'bg-[#e0b354]/10',
    corTextClass: 'text-[#e0b354]',
    corBorderClass: 'border-[#e0b354]/30',
    descricao: 'Famílias tradicionais, imigrantes italianos e fundadores que ajudaram a desbravar, povoar e industrializar Pedreira.'
  },
  ciencia_artes: {
    id: 'ciencia_artes',
    label: 'Ciência, Artes & Educação',
    emoji: '🔬',
    corHex: '#a78bfa',
    corBgClass: 'bg-[#a78bfa]/10',
    corTextClass: 'text-[#a78bfa]',
    corBorderClass: 'border-[#a78bfa]/30',
    descricao: 'Doutores, professores, maestros, compositores e grandes mentes da ciência universal e da cultura pedreirense.'
  },
  religiao: {
    id: 'religiao',
    label: 'Religião & Tradição de Fé',
    emoji: '⛪',
    corHex: '#e882a8',
    corBgClass: 'bg-[#e882a8]/10',
    corTextClass: 'text-[#e882a8]',
    corBorderClass: 'border-[#e882a8]/30',
    descricao: 'Papas, bispos, padres marcantes, santos padroeiros e referências da tradição espiritual de Pedreira.'
  },
  natureza_outros: {
    id: 'natureza_outros',
    label: 'Natureza, Toponímia & Outros',
    emoji: '🌳',
    corHex: '#58b38a',
    corBgClass: 'bg-[#58b38a]/10',
    corTextClass: 'text-[#58b38a]',
    corBorderClass: 'border-[#58b38a]/30',
    descricao: 'Alamedas arborizadas, flores, acidentes geográficos, datas históricas, cidades vizinhas e instituições comunitárias.'
  }
};

/**
 * Categoriza semanticamente o nome e resumo da rua para um dos eixos culturais.
 */
export function categorizarEixo(nomeRua: string, resumo: string): EixoCultural {
  const texto = `${nomeRua} ${resumo}`.toLowerCase();

  // 1. Eixo Militar
  const termosMilitar = [
    'cabo ', 'soldado', 'brigadeiro', 'general', 'marechal', 'sargento', 
    'tenente', 'coronel', 'major', 'militar', 'exército', 'aeronáutica', 
    'feb ', 'força expedicionária', 'guerra mundial', 'piffer', 'zanesco', 
    'pracinha', 'bosco', 'faria lima', 'mascarenhas de moraes', 'castelo branco', 
    'costa e silva', 'alcides de oliveira', 'pavini', 'pessoto', 'duque de caxias'
  ];
  if (termosMilitar.some(termo => texto.includes(termo))) {
    return 'militar';
  }

  // 2. Ciência, Artes & Educação
  const termosCienciaArtes = [
    'doutor', 'dr.', 'professor', 'prof.', 'maestro', 'carlos gomes', 
    'volpim', 'albert einstein', 'louis pasteur', 'sabin', 'portinari', 
    'ciência', 'médico', 'músico', 'compositor', 'educador', 'escola', 
    'intelectual', 'silvio de aguiar', 'ivan maya', 'arthur moreira', 
    'lauro camargo', 'moacir amaral', 'ernesto moreira', 'artes', 'gutenberg', 
    'tadeu crepaldi'
  ];
  if (termosCienciaArtes.some(termo => texto.includes(termo))) {
    return 'ciencia_artes';
  }

  // 3. Religião & Fé
  const termosReligiao = [
    'papa ', 'dom ', 'padre', 'santo', 'santa', 'são ', 'nossa senhora', 
    'via sacra', 'divino salvador', 'bom jesus', 'religioso', 'católica', 
    'paróquia', 'bispo', 'joão xxiii', 'paulo vi', 'joão paulo i', 'donizete', 
    'santo antônio', 'santa sofia', 'santana'
  ];
  if (termosReligiao.some(termo => texto.includes(termo))) {
    return 'religiao';
  }

  // 4. Natureza, Toponímia & Datas
  const termosNaturezaOutros = [
    'alameda', 'ipê', 'jacarandá', 'manacá', 'flamboyant', 'primavera', 
    'girassol', 'acácias', 'dálias', 'amor perfeito', 'cambuci', 'copaíba', 
    'jequitibá', 'campinas', 'jaguariúna', 'sumaré', 'amparo', 'cosmópolis', 
    'cananeia', 'capivari', 'guararapes', 'corcovado', 'ponte queimada', 
    '15 de novembro', 'xv de novembro', '26 de julho', 'lions clube', 
    'entre montes', 'cascalho', 'jardim nautico'
  ];
  if (termosNaturezaOutros.some(termo => texto.includes(termo))) {
    return 'natureza_outros';
  }

  // 5. Famílias & Pioneiros Fundadores (Default para sobrenomes italianos/locais)
  return 'pioneiros';
}
