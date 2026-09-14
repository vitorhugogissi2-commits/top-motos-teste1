import React, { useState } from 'react';
import { Moto } from '../types';
import { formatCurrency, formatKM, getWhatsAppVendorUrl, getMotoDirectUrl } from '../services/motoService';
import { X, Share2, Check, MessageSquare, Calculator, Calendar, Gauge, Zap, ShieldCheck, ChevronRight, Fuel, Droplet, Cog } from 'lucide-react';

interface MotoDetailModalProps {
  moto: Moto | null;
  onClose: () => void;
  onOpenFinancing: (moto: Moto) => void;
}

export const MotoDetailModal: React.FC<MotoDetailModalProps> = ({
  moto,
  onClose,
  onOpenFinancing,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!moto) return null;

  const photos = moto.fotos && moto.fotos.length > 0
    ? moto.fotos
    : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'];

  const currentPhoto = photos[selectedPhotoIndex] || photos[0];
  const precoEfetivo = moto.emPromocao && moto.precoPromocional ? moto.precoPromocional : moto.preco;

  const handleCopyLink = async () => {
    const url = getMotoDirectUrl(moto.id);
    if (typeof navigator !== 'undefined') {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2500);
        } catch {
          // fallback
        }
      }
    }
  };

  const categoryLabel = moto.categoria === 'novas'
    ? '0 KM DIRETO DE FÁBRICA'
    : moto.categoria === 'seminovas'
    ? 'SEMINOVA REVISADA'
    : '100% ELÉTRICA';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl bg-[#101016] border border-[#272738] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#20202e] bg-[#0c0c11]">
          
          {/* Brand and Category tag */}
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded bg-[#e60012] text-white text-xs font-racing font-bold tracking-wider uppercase">
              {moto.marca}
            </span>
            <span className="text-xs font-racing font-semibold text-[#a1a1aa] tracking-widest uppercase">
              {categoryLabel}
            </span>
          </div>

          {/* Action buttons (Share + Close) */}
          <div className="flex items-center gap-2">
            <button
              id="btn-copy-moto-link"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#232330] text-xs font-racing font-bold tracking-wider text-[#d4d4d8] border border-[#2a2a3c] transition-colors uppercase"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">COPIADO!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#a1a1aa]" />
                  <span>COPIAR LINK</span>
                </>
              )}
            </button>

            <button
              id="btn-close-moto-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#181822] hover:bg-[#232330] text-[#a1a1aa] hover:text-white border border-[#2a2a3c] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Grid: Photo Gallery Left / Info & Specs Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Photos */}
            <div className="md:col-span-6 space-y-3">
              {/* Main Photo Display */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#181824] border border-[#252536]">
                <img
                  src={currentPhoto}
                  alt={moto.modelo}
                  className="w-full h-full object-cover"
                />

                {/* Stock Tag Overlay (matching screenshot: ESTOQUE: 1 UNIDADE(S)) */}
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center px-3 py-1 rounded bg-black/85 backdrop-blur-sm border border-amber-500/40 text-amber-400 text-xs font-racing font-black tracking-widest uppercase">
                    ESTOQUE: {moto.quantidadeEstoque} UNIDADE(S)
                  </span>
                </div>

                {moto.emPromocao && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded bg-amber-500 text-black text-xs font-racing font-black tracking-widest uppercase shadow-lg">
                      🔥 OFERTA ESPECIAL
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails row if multiple */}
              {photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {photos.map((foto, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedPhotoIndex === idx ? 'border-red-600 scale-95' : 'border-[#272738] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={foto} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Title, Price, Quick Specs */}
            <div className="md:col-span-6 space-y-4">
              
              {/* Title & Description */}
              <div>
                <h2 className="font-racing font-black italic text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  {moto.modelo}
                </h2>
                <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed mt-2">
                  {moto.descricao}
                </p>
              </div>

              {/* Price Box (matching screenshot: PREÇO À VISTA ESPECIAL R$ 18.200) */}
              <div className="p-4 rounded-xl bg-[#161620] border border-[#262638] space-y-1">
                <span className="text-[10px] font-racing font-bold tracking-widest text-[#71717a] uppercase block">
                  {moto.emPromocao ? 'PREÇO PROMOCIONAL COM DESCONTO' : 'PREÇO À VISTA ESPECIAL'}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="font-racing font-black text-3xl sm:text-4xl text-[#f59e0b] tracking-tight">
                    {formatCurrency(precoEfetivo)}
                  </span>
                  {moto.emPromocao && (
                    <span className="text-sm font-racing text-[#71717a] line-through font-semibold">
                      {formatCurrency(moto.preco)}
                    </span>
                  )}
                </div>
              </div>

              {/* 2x2 Specs Grid (matching screenshot) */}
              <div className="grid grid-cols-2 gap-2.5">
                
                {/* ANO */}
                <div className="p-3 rounded-xl bg-[#14141c] border border-[#222230]">
                  <div className="flex items-center gap-1 text-[10px] font-racing font-bold text-[#71717a] uppercase tracking-wider">
                    <Calendar className="w-3 h-3 text-[#e60012]" />
                    <span>ANO</span>
                  </div>
                  <p className="font-racing font-bold text-sm sm:text-base text-white mt-1">
                    {moto.ano}
                  </p>
                </div>

                {/* QUILOMETRAGEM */}
                <div className="p-3 rounded-xl bg-[#14141c] border border-[#222230]">
                  <div className="flex items-center gap-1 text-[10px] font-racing font-bold text-[#71717a] uppercase tracking-wider">
                    <Gauge className="w-3 h-3 text-[#e60012]" />
                    <span>QUILOMETRAGEM</span>
                  </div>
                  <p className="font-racing font-bold text-sm sm:text-base text-white mt-1">
                    {formatKM(moto.quilometragem)}
                  </p>
                </div>

                {/* MOTOR / ALIMENTAÇÃO */}
                <div className="p-3 rounded-xl bg-[#14141c] border border-[#222230]">
                  <div className="flex items-center gap-1 text-[10px] font-racing font-bold text-[#71717a] uppercase tracking-wider">
                    <Zap className="w-3 h-3 text-[#e60012]" />
                    <span>MOTOR / ALIMENTAÇÃO</span>
                  </div>
                  <p className="font-racing font-bold text-xs sm:text-sm text-white mt-1 line-clamp-1">
                    {moto.motor}
                  </p>
                </div>

                {/* ESTILO / CATEGORIA */}
                <div className="p-3 rounded-xl bg-[#14141c] border border-[#222230]">
                  <div className="flex items-center gap-1 text-[10px] font-racing font-bold text-[#71717a] uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-[#e60012]" />
                    <span>ESTILO / CATEGORIA</span>
                  </div>
                  <p className="font-racing font-bold text-xs sm:text-sm text-white mt-1 line-clamp-1">
                    {moto.estilo}
                  </p>
                </div>

              </div>

              {/* Warranty Guarantee Banner */}
              <div className="p-3 rounded-xl bg-[#121c17] border border-emerald-900/40 flex items-center gap-2.5 text-xs text-emerald-400 font-racing font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Garantia Oficial: {moto.garantia}</span>
              </div>

            </div>

          </div>

          {/* Performance & Combustion Specs Section (matching screenshot 6) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-racing font-bold tracking-widest text-[#e60012] uppercase">
              <span className="w-4 h-4 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-[10px] text-red-400">
                ✓
              </span>
              <span>ESPECIFICAÇÕES DE COMBUSTÃO & DESEMPENHO</span>
              <span>🔧</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              
              <div className="p-3 rounded-xl bg-[#14141c] border border-[#222230]">
                <span className="text-[10px] font-racing font-bold text-[#71717a] uppercase block">
                  MOTORIZAÇÃO
                </span>
                <span className="font-racing font-bold text-xs text-[#e4e4e7] mt-1 block">
                  {moto.motor}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#14141c] border border-[#222230]">
                <span className="text-[10px] font-racing font-bold text-[#71717a] uppercase block">
                  COMBUSTÍVEL / ENERGIA
                </span>
                <span className="font-racing font-bold text-xs text-[#e4e4e7] mt-1 block">
                  {moto.combustivel}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#14141c] border border-[#222230]">
                <span className="text-[10px] font-racing font-bold text-[#71717a] uppercase block">
                  TANQUE / BATERIA
                </span>
                <span className="font-racing font-bold text-xs text-[#e4e4e7] mt-1 block">
                  {moto.tanqueCombustivel || 'Consulte'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#14141c] border border-[#222230]">
                <span className="text-[10px] font-racing font-bold text-[#71717a] uppercase block">
                  CONSUMO MÉDIO
                </span>
                <span className="font-racing font-bold text-xs text-[#e4e4e7] mt-1 block">
                  {moto.consumoMedio || 'Consulte'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#14141c] border border-[#222230] col-span-2 sm:col-span-1">
                <span className="text-[10px] font-racing font-bold text-[#71717a] uppercase block">
                  CÂMBIO / TRANSMISSÃO
                </span>
                <span className="font-racing font-bold text-xs text-[#e4e4e7] mt-1 block">
                  {moto.cambio || 'Manual'}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom CTA Bar (matching screenshot) */}
        <div className="p-4 sm:p-5 bg-[#0c0c11] border-t border-[#20202e] grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Direct Vendor WhatsApp Button */}
          <a
            href={getWhatsAppVendorUrl(moto)}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-whatsapp-vendor"
            className="w-full py-3.5 px-4 rounded-xl bg-[#e60012] hover:bg-red-700 text-white font-racing font-black italic tracking-wider text-sm uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-all text-center"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>FALAR DIRETO COM VENDEDOR</span>
          </a>

          {/* Simulate Financing Button */}
          <button
            id="btn-open-financing-simulator"
            onClick={() => onOpenFinancing(moto)}
            className="w-full py-3.5 px-4 rounded-xl bg-[#161620] hover:bg-[#20202c] text-white border border-[#2d2d3f] hover:border-[#404058] font-racing font-bold tracking-wider text-sm uppercase flex items-center justify-center gap-2 transition-all text-center"
          >
            <Calculator className="w-4 h-4 text-[#e60012]" />
            <span>SIMULAR FINANCIAMENTO</span>
          </button>

        </div>

      </div>
    </div>
  );
};
