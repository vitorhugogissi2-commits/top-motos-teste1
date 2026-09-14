import { Moto } from '../types';

export const INITIAL_MOTOS: Moto[] = [
  {
    id: 'pcx-160-abs',
    modelo: 'HONDA PCX 160 ABS',
    marca: 'HONDA',
    categoria: 'seminovas',
    ano: 2023,
    quilometragem: 9800,
    quantidadeEstoque: 1,
    preco: 18200,
    emPromocao: false,
    destaque: true,
    motor: '156,9 cc eSP+ 4 Válvulas',
    combustivel: 'Gasolina',
    estilo: 'Scooter Executiva',
    garantia: 'Garantia com Laudo Cautelar Aprovado',
    tanqueCombustivel: '8.0 Litros',
    consumoMedio: '39 km/L',
    cambio: 'Automático CVT (V-Matic)',
    descricao: 'Smart Key presencial, controle de torque HSTC, freio a disco com ABS na dianteira, entrada USB no porta-luvas e porta capacete de 30 litros. Único dono e revisões na concessionária.',
    fotos: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-08-20T14:30:00.000Z'
  },
  {
    id: 'biz-125-es-flex',
    modelo: 'HONDA BIZ 125 ES FLEX',
    marca: 'HONDA',
    categoria: 'seminovas',
    ano: 2023,
    quilometragem: 12400,
    quantidadeEstoque: 1,
    preco: 14500,
    emPromocao: false,
    destaque: true,
    motor: '124,9 cc OHC Monocilíndrico',
    combustivel: 'Flex (Gasolina / Etanol)',
    estilo: 'Cub Urbana',
    garantia: 'Garantia com Laudo Cautelar Aprovado',
    tanqueCombustivel: '5.1 Litros',
    consumoMedio: '45 km/L',
    cambio: 'Semi-Automático 4 Marchas',
    descricao: 'Excelente para o dia a dia! Câmbio rotativo sem embreagem manual, tomada 12V, painel digital blackout e porta-objetos sob o banco.',
    fotos: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-01-12T11:00:00.000Z',
    updatedAt: '2026-08-21T09:15:00.000Z'
  },
  {
    id: 'ninja-400-abs-krt',
    modelo: 'KAWASAKI NINJA 400 ABS KRT EDITION',
    marca: 'KAWASAKI',
    categoria: 'seminovas',
    ano: 2024,
    quilometragem: 6200,
    quantidadeEstoque: 1,
    preco: 32900,
    emPromocao: false,
    destaque: false,
    motor: '399 cc Bicilíndrico Paralelo 4T DOHC',
    combustivel: 'Gasolina',
    estilo: 'Sport / Supersport',
    garantia: 'Garantia com Laudo Cautelar Aprovado',
    tanqueCombustivel: '14.0 Litros',
    consumoMedio: '26 km/L',
    cambio: '6 Marchas com Embreagem Assistida e Deslizante',
    descricao: 'Pintura especial Kawasaki Racing Team (KRT). Iluminação full LED, chassi de treliça leve e freios ABS nas duas rodas. Impecável estado de conservação.',
    fotos: [
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-02-01T15:00:00.000Z',
    updatedAt: '2026-08-22T10:00:00.000Z'
  },
  {
    id: 'nmax-160-abs-0km',
    modelo: 'NMAX 160 ABS CONNECTED 0KM',
    marca: 'YAMAHA',
    categoria: 'novas',
    ano: 2026,
    quilometragem: 0,
    quantidadeEstoque: 3,
    preco: 21990,
    emPromocao: true,
    precoPromocional: 20490,
    destaque: true,
    motor: '155 cc VVA 4 Válvulas Refrigeração Líquida',
    combustivel: 'Gasolina',
    estilo: 'Scooter Premium',
    garantia: '3 Anos Garantia de Fábrica',
    tanqueCombustivel: '7.1 Litros',
    consumoMedio: '38 km/L',
    cambio: 'Automático CVT',
    descricao: 'Nova geração com conectividade Bluetooth Y-Connect, controle de tração TCS, chave presencial Smart Key e sistema Stop & Start inteligente.',
    fotos: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-08-23T18:00:00.000Z'
  },
  {
    id: 'cg-160-titan-flex',
    modelo: 'HONDA CG 160 TITAN FLEX',
    marca: 'HONDA',
    categoria: 'novas',
    ano: 2026,
    quilometragem: 0,
    quantidadeEstoque: 2,
    preco: 19800,
    emPromocao: false,
    destaque: true,
    motor: '162,7 cc OHC Monocilíndrico',
    combustivel: 'Flex (Gasolina / Etanol)',
    estilo: 'Street / Urbana',
    garantia: '3 Anos Garantia de Fábrica',
    tanqueCombustivel: '16.1 Litros',
    consumoMedio: '42 km/L',
    cambio: '5 Marchas',
    descricao: 'A moto mais vendida do Brasil. Painel digital blackout com conta-giros, rodas de liga leve exclusivas, freios CBS e injeção eletrônica PGM-FI.',
    fotos: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-03-05T09:00:00.000Z',
    updatedAt: '2026-08-23T11:00:00.000Z'
  },
  {
    id: 'bmw-s1000rr-m',
    modelo: 'BMW S 1000 RR M PACKAGE',
    marca: 'BMW',
    categoria: 'novas',
    ano: 2026,
    quilometragem: 0,
    quantidadeEstoque: 1,
    preco: 134900,
    emPromocao: true,
    precoPromocional: 124900,
    destaque: true,
    motor: '999 cc 4 Cilindros em Linha BMW ShiftCam',
    combustivel: 'Gasolina',
    estilo: 'Superbike / Racing',
    garantia: '3 Anos Garantia de Fábrica',
    tanqueCombustivel: '16.5 Litros',
    consumoMedio: '17 km/L',
    cambio: '6 Marchas com Quickshifter Bidirecional Pro',
    descricao: 'Máxima performance alemã com 210 cv de potência. Pacote M com rodas esportivas forjadas, winglets aerodinâmicos e painel TFT 6.5 polegadas.',
    fotos: [
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-03-10T14:00:00.000Z',
    updatedAt: '2026-08-24T08:00:00.000Z'
  },
  {
    id: 'gb-e-move',
    modelo: 'GB E-MOVE (PRETO, AMARELO)',
    marca: 'FASHION',
    categoria: 'eletricas',
    ano: 2026,
    quilometragem: 0,
    quantidadeEstoque: 2,
    preco: 3990,
    emPromocao: false,
    destaque: true,
    motor: 'Motor Hub Elétrico Brushless 1000W',
    combustivel: '100% Elétrica (Bateria Lítio)',
    estilo: 'Mobilidade Urbana Leve',
    garantia: '1 Ano Garantia Total',
    tanqueCombustivel: 'Bateria Removível 48V 15Ah',
    consumoMedio: 'Autonomia até 50 km',
    cambio: 'Automático Direto',
    descricao: 'Ecológica, ultra leve e sem necessidade de emplacamento para uso urbano. Design vintage retrô com quadro reforçado e freios a disco.',
    fotos: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-08-24T10:00:00.000Z'
  },
  {
    id: 'or-bike-t5',
    modelo: 'OR BIKE T5 (CINZA)',
    marca: 'ORVITE',
    categoria: 'eletricas',
    ano: 2026,
    quilometragem: 0,
    quantidadeEstoque: 2,
    preco: 4990,
    emPromocao: false,
    destaque: true,
    motor: 'Motor High Torque 1500W',
    combustivel: '100% Elétrica',
    estilo: 'Speed E-Bike Urbana',
    garantia: '1 Ano Garantia Total',
    tanqueCombustivel: 'Bateria Integrada 52V 17Ah',
    consumoMedio: 'Autonomia até 65 km',
    cambio: 'Câmbio Shimano 7V + Assistência E-Power',
    descricao: 'Quadro em alumínio aero de alta rigidez, display LCD digital com velocímetro, odômetro e 5 níveis de assistência elétrica ao pedal.',
    fotos: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-04-05T11:00:00.000Z',
    updatedAt: '2026-08-24T11:00:00.000Z'
  },
  {
    id: 'pd-cinza-custom',
    modelo: 'PD (CINZA)',
    marca: 'PD',
    categoria: 'eletricas',
    ano: 2026,
    quilometragem: 0,
    quantidadeEstoque: 3,
    preco: 5790,
    emPromocao: false,
    destaque: true,
    motor: 'Motor Elétrico Custom Bobber 3000W',
    combustivel: '100% Elétrica',
    estilo: 'Custom Bobber Elétrica',
    garantia: '2 Anos Garantia Motor e Chassi',
    tanqueCombustivel: 'Pack Baterias Samsung 72V 32Ah',
    consumoMedio: 'Autonomia até 85 km',
    cambio: 'Automático 3 Modos (Eco / Standard / Sport)',
    descricao: 'Estilo chopper/custom com silêncio absoluto e aceleração instantânea de 0 a 60 km/h em poucos segundos. Farol Full LED estilo Harley e pneus largos aro 18.',
    fotos: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-04-10T12:00:00.000Z',
    updatedAt: '2026-08-24T11:30:00.000Z'
  },
  {
    id: 'voltz-evs-work',
    modelo: 'VOLTZ EVS WORK 3000W',
    marca: 'VOLTZ',
    categoria: 'eletricas',
    ano: 2026,
    quilometragem: 0,
    quantidadeEstoque: 4,
    preco: 14990,
    emPromocao: true,
    precoPromocional: 13490,
    destaque: false,
    motor: 'Motor Central Bosch 3000W',
    combustivel: '100% Elétrica',
    estilo: 'Street Elétrica Comercial',
    garantia: '3 Anos Garantia Bateria',
    tanqueCombustivel: 'Duas Baterias 72V 38Ah',
    consumoMedio: 'Autonomia até 120 km',
    cambio: 'Automático com Marcha Ré',
    descricao: 'A mais robusta para entregas e trabalho diário. Custo de recarga inferior a R$ 3,00 por carga completa. Freios a disco combinados.',
    fotos: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-04-15T09:00:00.000Z',
    updatedAt: '2026-08-24T11:35:00.000Z'
  },
  {
    id: 'yamaha-mt07-abs',
    modelo: 'YAMAHA MT-07 ABS 0KM',
    marca: 'YAMAHA',
    categoria: 'novas',
    ano: 2026,
    quilometragem: 0,
    quantidadeEstoque: 2,
    preco: 47900,
    emPromocao: false,
    destaque: true,
    motor: '689 cc Bicilíndrico Crossplane CP2',
    combustivel: 'Gasolina',
    estilo: 'Hyper Naked',
    garantia: '3 Anos Garantia de Fábrica',
    tanqueCombustivel: '14.0 Litros',
    consumoMedio: '22 km/L',
    cambio: '6 Marchas',
    descricao: 'Conceito Dark Side of Japan. Torque brutal em baixas rotações, farol projetor LED com assinatura luminosa e freios com discos duplos flutuantes.',
    fotos: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-05-01T14:00:00.000Z',
    updatedAt: '2026-08-24T11:40:00.000Z'
  },
  {
    id: 'bmw-r1250-gs',
    modelo: 'BMW R 1250 GS ADVENTURE',
    marca: 'BMW',
    categoria: 'seminovas',
    ano: 2023,
    quilometragem: 11200,
    quantidadeEstoque: 1,
    preco: 98500,
    emPromocao: false,
    destaque: true,
    motor: '1254 cc Boxer Bicilíndrico ShiftCam 136 cv',
    combustivel: 'Gasolina',
    estilo: 'Big Trail / Aventura',
    garantia: 'Garantia com Laudo Cautelar Aprovado',
    tanqueCombustivel: '30.0 Litros',
    consumoMedio: '21 km/L',
    cambio: '6 Marchas com Transmissão por Cardã',
    descricao: 'Equipada com 3 baús originais em alumínio BMW Motorrad, suspensão eletrônica Dynamic ESA, modos de pilotagem Pro e farol adaptativo LED.',
    fotos: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: '2026-05-10T16:00:00.000Z',
    updatedAt: '2026-08-24T11:41:00.000Z'
  }
];

export const PHOTO_PRESETS = [
  {
    label: 'Honda Naked / Street',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Scooter / PCX / NMAX',
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Superbike / Esportiva',
    url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Harley / Custom / Bobber',
    url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'E-Bike Urbana Elétrica',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Speed / Road Bike',
    url: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&q=80'
  }
];
