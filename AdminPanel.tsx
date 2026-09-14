import React, { useState } from 'react';
import { Moto, MotoCategory } from '../types';
import { formatCurrency, formatKM } from '../services/motoService';
import { MotoFormModal } from './MotoFormModal';
import { PromoManagerModal } from './PromoManagerModal';
import {
  Plus,
  Flame,
  LogOut,
  Edit2,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  Package,
  Sparkles,
  Zap,
  Clock,
  RotateCcw,
  Star,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface AdminPanelProps {
  motos: Moto[];
  onAddMoto: (moto: Omit<Moto, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateMoto: (id: string, updates: Partial<Moto>) => void;
  onDeleteMoto: (id: string) => void;
  onTogglePromo: (id: string, precoPromocional?: number) => void;
  onResetToDefaults: () => void;
  onLogout: () => void;
  onPreviewMoto: (moto: Moto) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  motos,
  onAddMoto,
  onUpdateMoto,
  onDeleteMoto,
  onTogglePromo,
  onResetToDefaults,
  onLogout,
  onPreviewMoto,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('TODAS');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPromoManagerOpen, setIsPromoManagerOpen] = useState(false);
  const [motoToEdit, setMotoToEdit] = useState<Moto | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered motos
  const filteredMotos = motos.filter((moto) => {
    if (selectedCategoryFilter !== 'TODAS' && moto.categoria !== selectedCategoryFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        moto.modelo.toLowerCase().includes(q) ||
        moto.marca.toLowerCase().includes(q) ||
        (moto.motor || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate statistics
  const stats = {
    total: motos.length,
    novas: motos.filter((m) => m.categoria === 'novas').length,
    seminovas: motos.filter((m) => m.categoria === 'seminovas').length,
    eletricas: motos.filter((m) => m.categoria === 'eletricas').length,
    promocoes: motos.filter((m) => m.emPromocao).length,
    totalUnidades: motos.reduce((acc, m) => acc + (m.quantidadeEstoque || 0), 0),
  };

  const handleOpenAdd = () => {
    setMotoToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (moto: Moto) => {
    setMotoToEdit(moto);
    setIsFormOpen(true);
  };

  const handleSaveForm = (motoData: Omit<Moto, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => {
    if (editId) {
      onUpdateMoto(editId, motoData);
    } else {
      onAddMoto(motoData);
    }
    setIsFormOpen(false);
    setMotoToEdit(null);
  };

  const handleConfirmDelete = (id: string) => {
    onDeleteMoto(id);
    setDeleteConfirmId(null);
  };

  const handleStockIncrement = (moto: Moto, delta: number) => {
    const newStock = Math.max(0, (moto.quantidadeEstoque || 0) + delta);
    onUpdateMoto(moto.id, { quantidadeEstoque: newStock });
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 flex-1">
      
      {/* Top Admin Header Bar (matching screenshot 4) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-3xl bg-[#111117] border border-[#262638] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-racing font-bold text-[#e60012] tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>PAINEL ADMINISTRATIVO & GESTÃO EM TEMPO REAL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-racing italic tracking-tight text-white uppercase mt-1">
            CONTROLE DE ESTOQUE TOP MOTOS
          </h1>
          <p className="text-xs text-[#71717a] mt-0.5">
            Sessão ativa: <span className="text-[#a1a1aa] font-mono">topmotos.painel@gmail.com</span> • Sincronização multi-telas Firestore ligada
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="admin-btn-promos"
            onClick={() => setIsPromoManagerOpen(true)}
            className="px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-racing font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
          >
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>GERENCIAR PROMOÇÕES ({stats.promocoes})</span>
          </button>

          <button
            id="admin-btn-add-moto"
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-xl bg-[#e60012] hover:bg-red-700 text-white font-racing font-black italic text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADICIONAR NOVA MOTO</span>
          </button>

          <button
            id="admin-btn-logout"
            onClick={onLogout}
            className="p-3 rounded-xl bg-[#181822] hover:bg-[#222230] border border-[#29293b] text-[#a1a1aa] hover:text-white transition-colors"
            title="Encerrar sessão de administrador"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="p-4 rounded-2xl bg-[#111117] border border-[#222230]">
          <span className="text-[10px] font-racing font-bold text-[#71717a] uppercase block">
            TOTAL VEÍCULOS
          </span>
          <p className="text-2xl font-racing font-black text-white mt-1">
            {stats.total} <span className="text-xs text-[#71717a] font-normal">modelos</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111117] border border-[#222230]">
          <span className="text-[10px] font-racing font-bold text-[#71717a] uppercase block">
            UNIDADES ESTOQUE
          </span>
          <p className="text-2xl font-racing font-black text-white mt-1">
            {stats.totalUnidades} <span className="text-xs text-[#71717a] font-normal">un</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111117] border border-[#222230]">
          <span className="text-[10px] font-racing font-bold text-red-500 uppercase block">
            0 KM (NOVAS)
          </span>
          <p className="text-2xl font-racing font-black text-white mt-1">
            {stats.novas}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111117] border border-[#222230]">
          <span className="text-[10px] font-racing font-bold text-blue-400 uppercase block">
            SEMINOVAS
          </span>
          <p className="text-2xl font-racing font-black text-white mt-1">
            {stats.seminovas}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111117] border border-[#222230]">
          <span className="text-[10px] font-racing font-bold text-emerald-400 uppercase block">
            ELÉTRICAS
          </span>
          <p className="text-2xl font-racing font-black text-white mt-1">
            {stats.eletricas}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
          <span className="text-[10px] font-racing font-bold text-amber-400 uppercase block flex items-center gap-1">
            <Flame className="w-3 h-3 fill-amber-400" />
            <span>EM PROMOÇÃO</span>
          </span>
          <p className="text-2xl font-racing font-black text-amber-400 mt-1">
            {stats.promocoes}
          </p>
        </div>

      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por modelo, marca..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#121218] border border-[#262638] rounded-xl text-xs text-white focus:outline-none focus:border-red-500 placeholder-[#52525b]"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['TODAS', 'novas', 'seminovas', 'eletricas'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-racing font-bold uppercase tracking-wider shrink-0 transition-colors ${
                selectedCategoryFilter === cat
                  ? 'bg-[#e60012] text-white'
                  : 'bg-[#15151e] text-[#a1a1aa] hover:text-white border border-[#252536]'
              }`}
            >
              {cat === 'novas' ? '0 KM' : cat === 'seminovas' ? 'SEMINOVAS' : cat === 'eletricas' ? 'ELÉTRICAS' : 'TODAS'}
            </button>
          ))}

          <button
            onClick={onResetToDefaults}
            title="Restaurar catálogo inicial para demonstração"
            className="p-2 rounded-xl bg-[#15151e] hover:bg-[#20202c] border border-[#252536] text-[#71717a] hover:text-white transition-colors shrink-0 ml-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Stock Table */}
      <div className="overflow-x-auto rounded-3xl bg-[#111117] border border-[#262638] shadow-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#20202e] bg-[#0d0d12] text-[10px] font-racing font-bold text-[#71717a] uppercase tracking-widest">
              <th className="py-4 px-4 sm:px-6">FOTO & MODELO</th>
              <th className="py-4 px-4">CATEGORIA & ANO</th>
              <th className="py-4 px-4 text-center">ESTOQUE</th>
              <th className="py-4 px-4">PREÇO & STATUS</th>
              <th className="py-4 px-4 text-center">DESTAQUE</th>
              <th className="py-4 px-4 sm:px-6 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2c]">
            {filteredMotos.length > 0 ? (
              filteredMotos.map((moto) => {
                const isPromo = moto.emPromocao;
                const precoEfetivo = isPromo && moto.precoPromocional ? moto.precoPromocional : moto.preco;

                return (
                  <tr
                    key={moto.id}
                    className="hover:bg-[#151520] transition-colors group"
                  >
                    {/* Photo & Model */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-[#28283a]">
                          <img
                            src={moto.fotos?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {isPromo && (
                            <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-racing font-bold text-[#e60012] uppercase tracking-wider block">
                            {moto.marca}
                          </span>
                          <h4 className="font-racing font-bold text-sm text-white truncate group-hover:text-red-400 transition-colors">
                            {moto.modelo}
                          </h4>
                          <span className="text-[11px] text-[#71717a]">
                            {moto.motor} • {formatKM(moto.quilometragem)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Year */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-racing font-bold uppercase tracking-wider bg-[#1c1c28] text-[#d4d4d8] border border-[#2d2d3e]">
                        {moto.categoria === 'novas' ? '0 KM NOVA' : moto.categoria === 'seminovas' ? 'SEMINOVA' : '100% ELÉTRICA'}
                      </span>
                      <span className="block text-xs font-racing text-[#a1a1aa] mt-1 font-semibold">
                        Ano {moto.ano}
                      </span>
                    </td>

                    {/* Stock Count with +/- inline adjustment */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-[#181824] px-2 py-1 rounded-xl border border-[#2c2c3e]">
                        <button
                          onClick={() => handleStockIncrement(moto, -1)}
                          className="w-6 h-6 rounded-lg bg-[#222232] hover:bg-red-950 text-[#a1a1aa] hover:text-red-400 flex items-center justify-center font-bold text-xs transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-racing font-black text-sm text-white">
                          {moto.quantidadeEstoque}
                        </span>
                        <button
                          onClick={() => handleStockIncrement(moto, 1)}
                          className="w-6 h-6 rounded-lg bg-[#222232] hover:bg-emerald-950 text-[#a1a1aa] hover:text-emerald-400 flex items-center justify-center font-bold text-xs transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Price & Promo Switch */}
                    <td className="py-4 px-4">
                      <div>
                        {isPromo ? (
                          <>
                            <span className="font-racing font-black text-sm text-amber-400 block">
                              {formatCurrency(precoEfetivo)}
                            </span>
                            <span className="text-[10px] text-[#71717a] line-through font-semibold">
                              {formatCurrency(moto.preco)}
                            </span>
                          </>
                        ) : (
                          <span className="font-racing font-black text-sm text-white block">
                            {formatCurrency(moto.preco)}
                          </span>
                        )}

                        <button
                          onClick={() => onTogglePromo(moto.id, moto.precoPromocional || Math.round(moto.preco * 0.9))}
                          className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-racing font-bold uppercase tracking-wider transition-colors ${
                            isPromo
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                              : 'bg-[#181822] text-[#71717a] hover:text-white border border-[#28283a]'
                          }`}
                        >
                          <Flame className={`w-3 h-3 ${isPromo ? 'fill-amber-400' : ''}`} />
                          <span>{isPromo ? 'Promoção Ativa' : '+ Promoção'}</span>
                        </button>
                      </div>
                    </td>

                    {/* Destaque Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => onUpdateMoto(moto.id, { destaque: !moto.destaque })}
                        className={`p-2 rounded-xl border transition-colors ${
                          moto.destaque
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                            : 'bg-[#181822] border-[#29293b] text-[#52525b] hover:text-white'
                        }`}
                        title="Alternar destaque na página inicial"
                      >
                        <Star className={`w-4 h-4 ${moto.destaque ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Actions: View, Edit, Delete */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        <button
                          onClick={() => onPreviewMoto(moto)}
                          title="Visualizar Detalhes"
                          className="p-2 rounded-xl bg-[#181822] hover:bg-[#252536] text-[#a1a1aa] hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(moto)}
                          title="Editar Motocicleta"
                          className="p-2 rounded-xl bg-[#181822] hover:bg-[#252536] text-[#a1a1aa] hover:text-amber-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {deleteConfirmId === moto.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleConfirmDelete(moto.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-racing font-bold text-[10px] uppercase shadow"
                            >
                              Confirmar?
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1.5 rounded-lg bg-[#222232] text-[#a1a1aa] hover:text-white text-[10px]"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(moto.id)}
                            title="Excluir do Estoque"
                            className="p-2 rounded-xl bg-[#181822] hover:bg-red-950/60 text-[#a1a1aa] hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#71717a]">
                  Nenhum veículo encontrado no filtro atual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Moto Modal */}
      <MotoFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setMotoToEdit(null);
        }}
        onSave={handleSaveForm}
        motoToEdit={motoToEdit}
      />

      {/* Promotion Batch Manager Modal */}
      <PromoManagerModal
        isOpen={isPromoManagerOpen}
        onClose={() => setIsPromoManagerOpen(false)}
        motos={motos}
        onTogglePromo={onTogglePromo}
      />

    </div>
  );
};
