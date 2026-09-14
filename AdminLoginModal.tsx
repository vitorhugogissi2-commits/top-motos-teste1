import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, AlertTriangle, X, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const ADMIN_EMAIL_REQUIRED = 'topmotos.painel@gmail.com';
export const ADMIN_PASSWORD_REQUIRED = 'topmotospainel 230301';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (cleanEmail === ADMIN_EMAIL_REQUIRED.toLowerCase() && cleanPassword === ADMIN_PASSWORD_REQUIRED) {
        setIsLoading(false);
        onLoginSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setErrorMsg('E-mail ou senha incorretos! Verifique as credenciais de administrador.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0f0f15] border border-[#272738] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-[#181822] text-[#a1a1aa] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-center mx-auto text-[#e60012] shadow-lg shadow-red-950/30">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-racing font-bold text-[#e60012] tracking-widest uppercase block">
              ÁREA RESTRITA & GESTÃO
            </span>
            <h2 className="text-2xl font-black font-racing italic tracking-tight text-white uppercase">
              PAINEL ADMINISTRATIVO
            </h2>
            <p className="text-xs text-[#71717a] mt-1">
              Acesso exclusivo para controle de estoque e promoções
            </p>
          </div>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-700 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* E-mail input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
              E-MAIL DO ADMINISTRADOR
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="w-full pl-10 pr-4 py-3 bg-[#161620] border border-[#272738] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white placeholder-[#52525b] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Senha input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
              SENHA DE ACESSO
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full pl-10 pr-4 py-3 bg-[#161620] border border-[#272738] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white placeholder-[#52525b] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            id="btn-submit-admin-login"
            className="w-full py-3.5 rounded-xl bg-[#e60012] hover:bg-red-700 disabled:bg-red-900 text-white font-racing font-black italic tracking-wider text-sm uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer mt-2"
          >
            {isLoading ? (
              <span>VERIFICANDO...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>ENTRAR NO PAINEL</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
