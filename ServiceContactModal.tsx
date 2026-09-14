import React, { useState } from 'react';
import { getWhatsAppServiceUrl } from '../services/motoService';
import { X, Wrench, DollarSign, Send, Calendar, Bike } from 'lucide-react';

interface ServiceContactModalProps {
  type: 'assistencia' | 'compramos_sua_moto' | null;
  onClose: () => void;
}

export const ServiceContactModal: React.FC<ServiceContactModalProps> = ({
  type,
  onClose,
}) => {
  const [nome, setNome] = useState('');
  const [detalhesMoto, setDetalhesMoto] = useState('');
  const [dataDesejada, setDataDesejada] = useState('');

  if (!type) return null;

  const isAssistencia = type === 'assistencia';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const info = `Cliente: ${nome} | Modelo/Detalhes: ${detalhesMoto} ${dataDesejada ? `| Data Desejada: ${dataDesejada}` : ''}`;
    const url = getWhatsAppServiceUrl(type, info);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-md bg-[#101016] border border-[#272738] rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-[#181822] text-[#a1a1aa] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
            isAssistencia ? 'bg-red-950/40 text-[#e60012] border border-red-800/60' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/60'
          }`}>
            {isAssistencia ? <Wrench className="w-7 h-7" /> : <DollarSign className="w-7 h-7" />}
          </div>
          <div>
            <span className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
              ATENDIMENTO DIRETO
            </span>
            <h2 className="text-2xl font-black font-racing italic tracking-tight text-white uppercase">
              {isAssistencia ? 'ASSISTÊNCIA TÉCNICA' : 'COMPRAMOS SUA MOTO'}
            </h2>
            <p className="text-xs text-[#71717a] mt-1">
              {isAssistencia
                ? 'Agende sua revisão, manutenção preventiva ou troca de óleo'
                : 'Receba uma avaliação justa e proposta rápida pelo WhatsApp'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
              SEU NOME COMPLETO
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome..."
              className="w-full px-4 py-3 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none placeholder-[#52525b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
              {isAssistencia ? 'MODELO DA MOTO & SERVIÇO' : 'MODELO DA SUA MOTO, ANO E KM'}
            </label>
            <textarea
              rows={2}
              required
              value={detalhesMoto}
              onChange={(e) => setDetalhesMoto(e.target.value)}
              placeholder={isAssistencia ? 'Ex: Honda PCX 160 - Revisão periódica dos 10.000 km' : 'Ex: Yamaha Fazer 250 ano 2022 com 15.000 KM...'}
              className="w-full px-4 py-3 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none placeholder-[#52525b]"
            />
          </div>

          {isAssistencia && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                DATA PREFERENCIAL (OPCIONAL)
              </label>
              <input
                type="text"
                value={dataDesejada}
                onChange={(e) => setDataDesejada(e.target.value)}
                placeholder="Ex: Próxima terça-feira pela manhã"
                className="w-full px-4 py-3 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none placeholder-[#52525b]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#e60012] hover:bg-red-700 text-white font-racing font-black italic tracking-wider text-sm uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer mt-2"
          >
            <Send className="w-4 h-4 fill-white" />
            <span>{isAssistencia ? 'SOLICITAR AGENDAMENTO VIA WHATSAPP' : 'ENVIAR PARA AVALIAÇÃO VIA WHATSAPP'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
