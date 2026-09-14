import React, { useState, useEffect, useMemo } from 'react';
import { Moto, FinancingSimulation } from '../types';
import { calculateInstallment, formatCurrency, getWhatsAppFinancingUrl } from '../services/motoService';
import { X, Calculator, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface FinancingModalProps {
  isOpen: boolean;
  onClose: () => void;
  motos: Moto[];
  initialMoto?: Moto | null;
}

export const FinancingModal: React.FC<FinancingModalProps> = ({
  isOpen,
  onClose,
  motos,
  initialMoto,
}) => {
  const [selectedMotoId, setSelectedMotoId] = useState<string>('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [valorEntrada, setValorEntrada] = useState<number>(0);
  const [prazoMeses, setPrazoMeses] = useState<number>(48);
  const [errorMsg, setErrorMsg] = useState('');

  // Set selected moto when modal opens or initialMoto changes
  useEffect(() => {
    if (initialMoto) {
      setSelectedMotoId(initialMoto.id);
      const preco = initialMoto.emPromocao && initialMoto.precoPromocional ? initialMoto.precoPromocional : initialMoto.preco;
      // Default 20% down payment
      setValorEntrada(Math.round(preco * 0.2));
    } else if (motos.length > 0 && !selectedMotoId) {
      setSelectedMotoId(motos[0].id);
      const preco = motos[0].emPromocao && motos[0].precoPromocional ? motos[0].precoPromocional : motos[0].preco;
      setValorEntrada(Math.round(preco * 0.2));
    }
  }, [initialMoto, motos]);

  // Selected moto entity
  const currentMoto = useMemo(() => {
    return motos.find((m) => m.id === selectedMotoId) || motos[0] || null;
  }, [motos, selectedMotoId]);

  const valorMoto = currentMoto
    ? currentMoto.emPromocao && currentMoto.precoPromocional
      ? currentMoto.precoPromocional
      : currentMoto.preco
    : 0;

  // When moto changes, adjust down payment if exceeds
  const handleSelectMoto = (motoId: string) => {
    setSelectedMotoId(motoId);
    const moto = motos.find((m) => m.id === motoId);
    if (moto) {
      const preco = moto.emPromocao && moto.precoPromocional ? moto.precoPromocional : moto.preco;
      setValorEntrada(Math.round(preco * 0.2));
    }
  };

  // Mask CPF input (000.000.000-00)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 9) {
      formatted = raw.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
    } else if (raw.length > 6) {
      formatted = raw.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
    } else if (raw.length > 3) {
      formatted = raw.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
    }
    setCpf(formatted);
  };

  // Calculation of installment
  const calculation = useMemo(() => {
    return calculateInstallment(valorMoto, valorEntrada, prazoMeses);
  }, [valorMoto, valorEntrada, prazoMeses]);

  // Submit simulation to WhatsApp
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }
    if (cpf.length < 14) {
      setErrorMsg('Por favor, digite um CPF válido com 11 dígitos.');
      return;
    }
    if (!currentMoto) {
      setErrorMsg('Selecione uma motocicleta.');
      return;
    }

    setErrorMsg('');

    const simulation: FinancingSimulation = {
      nome,
      cpf,
      motoId: currentMoto.id,
      motoNome: `${currentMoto.marca} - ${currentMoto.modelo}`,
      valorMoto,
      valorEntrada,
      prazoMeses,
      valorParcela: calculation.valorParcela,
      taxaMensal: 1.69,
    };

    const url = getWhatsAppFinancingUrl(simulation);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Box (styled with dark theme & red borders matching screenshot 7) */}
      <div className="relative z-10 w-full max-w-md bg-[#0e0e14] border-2 border-red-600/60 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-red-950/40 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-[#1b1b24] text-[#a1a1aa] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1b1216] border border-red-600/40 flex items-center justify-center mx-auto text-[#e60012]">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-racing font-bold text-[#e60012] tracking-widest uppercase block">
              SIMULAÇÃO ONLINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-racing italic tracking-tight text-white uppercase">
              FINANCIAMENTO:
            </h2>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Simulation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* NOME COMPLETO */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
              NOME COMPLETO
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-3 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-sm text-white placeholder-[#52525b] focus:outline-none transition-colors"
            />
          </div>

          {/* CPF */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
              CPF
            </label>
            <input
              type="text"
              required
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              className="w-full px-4 py-3 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-sm font-mono text-white placeholder-[#52525b] focus:outline-none transition-colors"
            />
          </div>

          {/* MODELO DA MOTO */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
              MODELO DA MOTO
            </label>
            <select
              value={selectedMotoId}
              onChange={(e) => handleSelectMoto(e.target.value)}
              className="w-full px-4 py-3 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm font-racing font-bold text-white uppercase focus:outline-none cursor-pointer"
            >
              {motos.map((moto) => {
                const p = moto.emPromocao && moto.precoPromocional ? moto.precoPromocional : moto.preco;
                return (
                  <option key={moto.id} value={moto.id}>
                    {moto.marca} - {moto.modelo} ({formatCurrency(p)})
                  </option>
                );
              })}
            </select>
          </div>

          {/* VALOR DA ENTRADA */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase">
                VALOR DA ENTRADA
              </label>
              {/* Quick % chips */}
              <div className="flex items-center gap-1">
                {[0.1, 0.2, 0.3, 0.5].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setValorEntrada(Math.round(valorMoto * pct))}
                    className="px-1.5 py-0.5 rounded bg-[#1e1e2c] hover:bg-[#2c2c3e] text-[10px] font-racing font-bold text-[#a1a1aa] hover:text-white"
                  >
                    {pct * 100}%
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-racing font-bold text-sm text-[#e60012]">
                R$
              </span>
              <input
                type="number"
                min="0"
                max={valorMoto}
                value={valorEntrada}
                onChange={(e) => setValorEntrada(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-sm font-bold text-white focus:outline-none"
              />
            </div>
          </div>

          {/* PRAZO */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
              PRAZO
            </label>
            <select
              value={prazoMeses}
              onChange={(e) => setPrazoMeses(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm font-racing font-bold text-white uppercase focus:outline-none cursor-pointer"
            >
              <option value="12">12x Parcelas</option>
              <option value="24">24x Parcelas</option>
              <option value="36">36x Parcelas</option>
              <option value="48">48x Parcelas</option>
              <option value="60">60x Parcelas</option>
            </select>
          </div>

          {/* Live Calculation Output Card (matching screenshot 7) */}
          <div className="p-4 rounded-2xl bg-[#14141d] border border-[#252536] text-center space-y-1 my-2">
            <div className="text-base sm:text-lg font-racing font-black text-red-500 tracking-wide">
              Estimativa: {prazoMeses}x de {formatCurrency(calculation.valorParcela)}
            </div>
            <p className="text-[11px] text-[#71717a]">
              Aprovação rápida com atendimento direto no WhatsApp
            </p>
          </div>

          {/* Send Simulation Button */}
          <button
            type="submit"
            id="btn-send-financing-simulation"
            className="w-full py-4 rounded-xl bg-[#e60012] hover:bg-red-700 text-white font-racing font-black italic tracking-wider text-sm uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 fill-white" />
            <span>ENVIAR SIMULAÇÃO</span>
          </button>

        </form>

      </div>
    </div>
  );
};
