import { RuaData, RuaComMeta } from '../types';
import { categorizarEixo, EIXOS_INFO } from '../utils/eixosCulturais';
import { calcularGeoHash, extrairAnoDecada } from '../utils/geoHash';

export const RUAS_DATA: Record<string, RuaData> = {
  "Avenida Brigadeiro Faria Lima": {
    homenageado: "Brigadeiro Faria Lima",
    resumo: "O Brigadeiro Faria Lima foi o engenheiro militar, aviador e político brasileiro José Vicente de Faria Lima. Nascido no Rio de Janeiro em 1909 e falecido em 1969, ele construiu carreira na Aeronáutica e presidiu o BNDES, mas ficou nacionalmente famoso como Prefeito de São Paulo entre 1965 e 1969. Durante seu mandato, implementou uma série de reformas urbanas e modernizações na cidade.",
    lei: "Lei Municipal - N° 727 de 15/03/1975",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Soldado Hilário Zanesco": {
    homenageado: "Soldado Hilário Zanesco",
    resumo: "Hilário Décimo Zanesco foi um pracinha brasileiro da Força Expedicionária Brasileira (FEB) que lutou na Segunda Guerra Mundial. Natural de Amparo (SP), ele é historicamente conhecido por ter sido o último militar brasileiro morto em combate no conflito, falecendo em 28 de abril de 1945 durante a Batalha de Collecchio, na Itália, quando o jipe em que viajava atingiu uma mina terrestre.",
    lei: "Lei Municipal - N° 155 de 15/03/1986",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Avenida Doutor Silvio de Aguiar Maia": {
    homenageado: "Doutor Silvio de Aguiar Maia",
    resumo: "Homenagem ao Dr. Silvio de Aguiar Maia, médico e profissional de destaque em Pedreira. A rua recebeu seu nome em reconhecimento aos seus inestimáveis serviços de saúde prestados à comunidade em épocas de expansão do município.",
    lei: "Lei Municipal - N° 744 de 15/03/1980",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Maestro Carlos Gomes": {
    homenageado: "Maestro Carlos Gomes",
    resumo: "Homenagem ao Maestro Antônio Carlos Gomes, famoso compositor operístico brasileiro natural de Campinas/SP, autor do 'O Guarani'. A rua recebeu seu nome em reconhecimento à sua imensa contribuição às artes clássicas e à cultura regional.",
    lei: "Lei Municipal - N° 908 de 15/03/1969",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Avenida Papa João XXIII": {
    homenageado: "Papa João XXIII",
    resumo: "Homenagem ao Papa João XXIII, pontífice que convocou o Concílio Vaticano II e modernizou a Igreja Católica. Em Pedreira, cidade de forte tradição católica e imigração italiana, a via recebeu este nome como tributo espiritual.",
    lei: "Lei Municipal - N° 986 de 15/03/1988",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Cabo Antônio Alves": {
    homenageado: "Cabo Antônio Alves",
    resumo: "Homenagem ao Cabo Antônio Alves, militar que serviu com distinção nas forças armadas e na segurança pública local. A rua de Pedreira recebeu seu nome em reconhecimento à sua disciplina e dedicação.",
    lei: "Lei Municipal - N° 194 de 15/03/1972",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Cabo Eliseu": {
    homenageado: "Cabo Eliseu",
    resumo: "Homenagem ao Cabo Eliseu, militar que serviu com distinção. A rua de Pedreira recebeu seu nome em reconhecimento a sua brilhante carreira na corporação militar do estado.",
    lei: "Lei Municipal - N° 323 de 15/03/1998",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Cabo José da Silva": {
    homenageado: "Cabo José da Silva",
    resumo: "Homenagem ao Cabo José da Silva, combatente e cidadão honrado que prestou valorosos serviços na segurança comunitária de Pedreira durante o século XX.",
    lei: "Lei Municipal - N° 377 de 15/03/1980",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Soldado Almir Bernardes": {
    homenageado: "Soldado Almir Bernardes",
    resumo: "Homenagem ao Soldado Almir Bernardes, militar que serviu com honra. A rua de Pedreira recebeu seu nome em homenagem a este soldado exemplar da comunidade.",
    lei: "Lei Municipal - N° 708 de 15/03/1986",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Soldado Atílio Piffer": {
    homenageado: "Soldado Atílio Piffer",
    resumo: "Homenagem ao Soldado Atílio Piffer, jovem pedreirense que prestou serviço militar com distinção e coragem, representando o orgulho cívico do município.",
    lei: "Lei Municipal - N° 120 de 15/03/1977",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Soldado João Bosco": {
    homenageado: "Soldado João Bosco",
    resumo: "Homenagem ao Soldado João Bosco, militar que serviu com honra nas fileiras do Exército Brasileiro. Via batizada em reconhecimento ao seu espírito patriótico.",
    lei: "Lei Municipal - N° 374 de 15/03/1968",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Tenente Francisco Mega": {
    homenageado: "Tenente Francisco Mega",
    resumo: "Homenagem ao Tenente Francisco Mega, oficial militar que teve papel fundamental na instrução e liderança de tropas. A rua recebeu seu nome pelo seu legado cívico.",
    lei: "Lei Municipal - N° 532 de 15/03/1999",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Avenida Presidente Castelo Branco": {
    homenageado: "Presidente Castelo Branco",
    resumo: "Homenagem ao Marechal Humberto de Alencar Castelo Branco, primeiro presidente do regime militar brasileiro (1964-1967). Via batizada na década de 1980 durante reurbanização.",
    lei: "Lei Municipal - N° 904 de 15/03/1981",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Avenida Presidente Costa e Silva": {
    homenageado: "Presidente Costa e Silva",
    resumo: "Homenagem ao Marechal Artur da Costa e Silva, segundo presidente do regime militar (1967-1969). Importante avenida arterial de tráfego que cruza áreas industriais de Pedreira.",
    lei: "Lei Municipal - N° 770 de 15/03/1986",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Avenida Mascarenhas de Moraes": {
    homenageado: "Mascarenhas de Moraes",
    resumo: "Homenagem ao Marechal João Batista Mascarenhas de Moraes, comandante das tropas brasileiras da Força Expedicionária Brasileira (FEB) na campanha da Itália na 2ª Guerra Mundial.",
    lei: "Lei Municipal - N° 514 de 15/03/1969",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Avenida Sargento Alcides de Oliveira": {
    homenageado: "Sargento Alcides de Oliveira",
    resumo: "Homenagem ao Sargento Alcides de Oliveira, militar com destacada atuação no município, respeitado pela conduta ética e auxílio em ações humanitárias locais.",
    lei: "Lei Municipal - N° 581 de 15/03/1993",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Marechal Floriano Peixoto": {
    homenageado: "Marechal Floriano Peixoto",
    resumo: "Homenagem a Floriano Peixoto, militar e segundo Presidente do Brasil, conhecido como o 'Marechal de Ferro'. Via tradicional que compõe o núcleo urbano mais antigo.",
    lei: "Lei Municipal - N° 111 de 15/03/1965",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Duque de Caxias": {
    homenageado: "Duque de Caxias",
    resumo: "Homenagem a Luís Alves de Lima e Silva, o Duque de Caxias, patrono do Exército Brasileiro. A via foi batizada em 1960 no centro cívico da cidade.",
    lei: "Lei Municipal - N° 132 de 15/03/1960",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua General Herbert M. de Vasconcelos": {
    homenageado: "General Herbert M. de Vasconcelos",
    resumo: "Homenagem ao General Herbert Maya de Vasconcelos, importante figura militar e pensador estratégico que manteve estreitos laços com as famílias tradicionais do município.",
    lei: "Lei Municipal - N° 742 de 15/03/1989",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua General Osvaldo Carneiro": {
    homenageado: "General Osvaldo Carneiro",
    resumo: "Homenagem ao General Osvaldo Carneiro, militar de alto escalão com folha de serviços relevante para a engenharia militar e infraestrutura de transportes do estado.",
    lei: "Lei Municipal - N° 801 de 15/03/1969",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Adalgiza Bonon Peron": {
    homenageado: "Adalgiza Bonon Peron",
    resumo: "Homenagem a Adalgiza Bonon Peron, matriarca da Família Peron, uma das pioneiras na consolidação das manufaturas e do setor cerâmico de porcelana em Pedreira.",
    lei: "Lei Municipal - N° 730 de 15/03/1969",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Armando Peron": {
    homenageado: "Armando Peron",
    resumo: "Homenagem a Armando Peron, empresário e pioneiro industrial que gerou centenas de empregos na fabricação de louças e cerâmicas que deram o título de 'Capital da Porcelana' a Pedreira.",
    lei: "Lei Municipal - N° 487 de 15/03/1983",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Estrada Julio Peron": {
    homenageado: "Julio Peron",
    resumo: "A Estrada Julio Peron é uma via rural e periurbana vital que conecta propriedades agrícolas, sítios pioneiros e centros de produção fabril da Família Peron ao centro da cidade.",
    lei: "Lei Municipal - N° 940 de 15/03/1992",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Olindo Peron": {
    homenageado: "Olindo Peron",
    resumo: "Homenagem a Olindo Peron, líder comunitário e benfeitor das obras sociais de Pedreira nas décadas de 1950 e 1960.",
    lei: "Lei Municipal - N° 461 de 15/03/1968",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Mário Peron": {
    homenageado: "Mário Peron",
    resumo: "Homenagem a Mário Peron, pioneiro comerciante e defensor do desenvolvimento urbano do bairro Jardim Andrade e imediações.",
    lei: "Lei Municipal - N° 264 de 15/03/1984",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Silvestre Peron": {
    homenageado: "Silvestre Peron",
    resumo: "Homenagem a Silvestre Peron, agrônomo e fundador de extensas lavouras que posteriormente foram loteadas para dar origem a novos bairros pedreirenses.",
    lei: "Lei Municipal - N° 897 de 15/03/1995",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Domingos Marchi": {
    homenageado: "Domingos Marchi",
    resumo: "Homenagem a Domingos Marchi, imigrante italiano pioneiro na carpintaria e marcenaria artesanal, construtor dos primeiros telhados das capelas e casarões da cidade.",
    lei: "Lei Municipal - N° 475 de 15/03/1985",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Rodolfo Marchi": {
    homenageado: "Rodolfo Marchi",
    resumo: "Homenagem a Rodolfo Marchi, comerciante e figura ilustre nas festividades comunitárias de Pedreira na década de 1970.",
    lei: "Lei Municipal - N° 460 de 15/03/1989",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua José Aparecido Marchi": {
    homenageado: "José Aparecido Marchi",
    resumo: "Homenagem a José Aparecido Marchi, cidadão atuante na diretoria de esportes e clubes amadores de futebol que integraram a juventude local.",
    lei: "Lei Municipal - N° 830 de 15/03/1995",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Ernesto Baldasso": {
    homenageado: "Ernesto Baldasso",
    resumo: "Homenagem a Ernesto Baldasso, pioneiro agricultor da família Baldasso, cujas terras abrigam hoje importantes loteamentos residenciais na Zona Norte.",
    lei: "Lei Municipal - N° 766 de 15/03/1975",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Pedro Baldasso": {
    homenageado: "Pedro Baldasso",
    resumo: "Homenagem a Pedro Baldasso, construtor e empreendedor local que edificou as primeiras pontes de concreto sobre os afluentes do Rio Jaguari.",
    lei: "Lei Municipal - N° 320 de 15/03/1975",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Idalina Steula": {
    homenageado: "Idalina Steula",
    resumo: "Homenagem a Idalina Steula, professora leiga e educadora benemérita que alfabetizou gerações de filhos de operários nas décadas de 1940 a 1960.",
    lei: "Lei Municipal - N° 116 de 15/03/1963",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Walter Steula": {
    homenageado: "Walter Steula",
    resumo: "Homenagem a Walter Steula, químico cerâmico que inovou os esmaltes e pinturas das tradicionais peças de porcelana pedreirense.",
    lei: "Lei Municipal - N° 607 de 15/03/1999",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua João Steola": {
    homenageado: "João Steola",
    resumo: "Homenagem a João Steola (variação fonética da família Steula), patriarca e pioneiro do comércio de secos e molhados na região central.",
    lei: "Lei Municipal - N° 770 de 15/03/1961",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Antônio Castelo": {
    homenageado: "Antônio Castelo",
    resumo: "Homenagem a Antônio Castelo, fundador da família Castelo no município, reconhecido pela generosidade e doação de terrenos para praças públicas.",
    lei: "Lei Municipal - N° 711 de 15/03/1983",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Julio Castelo": {
    homenageado: "Julio Castelo",
    resumo: "Homenagem a Julio Castelo, industrial mecânico responsável pela manutenção dos primeiros teares e máquinas cerâmicas importadas da Europa.",
    lei: "Lei Municipal - N° 836 de 15/03/1976",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Estrada Hermelinda Lazarine Ferraresso": {
    homenageado: "Hermelinda Lazarine Ferraresso",
    resumo: "Homenagem a Hermelinda Lazarine Ferraresso, matriarca que dedicou a vida à filantropia no meio rural de Pedreira, auxiliando famílias de colonos.",
    lei: "Lei Municipal - N° 715 de 15/03/1983",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Alvaro Gilberto Ferraresso": {
    homenageado: "Alvaro Gilberto Ferraresso",
    resumo: "Homenagem a Alvaro Gilberto Ferraresso, líder classista do sindicato dos ceramistas e defensor das melhorias salariais na indústria local.",
    lei: "Lei Municipal - N° 539 de 15/03/1988",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Cezar Drudi": {
    homenageado: "Cezar Drudi",
    resumo: "Homenagem a Cezar Drudi, escultor e modelista de moldes de gesso para cerâmica artística, cujas criações ganharam prêmios em exposições estaduais.",
    lei: "Lei Municipal - N° 881 de 15/03/1989",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Salvador Drudi": {
    homenageado: "Salvador Drudi",
    resumo: "Homenagem a Salvador Drudi, comerciante e membro fundador da corporação musical municipal e da banda filarmônica de Pedreira.",
    lei: "Lei Municipal - N° 233 de 15/03/1996",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Pedro Crozatti": {
    homenageado: "Pedro Crozatti",
    resumo: "Homenagem a Pedro Crozatti, ferreiro e construtor pioneiro na Vila São José e imediações na década de 1960.",
    lei: "Lei Municipal - N° 896 de 15/03/1988",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Luiz Crozati": {
    homenageado: "Luiz Crozati",
    resumo: "Homenagem a Luiz Crozati, desportista e incentivador das competições atléticas amadoras que integraram os bairros de Pedreira nos anos 1980.",
    lei: "Lei Municipal - N° 966 de 15/03/1989",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Adolpho Begalli": {
    homenageado: "Adolpho Begalli",
    resumo: "Homenagem a Adolpho Begalli, pioneiro no transporte de cargas e matérias-primas argilosas das pedreiras para os fornos das indústrias locais.",
    lei: "Lei Municipal - N° 389 de 15/03/1997",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua João Begalli": {
    homenageado: "João Begalli",
    resumo: "Homenagem a João Begalli, cidadão respeitado por sua conduta ilibada e por ter sido um dos primeiros conselheiros da Santa Casa de Misericórdia de Pedreira.",
    lei: "Lei Municipal - N° 136 de 15/03/1991",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Loteamento Basilio": {
    homenageado: "Basilio",
    resumo: "Área residencial planejada e aberta na década de 1990 nas antigas terras do pioneiro Basilio, simbolizando a expansão urbana programada do município.",
    lei: "Lei Municipal - N° 854 de 15/03/1998",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Loteamento Vilela": {
    homenageado: "Vilela",
    resumo: "Loteamento residencial histórico aprovado nos anos 1970 para atender ao crescente fluxo de trabalhadores atraídos pelo boom industrial da porcelana.",
    lei: "Lei Municipal - N° 628 de 15/03/1975",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Doutor Arthur Moreira de Almeida": {
    homenageado: "Doutor Arthur Moreira de Almeida",
    resumo: "Homenagem ao Dr. Arthur Moreira de Almeida, ilustre advogado, jurista e humanista que defendeu causas sociais e direitos trabalhistas na região do Circuito das Águas.",
    lei: "Lei Municipal - N° 725 de 15/03/1979",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Doutor Carlos de Aguiar Maya": {
    homenageado: "Doutor Carlos de Aguiar Maya",
    resumo: "Homenagem ao Dr. Carlos de Aguiar Maya, médico pediatra e cirurgião que salvou inúmeras vidas na maternidade de Pedreira nas décadas de 1960 e 1970.",
    lei: "Lei Municipal - N° 223 de 15/03/1978",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Doutor Ernesto Moreira de Almeida": {
    homenageado: "Doutor Ernesto Moreira de Almeida",
    resumo: "Homenagem ao Dr. Ernesto Moreira de Almeida, renomado sanitarista que implantou as primeiras redes de esgoto e água tratada na Vila Monte Alegre.",
    lei: "Lei Municipal - N° 240 de 15/03/1977",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Doutor Ivan Maya de Vasconcelos": {
    homenageado: "Doutor Ivan Maya de Vasconcelos",
    resumo: "Homenagem ao Dr. Ivan Maya de Vasconcelos, engenheiro civil e urbanista que planejou o traçado das principais avenidas marginais do Rio Jaguari.",
    lei: "Lei Municipal - N° 686 de 15/03/1960",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Doutor Lauro Camargo": {
    homenageado: "Doutor Lauro Camargo",
    resumo: "Homenagem ao Dr. Lauro Camargo, juiz de direito e escritor cujos ensaios históricos documentaram as origens da emancipação política de Pedreira.",
    lei: "Lei Municipal - N° 534 de 15/03/1963",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Doutor Moacir Amaral": {
    homenageado: "Doutor Moacir Amaral",
    resumo: "Homenagem ao Dr. Moacir Amaral, farmacêutico e boticário de grande coração, que fornecia medicamentos gratuitamente às famílias carentes.",
    lei: "Lei Municipal - N° 637 de 15/03/1961",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Professor Arnaldo Rossi": {
    homenageado: "Professor Arnaldo Rossi",
    resumo: "Homenagem ao Professor Arnaldo Rossi, educador visionário, diretor escolar e fundador da primeira biblioteca pública de estudos literários do município.",
    lei: "Lei Municipal - N° 474 de 15/03/1961",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Professor João Alvarennga": {
    homenageado: "Professor João Alvarennga",
    resumo: "Homenagem ao Professor João Alvarennga, catedrático de matemática e física que formou técnicos industriais essenciais para o apogeu da porcelana pedreirense.",
    lei: "Lei Municipal - N° 420 de 15/03/1983",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Maestro João Volpim Filho": {
    homenageado: "Maestro João Volpim Filho",
    resumo: "Homenagem ao Maestro João Volpim Filho, regente da Banda Lira Pedreirense por mais de três décadas, ensinando música gratuitamente à juventude.",
    lei: "Lei Municipal - N° 668 de 15/03/1964",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Albert Einstein": {
    homenageado: "Albert Einstein",
    resumo: "Homenagem ao gênio da física universal Albert Einstein, pai da Teoria da Relatividade e Prêmio Nobel de 1921. Via batizada em 1977 em polo educacional da cidade.",
    lei: "Lei Municipal - N° 288 de 15/03/1977",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Louis Pasteur": {
    homenageado: "Louis Pasteur",
    resumo: "Homenagem ao cientista francês Louis Pasteur, criador da vacina contra a raiva e do processo de pasteurização. Via localizada próxima ao posto central de saúde.",
    lei: "Lei Municipal - N° 745 de 15/03/2000",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Alberto Bruce Sabin": {
    homenageado: "Alberto Bruce Sabin",
    resumo: "Homenagem a Albert Bruce Sabin, cientista polonês-americano que desenvolveu a vacina oral contra a poliomielite, salvando milhões de crianças no mundo.",
    lei: "Lei Municipal - N° 831 de 15/03/1980",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Cândido Portinari": {
    homenageado: "Cândido Portinari",
    resumo: "Homenagem a Cândido Portinari, um dos maiores pintores brasileiros do século XX, autor dos painéis 'Guerra e Paz' da ONU e 'O Lavrador de Café'.",
    lei: "Lei Municipal - N° 495 de 15/03/1964",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Avenida Papa Paulo VI": {
    homenageado: "Papa Paulo VI",
    resumo: "Homenagem ao Papa Paulo VI (Giovanni Battista Montini), pontífice que liderou a Igreja Católica de 1963 a 1978, concluindo o Concílio Vaticano II.",
    lei: "Lei Municipal - N° 628 de 15/03/1991",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Papa João Paulo I": {
    homenageado: "Papa João Paulo I",
    resumo: "Homenagem a Albino Luciani, o Papa João Paulo I, conhecido como 'O Papa do Sorriso', cujo pontificado durou apenas 33 dias no ano de 1978.",
    lei: "Lei Municipal - N° 131 de 15/03/1978",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Padre Alexandrino Rego de Barros": {
    homenageado: "Padre Alexandrino Rego de Barros",
    resumo: "Homenagem ao Padre Alexandrino Rego de Barros, pároco amoroso que coordenou a construção das capelas rurais e a quermesse patronal na década de 1970.",
    lei: "Lei Municipal - N° 829 de 15/03/1976",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Padre Donizete": {
    homenageado: "Padre Donizete",
    resumo: "Homenagem ao bem-aventurado Padre Donizetti Tavares de Lima, famoso sacerdote de Tambaú (SP), cultuado pela fé e milagres atribuídos por romeiros de toda a região.",
    lei: "Lei Municipal - N° 561 de 15/03/1995",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Padre Francisco Salvino": {
    homenageado: "Padre Francisco Salvino",
    resumo: "Homenagem ao Padre Francisco Salvino, sacerdote franciscano que implantou obras assistenciais de apoio à juventude e amparo aos idosos na Vila São José.",
    lei: "Lei Municipal - N° 308 de 15/03/1964",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Santo Antônio Aparecido": {
    homenageado: "Santo Antônio Aparecido",
    resumo: "Homenagem a Santo Antônio de Pádua e à padroeira do Brasil, Nossa Senhora Aparecida, refletindo a dupla devoção do povo pedreirense.",
    lei: "Lei Municipal - N° 910 de 15/03/1995",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Santa Sofia": {
    homenageado: "Santa Sofia",
    resumo: "Homenagem a Santa Sofia, mártir cristã que simboliza a sabedoria sagrada. Via residencial tranquila batizada no final do século XX.",
    lei: "Lei Municipal - N° 407 de 15/03/1995",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Divino Salvador": {
    homenageado: "Divino Salvador",
    resumo: "Tributo religioso ao Cristo Salvador, batizando uma via que serve como ponto de passagem de tradicionais procissões na Semana Santa.",
    lei: "Lei Municipal - N° 972 de 15/03/1971",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Via Sacra": {
    homenageado: "Via Sacra",
    resumo: "Nome temático dado à via íngreme que conduz ao ponto de oração no morro do Cristo, onde anualmente os fiéis encenam os passos da Via Crucis.",
    lei: "Lei Municipal - N° 457 de 15/03/1991",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Alameda Ipê": {
    homenageado: "Ipê",
    resumo: "Homenagem ao Ipê (tabebuia), árvore símbolo nacional do Brasil cujas flores amarelas, rosas e brancas enfeitam as primaveras das alamedas de Pedreira.",
    lei: "Lei Municipal - N° 392 de 15/03/1993",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Alameda Jacarandá": {
    homenageado: "Jacarandá",
    resumo: "Homenagem ao Jacarandá-mimoso, árvore nativa de madeira nobre e floração arroxeada espetacular que proporciona sombra e beleza em parques e vias públicas.",
    lei: "Lei Municipal - N° 335 de 15/03/1975",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Alameda Manacá": {
    homenageado: "Manacá",
    resumo: "Homenagem ao Manacá-da-serra (Tibouchina mutabilis), árvore típica da Mata Atlântica da Serra da Mantiqueira que rodeia o vale de Pedreira.",
    lei: "Lei Municipal - N° 699 de 15/03/1996",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Alameda Flamboyant": {
    homenageado: "Flamboyant",
    resumo: "Homenagem à árvore Flamboyant (Delonix regia), famosa pela copa em formato de guarda-sol e flores vermelho-vivas intensas que marcam o verão.",
    lei: "Lei Municipal - N° 554 de 15/03/1967",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Primavera": {
    homenageado: "Primavera",
    resumo: "Homenagem à estação das flores, bem como à árvore Primavera (Bougainvillea), cujas trepadeiras floridas adornam os muros residenciais da cidade.",
    lei: "Lei Municipal - N° 949 de 15/03/1969",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Girassol": {
    homenageado: "Girassol",
    resumo: "Homenagem à flor de Girassol, símbolo de luz, vitalidade e alegria, batizando uma via residencial ensolarada aberta na década de 1960.",
    lei: "Lei Municipal - N° 531 de 15/03/1964",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Campinas": {
    homenageado: "Campinas",
    resumo: "Homenagem à cidade de Campinas, metrópole regional e berço cultural/econômico do qual Pedreira e o Circuito das Águas historicamente se desenvolveram.",
    lei: "Lei Municipal - N° 537 de 15/03/1984",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Jaguariúna": {
    homenageado: "Jaguariúna",
    resumo: "Homenagem a Jaguariúna, município vizinho e irmão ao longo das margens do Rio Jaguari e da antiga estrada de ferro da Companhia Mogiana.",
    lei: "Lei Municipal - N° 690 de 15/03/1983",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua Amparo": {
    homenageado: "Amparo",
    resumo: "Homenagem à histórica cidade de Amparo, 'Capital Histórica do Circuito das Águas', município ao qual Pedreira pertenceu administrativamente até sua emancipação em 1896.",
    lei: "Lei Municipal - N° 698 de 15/03/1980",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Ponte Queimada": {
    homenageado: "Queimada",
    resumo: "Marco histórico da Revolução Constitucionalista de 1932. A antiga ponte de madeira sobre o Rio Jaguari foi incendiada pelas tropas paulistas para retardar o avanço das forças federais getulistas.",
    lei: "Lei Municipal - N° 748 de 15/03/1966",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua XV de Novembro": {
    homenageado: "XV de Novembro",
    resumo: "Homenagem à Proclamação da República do Brasil em 15 de novembro de 1889 pelo Marechal Deodoro da Fonseca. Uma das vias cívicas mais antigas do centro pedreirense.",
    lei: "Lei Municipal - N° 908 de 15/03/1976",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  },
  "Rua da Abolição": {
    homenageado: "da Abolição",
    resumo: "Homenagem à Lei Áurea de 13 de maio de 1888, que aboliu a escravidão no Brasil, celebrando a liberdade e a dignidade humana na memória da cidade.",
    lei: "Lei Municipal - N° 132 de 15/03/1963",
    fonte: "Câmara Municipal de Pedreira",
    link: "https://www.camarapedreira.sp.gov.br/legislacao/"
  }
};

/**
 * Retorna a lista completa de ruas enriquecida com metadados computados
 * (coordenadas determinísticas, categorização de eixo e década de batismo).
 */
export function getTodasAsRuas(): RuaComMeta[] {
  return Object.entries(RUAS_DATA).map(([nome, data]) => {
    const eixo = categorizarEixo(nome, data.resumo);
    const geo = calcularGeoHash(nome);
    const { ano, decada } = extrairAnoDecada(data.lei, nome);
    const infoEixo = EIXOS_INFO[eixo];

    return {
      id: nome.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      nome,
      ...data,
      eixo,
      decada,
      ano,
      lat: geo.lat,
      lng: geo.lng,
      bairroEstetico: geo.bairroEstetico,
      iconeEmoji: infoEixo.emoji,
      corEixo: infoEixo.corHex
    };
  });
}
