import { CityConfig, CityId } from '../types';

export const CITIES_CONFIG: Record<CityId, CityConfig> = {
  pedreira: {
    id: 'pedreira',
    nome: 'Pedreira',
    estado: 'SP',
    titulo: 'Ruas com História',
    subtitulo: 'Capital da Porcelana',
    descricao: 'Berço da indústria cerâmica e do Circuito das Águas Paulista. A memória oral das famílias, pracinhas da FEB e pioneiros italianos na encosta do Rio Jaguari.',
    center: [-22.7410, -46.8995],
    zoom: 14,
    fonteLegislativa: 'Câmara Municipal de Pedreira / IBGE',
    linkLegislativo: 'https://www.camarapedreira.sp.gov.br/legislacao/',
    dbHash: '0x82F4..E1',
    bairros: [
      { nome: 'Centro Histórico & Rio Jaguari', lat: -22.7390, lng: -46.8980, raio: 0.0055 },
      { nome: 'Vila Monte Alegre & Zona Norte', lat: -22.7260, lng: -46.8910, raio: 0.0065 },
      { nome: 'Jardim Santa Clara & Marajoara', lat: -22.7480, lng: -46.9060, raio: 0.0058 },
      { nome: 'Jardim Triunfo & Vila Canesso', lat: -22.7440, lng: -46.8860, raio: 0.0060 },
      { nome: 'Vila São José & Alamedas', lat: -22.7540, lng: -46.8940, raio: 0.0062 },
      { nome: 'Jardim Andrade & Colinas', lat: -22.7310, lng: -46.9070, raio: 0.0055 },
      { nome: 'Distrito Industrial & Rodovias', lat: -22.7610, lng: -46.8890, raio: 0.0070 }
    ]
  },
  ouro_preto: {
    id: 'ouro_preto',
    nome: 'Ouro Preto',
    estado: 'MG',
    titulo: 'Ruas da Inconfidência',
    subtitulo: 'Patrimônio Mundial da Humanidade',
    descricao: 'Antiga Vila Rica, berço da Inconfidência Mineira, do barroco de Aleijadinho e da poesia aurífera do século XVIII. Ladeiras que respiram arte e liberdade.',
    center: [-20.3855, -43.5035],
    zoom: 14,
    fonteLegislativa: 'Câmara Municipal de Ouro Preto / Arquivo Público Mineiro',
    linkLegislativo: 'https://www.cmop.mg.gov.br/',
    dbHash: '0x9A3B..C8',
    bairros: [
      { nome: 'Centro Histórico & Praça Tiradentes', lat: -20.3855, lng: -43.5035, raio: 0.0045 },
      { nome: 'Antônio Dias & Santa Efigênia', lat: -20.3810, lng: -43.4980, raio: 0.0050 },
      { nome: 'Pilar & Rosário', lat: -20.3890, lng: -43.5080, raio: 0.0050 },
      { nome: 'Barra & Água Limpa', lat: -20.3940, lng: -43.5120, raio: 0.0055 },
      { nome: 'Velha Cruz & Morro de Santana', lat: -20.3770, lng: -43.4920, raio: 0.0060 },
      { nome: 'Bauxita & Campus UFOP', lat: -20.3990, lng: -43.5180, raio: 0.0065 }
    ]
  },
  paraty: {
    id: 'paraty',
    nome: 'Paraty',
    estado: 'RJ',
    titulo: 'Caminho do Ouro',
    subtitulo: 'Porto Colonial & Mar do Sul',
    descricao: 'Porto imperial do ouro e do café, encravado na Mata Atlântica. Ruas com calçamento pé de moleque, sobrados coloniais, festas imperiais e tradição caiçara.',
    center: [-23.2220, -44.7170],
    zoom: 15,
    fonteLegislativa: 'Câmara Municipal de Paraty / IPHAN',
    linkLegislativo: 'https://www.paraty.rj.leg.br/',
    dbHash: '0x7F1E..B4',
    bairros: [
      { nome: 'Centro Histórico & Porto', lat: -23.2215, lng: -44.7145, raio: 0.0040 },
      { nome: 'Pontal & Praia do Jabaquara', lat: -23.2140, lng: -44.7180, raio: 0.0050 },
      { nome: 'Patura & Mangueira', lat: -23.2260, lng: -44.7210, raio: 0.0045 },
      { nome: 'Vila Colonial & Portão de Ferro', lat: -23.2180, lng: -44.7250, raio: 0.0050 },
      { nome: 'Caminho do Ouro & Encosta', lat: -23.2300, lng: -44.7300, raio: 0.0060 }
    ]
  },
  salvador: {
    id: 'salvador',
    nome: 'Salvador',
    estado: 'BA',
    titulo: 'Primeira Capital',
    subtitulo: 'Berço da Cultura & Resistência',
    descricao: 'A primeira capital do Brasil e coração da cultura afro-brasileira. Das ladeiras do Pelourinho à Baía de Todos os Santos, terras de heróis da independência e fé secular.',
    center: [-12.9714, -38.5014],
    zoom: 14,
    fonteLegislativa: 'Câmara Municipal de Salvador / Fundação Gregório de Matos',
    linkLegislativo: 'https://www.cms.ba.gov.br/',
    dbHash: '0x4D8C..A2',
    bairros: [
      { nome: 'Pelourinho & Centro Histórico', lat: -12.9720, lng: -38.5090, raio: 0.0050 },
      { nome: 'Santo Antônio Além do Carmo', lat: -12.9650, lng: -38.5050, raio: 0.0055 },
      { nome: 'Comércio & Conceição da Praia', lat: -12.9740, lng: -38.5140, raio: 0.0050 },
      { nome: 'Vitória & Campo Grande', lat: -12.9880, lng: -38.5220, raio: 0.0060 },
      { nome: 'Barra & Farol', lat: -13.0040, lng: -38.5300, raio: 0.0065 },
      { nome: 'Rio Vermelho & Ondina', lat: -13.0130, lng: -38.4910, raio: 0.0070 }
    ]
  }
};
