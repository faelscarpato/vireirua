/**
 * Geolocalização Determinística Inteligente para Pedreira/SP
 * 
 * Utiliza dispersão matemática baseada no hash do nome da via para posicionar
 * de forma estética e consistente sobre os bairros e malha urbana de Pedreira.
 */

export interface CoordenadaDeterministica {
  lat: number;
  lng: number;
  bairroEstetico: string;
}

const BAIRROS_PEDREIRA = [
  { nome: 'Centro Histórico & Rio Jaguari', lat: -22.7390, lng: -46.8980, raio: 0.0055 },
  { nome: 'Vila Monte Alegre & Zona Norte', lat: -22.7260, lng: -46.8910, raio: 0.0065 },
  { nome: 'Jardim Santa Clara & Marajoara', lat: -22.7480, lng: -46.9060, raio: 0.0058 },
  { nome: 'Jardim Triunfo & Vila Canesso', lat: -22.7440, lng: -46.8860, raio: 0.0060 },
  { nome: 'Vila São José & Alamedas', lat: -22.7540, lng: -46.8940, raio: 0.0062 },
  { nome: 'Jardim Andrade & Colinas', lat: -22.7310, lng: -46.9070, raio: 0.0055 },
  { nome: 'Distrito Industrial & Rodovias', lat: -22.7610, lng: -46.8890, raio: 0.0070 }
];

/**
 * Função de hash de string determinística (FNV-1a adaptado)
 */
function gerarHash(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

/**
 * Calcula coordenadas estéticas determinísticas para uma rua
 */
export function calcularGeoHash(
  nomeRua: string, 
  bairros: Array<{ nome: string; lat: number; lng: number; raio: number }> = BAIRROS_PEDREIRA
): CoordenadaDeterministica {
  const hash = gerarHash(nomeRua);
  
  const listaBairros = bairros && bairros.length > 0 ? bairros : BAIRROS_PEDREIRA;
  
  // Escolhe o bairro de forma determinística
  const indiceBairro = hash % listaBairros.length;
  const bairro = listaBairros[indiceBairro];

  // Gera offsets polares pseudo-aleatórios determinísticos
  const angulo = ((hash % 360) * Math.PI) / 180;
  // Distância do centro do bairro (0.2 a 1.0 do raio)
  const fatorDistancia = 0.2 + ((hash % 80) / 100);
  const distancia = bairro.raio * fatorDistancia;

  // Ajuste de proporção para latitude/longitude no Brasil (1° lng ~ 0.92° lat em escala visual)
  const offsetLat = Math.sin(angulo) * distancia;
  const offsetLng = Math.cos(angulo) * distancia * 1.08;

  const lat = Number((bairro.lat + offsetLat).toFixed(6));
  const lng = Number((bairro.lng + offsetLng).toFixed(6));

  return {
    lat,
    lng,
    bairroEstetico: bairro.nome
  };
}

/**
 * Extrai o ano da string da lei (ex: "Lei Municipal - N° 640 de 15/03/1978" ou "Decreto Colonial - 1549")
 */
export function extrairAnoDecada(lei: string, nomeRua: string): { ano: number; decada: string } {
  const match = lei.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
  let ano = match ? parseInt(match[0], 10) : 0;

  if (!ano) {
    // Se não encontrou na lei, usa hash para atribuir um ano realista entre 1960 e 1999
    const hash = gerarHash(nomeRua);
    ano = 1960 + (hash % 42);
  }

  let decada = '1960s';
  if (ano >= 2000) {
    decada = '2000s+';
  } else if (ano >= 1990) {
    decada = '1990s';
  } else if (ano >= 1980) {
    decada = '1980s';
  } else if (ano >= 1970) {
    decada = '1970s';
  } else if (ano >= 1960) {
    decada = '1960s';
  } else if (ano >= 1900) {
    decada = '1900s-1950s';
  } else {
    decada = 'Colonial';
  }

  return { ano, decada };
}
