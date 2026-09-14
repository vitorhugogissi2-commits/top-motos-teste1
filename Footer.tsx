import React from 'react';
import { WHATSAPP_PHONE, INSTAGRAM_HANDLE } from '../services/motoService';
import { MessageCircle, Instagram, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#08080b] border-t border-[#1e1e28] py-8 text-xs text-[#a1a1aa] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left side copyright & brand */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <div className="flex items-center gap-1 font-racing font-bold text-sm tracking-tight text-white">
            <span>TOP</span>
            <span className="text-[#e60012]">MOTOS</span>
          </div>
          <span className="hidden sm:inline text-[#3f3f4e]">|</span>
          <p className="text-[#71717a]">
            © 2026 - Premium Dealership. Todos os direitos reservados.
          </p>
        </div>

        {/* Center / Security badge */}
        <div className="hidden lg:flex items-center gap-2 text-[#52525b] text-[11px] font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
          <span>ESTOQUE CERTIFICADO E AUDITADO</span>
        </div>

        {/* Right side contact links */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 font-racing font-bold tracking-wider">
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            id="footer-whatsapp-link"
            className="flex items-center gap-2 text-[#22c55e] hover:text-emerald-400 transition-colors uppercase"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WHATSAPP: (43) 99146-3841</span>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            id="footer-instagram-link"
            className="flex items-center gap-2 text-[#f43f5e] hover:text-rose-400 transition-colors uppercase"
          >
            <Instagram className="w-4 h-4" />
            <span>INSTAGRAM: {INSTAGRAM_HANDLE}</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
