import React from 'react';
import { Moto } from '../types';
import { formatCurrency, formatKM } from '../services/motoService';
import { Calendar, Gauge, ArrowRight, Flame, Sparkles } from 'lucide-react';

interface MotoCardProps {
  moto: Moto;
  onSelect: (moto: Moto) => void;
}

export const MotoCard: React.FC<MotoCardProps> = ({ moto, onSelect }) => {
  const mainPhoto = moto.fotos && moto.fotos.length > 0
    ? moto.fotos[0]
    : 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80';

  const precoEfetivo = moto.emPromocao && moto.precoPromocional ? moto.precoPromocional : moto.preco;

  return (
    <div
      id={`moto-card-${moto.id}`}
      onClick={() => onSelect(moto)}
      className="group cursor-pointer rounded-2xl bg-[#111117] hover:bg-[#161620] border border-[#222230] hover:border-red-600/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-950/20"
    >
      {/* Photo Container */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-[#181822]">
        <img
          src={mainPhoto}
          alt={moto.modelo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark overlay gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111117] via-transparent to-black/30 pointer-events-none"></div>

        {/* Stock Badge (Top-Left) */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#e60012] text-white text-[11px] font-racing font-bold tracking-wider uppercase shadow-md shadow-red-950/50">
            {moto.quantidadeEstoque} UN
          </span>
        </div>

        {/* Brand Badge (Top-Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {moto.emPromocao && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 text-black text-[11px] font-racing font-black tracking-wider uppercase animate-pulse shadow-md">
              <Flame className="w-3 h-3 fill-black" />
              <span>OFERTA</span>
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-[#e4e4e7] text-[11px] font-racing font-bold tracking-wider uppercase">
            {moto.marca}
          </span>
        </div>

        {/* Featured Tag (if applicable) */}
        {moto.destaque && !moto.emPromocao && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-400 text-[10px] font-racing font-semibold uppercase">
              <Sparkles className="w-3 h-3" />
              <span>DESTAQUE</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand Subheader */}
          <span className="text-[11px] font-racing font-bold text-[#e60012] tracking-widest uppercase">
            {moto.marca}
          </span>

          {/* Model Title */}
          <h3 className="font-racing font-bold italic text-base sm:text-lg text-white tracking-wide uppercase group-hover:text-red-400 transition-colors line-clamp-1 mt-0.5">
            {moto.modelo}
          </h3>

          {/* Year & Mileage row */}
          <div className="flex items-center gap-3 text-xs text-[#9ca3af] mt-2 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#71717a]" />
              <span>{moto.ano}</span>
            </div>
            <span className="text-[#3f3f4e]">•</span>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#71717a]" />
              <span>{formatKM(moto.quilometragem)}</span>
            </div>
          </div>
        </div>

        {/* Price & CTA Action */}
        <div className="pt-3 border-t border-[#1f1f2c] flex items-end justify-between">
          <div>
            <span className="block text-[10px] font-racing font-semibold text-[#71717a] uppercase tracking-wider">
              {moto.emPromocao ? 'DE ' + formatCurrency(moto.preco) + ' POR' : 'À VISTA'}
            </span>
            <span className="font-racing font-black text-xl sm:text-2xl text-white tracking-tight">
              {formatCurrency(precoEfetivo)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-racing font-bold text-[#e60012] group-hover:text-red-400 uppercase italic tracking-wider transition-colors">
            <span>VER</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
