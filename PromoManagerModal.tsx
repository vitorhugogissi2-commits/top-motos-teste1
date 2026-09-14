import React, { useState } from 'react';
import { Moto } from '../types';
import { formatCurrency } from '../services/motoService';
import { X, Flame, Check, AlertCircle, Percent } from 'lucide-react';

interface PromoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  motos: Moto[];
  onTogglePromo: (id: string, precoPromocional?: number) => void;
}

export const PromoManagerModal: React.FC<PromoManagerModalProps> = ({
  isOpen,
  onClose,
  motos,
  onTogglePromo,
}) => {
  const [discountPercent, setDiscountPercent] = useState<number>(10);

  if (!isOpen) return null;

  const handleApplyBatchDiscount = () => {
    motos.forEach((moto) => {
      if (!moto.emPromocao) {
        const promoPrice = Math.round(moto.preco * (1 - discountPercent / 100));
        onTogglePromo(moto.id, promoPrice);
      }
    });
  };

  const handleClearAllPromos = () => {
    motos.forEach((moto) => {
      if (moto.emPromocao) {
        onTogglePromo(moto.id);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-[#101016] border border-[#272738] rounded-3xl p-6 shadow-2xl shadow-black/80 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#20202e]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="font-racing font-black italic text-xl text-white uppercase tracking-tight">
                GERENCIADOR DE PROMOÇÕES E OFERTAS
              </h2>
              <p className="text-xs text-[#71717a]">
                Ative ou desative ofertas especiais com atualização instantânea no catálogo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#181822] text-[#a1a1aa] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Batch Actions */}
        <div className="my-4 p-4 rounded-2xl bg-[#151520] border border-[#262638] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Percent className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="font-racing font-bold text-white uppercase block">
                Aplicar Desconto Rápido:
              </span>
              <span className="text-[#71717a]">Selecione a porcentagem para lote</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
              {[5, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDiscountPercent(pct)}
                  className={`px-2 py-1 rounded-lg text-xs font-racing font-bold ${
                    discountPercent === pct
                      ? 'bg-amber-500 text-black'
                      : 'bg-[#1f1f2c] text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleApplyBatchDiscount}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-racing font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              Ativar em Todas
            </button>
            <button
              onClick={handleClearAllPromos}
              className="px-3.5 py-2 rounded-xl bg-[#20202d] hover:bg-[#2b2b3d] text-[#a1a1aa] hover:text-white text-xs font-racing font-bold uppercase tracking-wider transition-colors"
            >
              Limpar Ofertas
            </button>
          </div>
        </div>

        {/* List of Motorcycles with Promo Toggles */}
        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
          {motos.map((moto) => {
            const precoOriginal = moto.preco;
            const precoPromocional = moto.precoPromocional || Math.round(moto.preco * 0.9);

            return (
              <div
                key={moto.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  moto.emPromocao
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-[#13131a] border-[#222230]'
                }`}
              >
                {/* Moto thumb and name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-11 rounded-lg overflow-hidden bg-black shrink-0 border border-[#2a2a3c]">
                    <img
                      src={moto.fotos?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-racing font-bold text-[#e60012] uppercase tracking-wider block">
                      {moto.marca}
                    </span>
                    <h4 className="font-racing font-bold text-sm text-white truncate">
                      {moto.modelo}
                    </h4>
                    <span className="text-xs text-[#71717a]">
                      Preço Normal: {formatCurrency(precoOriginal)}
                    </span>
                  </div>
                </div>

                {/* Promo State & Action */}
                <div className="flex items-center gap-3 shrink-0">
                  {moto.emPromocao ? (
                    <div className="text-right">
                      <span className="text-[10px] font-racing text-amber-400 font-bold uppercase block">
                        EM PROMOÇÃO
                      </span>
                      <span className="font-racing font-black text-sm text-amber-400">
                        {formatCurrency(precoPromocional)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[#71717a] font-racing font-semibold uppercase">
                      Sem Desconto
                    </span>
                  )}

                  <button
                    onClick={() => onTogglePromo(moto.id, precoPromocional)}
                    className={`px-4 py-2 rounded-xl text-xs font-racing font-bold uppercase tracking-wider transition-all ${
                      moto.emPromocao
                        ? 'bg-red-950 text-red-400 border border-red-800 hover:bg-red-900'
                        : 'bg-[#1f1f2c] text-white hover:bg-amber-500 hover:text-black'
                    }`}
                  >
                    {moto.emPromocao ? 'Desativar' : 'Ativar Promoção'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#20202e] flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#e60012] hover:bg-red-700 text-white text-xs font-racing font-bold uppercase tracking-wider"
          >
            CONCLUIR E FECHAR
          </button>
        </div>

      </div>
    </div>
  );
};
