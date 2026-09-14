import React from 'react';
import { Moto, PageView } from '../types';
import { Wrench, DollarSign, ArrowRight, Flame, Zap } from 'lucide-react';

interface HomePageProps {
  motos: Moto[];
  onNavigate: (page: PageView) => void;
  onOpenServiceModal: (type: 'assistencia' | 'compramos_sua_moto') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  motos,
  onNavigate,
  onOpenServiceModal,
}) => {
  const novasCount = motos.filter((m) => m.categoria === 'novas').length;
  const seminovasCount = motos.filter((m) => m.categoria === 'seminovas').length;
  const eletricasCount = motos.filter((m) => m.categoria === 'eletricas').length;
  const promosCount = motos.filter((m) => m.emPromocao).length;

  return (
    <div className="flex-1 flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      
      {/* Top Hero Section */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        
        {/* Catálogo Interativo Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#16161e] border border-[#2a2a3a] text-xs font-racing font-semibold text-[#d4d4d8] tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e60012] animate-pulse"></span>
          <span>CATÁLOGO INTERATIVO 2026</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-1">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-racing italic tracking-tighter uppercase select-none">
            <span className="text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.05)]">TOP</span>
            <span className="text-[#e60012] drop-shadow-[0_0_35px_rgba(230,0,18,0.4)] ml-2">MOTOS</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-racing font-bold tracking-[0.35em] text-[#a1a1aa] uppercase">
            PREMIUM DEALERSHIP
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-[#a1a1aa] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Selecione uma das opções abaixo para explorar nosso estoque exclusivo.
          <br className="hidden sm:inline" /> Atendimento imediato e simulações rápidas direto pelo WhatsApp.
        </p>

        {/* Quick Action Cards (Assistência Técnica / Compramos sua Moto) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-2xl mx-auto">
          
          <button
            id="btn-assistencia-tecnica"
            onClick={() => onOpenServiceModal('assistencia')}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#121218] hover:bg-[#181822] border border-[#232330] hover:border-[#38384d] transition-all text-left group shadow-lg cursor-pointer"
          >
            <div className="p-3 rounded-lg bg-[#1a1a24] text-[#a1a1aa] group-hover:text-[#e60012] group-hover:bg-[#252533] transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-racing font-bold text-sm sm:text-base tracking-wide text-white uppercase group-hover:text-red-400 transition-colors">
                ASSISTÊNCIA TÉCNICA
              </h4>
              <p className="text-xs text-[#71717a] group-hover:text-[#a1a1aa] flex items-center gap-1 font-medium mt-0.5">
                <span>AGENDE SEU SERVIÇO</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </button>

          <button
            id="btn-compramos-sua-moto"
            onClick={() => onOpenServiceModal('compramos_sua_moto')}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#121218] hover:bg-[#181822] border border-[#232330] hover:border-[#38384d] transition-all text-left group shadow-lg cursor-pointer"
          >
            <div className="p-3 rounded-lg bg-[#1a1a24] text-emerald-500 group-hover:bg-[#252533] transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-racing font-bold text-sm sm:text-base tracking-wide text-white uppercase group-hover:text-emerald-400 transition-colors">
                COMPRAMOS SUA MOTO
              </h4>
              <p className="text-xs text-[#71717a] group-hover:text-[#a1a1aa] flex items-center gap-1 font-medium mt-0.5">
                <span>AVALIAÇÃO E PROPOSTA</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* Category Cards (Dynamically adjusts to 4 cards when promotion is active, or 3 cards when disabled) */}
      <div className={`grid ${promosCount > 0 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'} gap-5 my-8`}>
        
        {/* 01 - NOVAS */}
        <div
          id="category-card-novas"
          onClick={() => onNavigate('novas')}
          className="cursor-pointer group relative overflow-hidden rounded-2xl bg-[#121218] hover:bg-[#171720] border border-[#242433] hover:border-red-600/50 p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 shadow-xl hover:shadow-red-950/20"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-racing font-semibold text-[#71717a] tracking-widest uppercase">
              <span>01 / CATEGORIA</span>
              <span className="text-[#a1a1aa] bg-[#1a1a24] px-2 py-0.5 rounded-full border border-[#2b2b3b]">
                {novasCount} MODELOS
              </span>
            </div>
            
            <div className="mt-3">
              <h3 className="font-racing font-black italic text-3xl sm:text-4xl text-white tracking-wider uppercase group-hover:text-red-500 transition-colors">
                NOVAS
              </h3>
              <div className="h-1 w-12 bg-[#e60012] mt-2 mb-3 group-hover:w-20 transition-all duration-300"></div>
            </div>

            <p className="text-[#9ca3af] text-xs sm:text-sm leading-relaxed">
              Modelos zero quilômetro direto de fábrica com tecnologia de ponta.
            </p>
          </div>

          <div className="pt-6 flex items-center gap-2 text-xs font-racing font-bold text-white tracking-wider uppercase group-hover:text-red-400">
            <span>EXPLORAR CATÁLOGO</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#e60012]" />
          </div>
        </div>

        {/* 02 - SEMINOVAS */}
        <div
          id="category-card-seminovas"
          onClick={() => onNavigate('seminovas')}
          className="cursor-pointer group relative overflow-hidden rounded-2xl bg-[#121218] hover:bg-[#171720] border border-[#242433] hover:border-red-600/50 p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 shadow-xl hover:shadow-red-950/20"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-racing font-semibold text-[#71717a] tracking-widest uppercase">
              <span>02 / CATEGORIA</span>
              <span className="text-[#a1a1aa] bg-[#1a1a24] px-2 py-0.5 rounded-full border border-[#2b2b3b]">
                {seminovasCount} MODELOS
              </span>
            </div>
            
            <div className="mt-3">
              <h3 className="font-racing font-black italic text-3xl sm:text-4xl text-white tracking-wider uppercase group-hover:text-red-500 transition-colors">
                SEMINOVAS
              </h3>
              <div className="h-1 w-12 bg-[#e60012] mt-2 mb-3 group-hover:w-20 transition-all duration-300"></div>
            </div>

            <p className="text-[#9ca3af] text-xs sm:text-sm leading-relaxed">
              Seleção rigorosa de seminovas totalmente revisadas e com garantia.
            </p>
          </div>

          <div className="pt-6 flex items-center gap-2 text-xs font-racing font-bold text-white tracking-wider uppercase group-hover:text-red-400">
            <span>VER ESTOQUE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#e60012]" />
          </div>
        </div>

        {/* 03 - ELÉTRICAS */}
        <div
          id="category-card-eletricas"
          onClick={() => onNavigate('eletricas')}
          className="cursor-pointer group relative overflow-hidden rounded-2xl bg-[#121218] hover:bg-[#171720] border border-[#242433] hover:border-red-600/50 p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 shadow-xl hover:shadow-red-950/20"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-racing font-semibold text-[#71717a] tracking-widest uppercase">
              <span>03 / CATEGORIA</span>
              <span className="text-[#a1a1aa] bg-[#1a1a24] px-2 py-0.5 rounded-full border border-[#2b2b3b]">
                {eletricasCount} MODELOS
              </span>
            </div>
            
            <div className="mt-3">
              <h3 className="font-racing font-black italic text-3xl sm:text-4xl text-white tracking-wider uppercase group-hover:text-red-500 transition-colors">
                ELÉTRICAS
              </h3>
              <div className="h-1 w-12 bg-[#e60012] mt-2 mb-3 group-hover:w-20 transition-all duration-300"></div>
            </div>

            <p className="text-[#9ca3af] text-xs sm:text-sm leading-relaxed">
              Futuro da mobilidade inteligente, zero emissões e máxima economia.
            </p>
          </div>

          <div className="pt-6 flex items-center gap-2 text-xs font-racing font-bold text-white tracking-wider uppercase group-hover:text-red-400">
            <span>FUTURO DA MOBILIDADE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#e60012]" />
          </div>
        </div>

        {/* 04 - PROMOÇÃO (Rendered ONLY when promotion is activated: promosCount > 0) */}
        {promosCount > 0 && (
          <div
            id="category-card-promocao"
            onClick={() => onNavigate('promocoes')}
            className="cursor-pointer group relative overflow-hidden rounded-2xl bg-[#141009] hover:bg-[#1a140c] border-2 border-amber-500 hover:border-amber-400 p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 shadow-xl shadow-amber-950/30 hover:shadow-amber-900/40 animate-in fade-in zoom-in-95 duration-200"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-racing font-bold tracking-widest uppercase text-amber-400">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                  <span>04 / PROMOÇÃO</span>
                </div>
                <span className="text-black bg-amber-500 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {promosCount} ON
                </span>
              </div>
              
              <div className="mt-3">
                <h3 className="font-racing font-black italic text-3xl sm:text-4xl text-amber-400 tracking-wider uppercase group-hover:text-amber-300 transition-colors">
                  PROMOÇÃO
                </h3>
                <div className="h-1 w-12 bg-amber-500 mt-2 mb-3 group-hover:w-20 transition-all duration-300"></div>
              </div>

              <p className="text-[#a1a1aa] text-xs sm:text-sm leading-relaxed">
                Motos com descontos especiais aplicados pelo painel em tempo real.
              </p>
            </div>

            <div className="pt-6 flex items-center gap-1.5 text-xs font-racing font-bold text-amber-400 tracking-wider uppercase group-hover:text-amber-300">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>VER PROMOÇÕES</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-amber-400 ml-0.5" />
            </div>
          </div>
        )}

      </div>

      {/* Bottom Value Props Banner Strip */}
      <div className="pt-2 pb-4">
        <div className="max-w-4xl mx-auto rounded-xl bg-[#101016] border border-[#20202c] py-3.5 px-4 sm:px-8 flex flex-wrap items-center justify-around gap-4 text-xs font-racing font-bold tracking-widest text-[#a1a1aa] uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e60012]"></span>
            <span>ATENDIMENTO ESPECIALIZADO</span>
          </div>
          <span className="hidden sm:inline text-[#2e2e3e]">•</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e60012]"></span>
            <span>ENVIO DAS PROPOSTAS ONLINE</span>
          </div>
          <span className="hidden sm:inline text-[#2e2e3e]">•</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e60012]"></span>
            <span>GARANTIA & LAUDO APROVADO</span>
          </div>
        </div>
      </div>

    </div>
  );
};
