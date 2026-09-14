import { Moto, FinancingSimulation } from '../types';
import { INITIAL_MOTOS } from '../data/initialMotos';
import { db } from './firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  getDocs,
  writeBatch,
} from 'firebase/firestore';

const STORAGE_KEY = 'topmotos_database_motos_v1';
const BROADCAST_CHANNEL = 'topmotos_realtime_broadcast';
export const WHATSAPP_PHONE = '5543991463841'; // (43) 99146-3841
export const INSTAGRAM_HANDLE = '@HONDATOPMOTOS';

// Cross-tab broadcast channel
let bc: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    bc = new BroadcastChannel(BROADCAST_CHANNEL);
  }
} catch {
  // ignore
}

// In-memory cache for ultra-fast render
let currentMotosCache: Moto[] = [];

if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      currentMotosCache = JSON.parse(stored) as Moto[];
    }
  } catch (e) {
    console.error('Error reading localStorage cache:', e);
  }
}

const subscribers = new Set<(motos: Moto[]) => void>();

function notifySubscribers(motos: Moto[]) {
  currentMotosCache = motos;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(motos));
    } catch {
      // ignore
    }
  }

  subscribers.forEach((cb) => {
    try {
      cb(motos);
    } catch (err) {
      console.error('Error in moto subscriber callback:', err);
    }
  });

  if (bc) {
    try {
      bc.postMessage({ type: 'SYNC_MOTOS', data: motos });
    } catch {
      // ignore
    }
  }
}

if (bc) {
  bc.onmessage = (event) => {
    if (event.data?.type === 'SYNC_MOTOS' && Array.isArray(event.data.data)) {
      currentMotosCache = event.data.data;
      subscribers.forEach((cb) => {
        try {
          cb(event.data.data);
        } catch {
          // ignore
        }
      });
    }
  };
}

export function getMotos(): Moto[] {
  return currentMotosCache;
}

/**
 * Remove undefined values so Firestore does not reject with "Unsupported field value: undefined"
 */
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        cleaned[key] = sanitizeForFirestore(val);
      } else {
        cleaned[key] = val;
      }
    }
  }
  return cleaned;
}

/**
 * Real-time listener for Firestore collection 'motos' using onSnapshot.
 * Automatically synchronizes changes to all users across all tabs/devices in real-time.
 */
export function subscribeToMotoUpdates(callback: (motos: Moto[]) => void): () => void {
  subscribers.add(callback);
  
  // Emit current cache immediately to prevent blank screens
  callback(currentMotosCache);

  try {
    const motosRef = collection(db, 'motos');
    const q = query(motosRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          notifySubscribers([]);
          return;
        }

        const list: Moto[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            marca: data.marca || 'HONDA',
            modelo: data.modelo || 'Modelo Top Motos',
            categoria: data.categoria || 'novas',
            ano: Number(data.ano) || 2024,
            quilometragem: Number(data.quilometragem) || 0,
            quantidadeEstoque: Number(data.quantidadeEstoque) ?? 1,
            preco: Number(data.preco) || 15000,
            emPromocao: Boolean(data.emPromocao),
            precoPromocional: data.precoPromocional ? Number(data.precoPromocional) : undefined,
            destaque: Boolean(data.destaque),
            motor: data.motor || '',
            combustivel: data.combustivel || 'Gasolina / Etanol',
            estilo: data.estilo || '',
            garantia: data.garantia || '3 Meses de Garantia Top Motos',
            tanqueCombustivel: data.tanqueCombustivel || undefined,
            consumoMedio: data.consumoMedio || undefined,
            cambio: data.cambio || undefined,
            descricao: data.descricao || '',
            fotos: Array.isArray(data.fotos) && data.fotos.length > 0 ? data.fotos : [
              'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'
            ],
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
          };
        });

        // Sort by updatedAt descending
        list.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        notifySubscribers(list);
      },
      (error) => {
        console.warn('Firestore onSnapshot error (using local cache):', error);
        notifySubscribers(currentMotosCache);
      }
    );

    return () => {
      subscribers.delete(callback);
      unsubscribe();
    };
  } catch (err) {
    console.warn('Firestore init listener error:', err);
    return () => {
      subscribers.delete(callback);
    };
  }
}

/**
 * Add a new Moto to Firestore with real-time sync
 */
export async function addMoto(motoData: Omit<Moto, 'id' | 'createdAt' | 'updatedAt'>): Promise<Moto> {
  const newId = 'moto-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();
  const newMoto: Moto = {
    ...motoData,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };

  // Immediate local update for instant user response
  const updatedList = [newMoto, ...currentMotosCache];
  notifySubscribers(updatedList);

  try {
    const motoDocRef = doc(db, 'motos', newId);
    await setDoc(motoDocRef, sanitizeForFirestore(newMoto));
  } catch (err) {
    console.error('Firestore setDoc error:', err);
  }

  return newMoto;
}

/**
 * Update an existing Moto in Firestore with real-time sync
 */
export async function updateMoto(id: string, partial: Partial<Moto>): Promise<void> {
  const now = new Date().toISOString();
  const updatedList = currentMotosCache.map((m) =>
    m.id === id ? { ...m, ...partial, updatedAt: now } : m
  );
  notifySubscribers(updatedList);

  try {
    const motoDocRef = doc(db, 'motos', id);
    const cleaned = sanitizeForFirestore({
      ...partial,
      updatedAt: now,
    });
    await setDoc(motoDocRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Firestore updateDoc/setDoc error:', err);
  }
}

/**
 * Delete a Moto from Firestore with real-time sync
 */
export async function deleteMoto(id: string): Promise<void> {
  const updatedList = currentMotosCache.filter((m) => m.id !== id);
  notifySubscribers(updatedList);

  try {
    const motoDocRef = doc(db, 'motos', id);
    await deleteDoc(motoDocRef);
  } catch (err) {
    console.error('Firestore deleteDoc error:', err);
  }
}

/**
 * Toggle Promotion in Firestore with real-time sync
 */
export async function togglePromotion(id: string, precoPromocional?: number): Promise<void> {
  const moto = currentMotosCache.find((m) => m.id === id);
  if (!moto) return;

  const newStatus = !moto.emPromocao;
  const now = new Date().toISOString();

  let targetPromoPrice: number | null = null;
  if (newStatus) {
    targetPromoPrice = precoPromocional ?? (moto.precoPromocional || Math.round(moto.preco * 0.9));
  }

  const updatedList = currentMotosCache.map((m) => {
    if (m.id === id) {
      return {
        ...m,
        emPromocao: newStatus,
        precoPromocional: newStatus && targetPromoPrice ? targetPromoPrice : undefined,
        updatedAt: now,
      };
    }
    return m;
  });
  notifySubscribers(updatedList);

  try {
    const motoDocRef = doc(db, 'motos', id);
    await setDoc(
      motoDocRef,
      sanitizeForFirestore({
        emPromocao: newStatus,
        precoPromocional: newStatus && targetPromoPrice ? targetPromoPrice : null,
        updatedAt: now,
      }),
      { merge: true }
    );
  } catch (err) {
    console.error('Firestore togglePromotion error:', err);
  }
}

/**
 * Reset and re-seed Firestore with default catalog
 */
export async function resetToDefaultMotos(): Promise<void> {
  notifySubscribers(INITIAL_MOTOS);

  try {
    const snapshot = await getDocs(collection(db, 'motos'));
    const batch = writeBatch(db);
    snapshot.forEach((d) => batch.delete(d.ref));
    INITIAL_MOTOS.forEach((m) => {
      batch.set(doc(db, 'motos', m.id), sanitizeForFirestore(m));
    });
    await batch.commit();
  } catch (e) {
    console.warn('Error resetting Firestore motos:', e);
  }
}

export const motoService = {
  getMotos,
  subscribe: subscribeToMotoUpdates,
  addMoto,
  updateMoto,
  deleteMoto,
  togglePromotion,
  resetToDefaults: resetToDefaultMotos,
};

// Utilities
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKM(km: number): string {
  if (km === 0) return '0 KM (Zero)';
  return `${new Intl.NumberFormat('pt-BR').format(km)} km`;
}

// Financing simulation calculation
export function calculateInstallment(
  valorMoto: number,
  valorEntrada: number,
  prazoMeses: number,
  taxaJurosMensal: number = 0.0179 // 1.79% a.m.
): { valorFinanciado: number; valorParcela: number; totalPago: number } {
  const valorFinanciado = Math.max(0, valorMoto - valorEntrada);
  if (valorFinanciado <= 0) {
    return { valorFinanciado: 0, valorParcela: 0, totalPago: valorEntrada };
  }

  // Tabela Price Formula: PMT = PV * [i * (1 + i)^n] / [(1 + i)^n - 1]
  const i = taxaJurosMensal;
  const n = prazoMeses;
  const fator = Math.pow(1 + i, n);
  const valorParcela = (valorFinanciado * (i * fator)) / (fator - 1);
  const totalPago = valorEntrada + valorParcela * n;

  return {
    valorFinanciado,
    valorParcela: Math.round(valorParcela),
    totalPago: Math.round(totalPago),
  };
}

export const calculateFinancing = calculateInstallment;

// WhatsApp link generators
export function getMotoDirectUrl(motoId: string): string {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    const pathname = window.location.pathname || '/';
    return `${origin}${pathname}?moto=${encodeURIComponent(motoId)}`;
  }
  return `https://top-motos.vercel.app/?moto=${encodeURIComponent(motoId)}`;
}

export function getWhatsAppVendorUrl(moto: Moto): string {
  const precoEfetivo = moto.emPromocao && moto.precoPromocional ? moto.precoPromocional : moto.preco;
  const precoTexto = formatCurrency(precoEfetivo);
  const linkDireto = getMotoDirectUrl(moto.id);

  const text = `Olá TOP MOTOS! Vi a moto *${moto.modelo}* (${moto.ano} - ${moto.marca}) no catálogo por *${precoTexto}* e tenho interesse em comprar/negociar.

🏍️ *Veículo:* ${moto.marca} ${moto.modelo} (${moto.ano})
💰 *Valor:* ${precoTexto}
📊 *KM:* ${formatKM(moto.quilometragem)}
🔗 *Acessar essa moto no site:*
${linkDireto}

Poderiam me passar mais informações e condições?`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppFinancingUrl(sim: FinancingSimulation): string {
  const linkDireto = getMotoDirectUrl(sim.motoId);
  const text = `Olá TOP MOTOS! Realizei uma *Simulação de Financiamento Online* no site e gostaria de formalizar a proposta:

🏍️ *Moto Selecionada:* ${sim.motoNome}
💵 *Entrada Informada:* ${formatCurrency(sim.valorEntrada)}
📅 *Plano Desejado:* ${sim.prazoMeses}x de ${formatCurrency(sim.valorParcela)}
👤 *Nome do Cliente:* ${sim.nome}
📄 *CPF:* ${sim.cpf}
🔗 *Link Direto da Moto:*
${linkDireto}

Aguardo retorno para aprovação cadastral!`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppServiceUrl(
  serviceType: 'assistencia' | 'compramos_sua_moto',
  detalhesCliente?: string
): string {
  if (serviceType === 'assistencia') {
    const text = `Olá TOP MOTOS! Gostaria de agendar um serviço na *Assistência Técnica Especializada* (Revisão, Manutenção ou Troca de Peças).
${detalhesCliente ? `\n📋 *Detalhes do Agendamento:*\n${detalhesCliente}\n` : ''}
Como podemos prosseguir com o agendamento?`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  } else {
    const text = `Olá TOP MOTOS! Tenho interesse na opção *Compramos sua Moto* e gostaria de receber uma avaliação justa e proposta para o meu veículo.
${detalhesCliente ? `\n📋 *Detalhes da Moto / Cliente:*\n${detalhesCliente}\n` : ''}
Como podemos prosseguir com a avaliação?`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  }
}
