export type MotoCategory = 'novas' | 'seminovas' | 'eletricas';

export interface Moto {
  id: string;
  modelo: string;
  marca: string;
  categoria: MotoCategory;
  ano: number;
  quilometragem: number;
  quantidadeEstoque: number;
  preco: number;
  emPromocao: boolean;
  precoPromocional?: number;
  destaque?: boolean;
  motor: string;
  combustivel: string;
  estilo: string;
  garantia: string;
  tanqueCombustivel?: string;
  consumoMedio?: string;
  cambio?: string;
  descricao: string;
  fotos: string[];
  createdAt: string;
  updatedAt: string;
}

export type PageView = 'inicio' | 'novas' | 'seminovas' | 'eletricas' | 'todas' | 'promocoes' | 'painel';

export interface FinancingSimulation {
  nome: string;
  cpf: string;
  motoId: string;
  motoNome: string;
  valorMoto: number;
  valorEntrada: number;
  prazoMeses: number;
  valorParcela: number;
  taxaMensal: number;
}
