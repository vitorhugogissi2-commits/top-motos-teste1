import React, { useState } from 'react';
import { PageView } from '../types';
import { Menu, X, Shield, LogOut, Radio, Gauge, Zap, Flame, Home } from 'lucide-react';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  promosCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onAdminLogout,
  promosCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageView; label: string; icon?: React.ReactNode }[] = [
    { id: 'inicio', label: 'INÍCIO', icon: <Home className="w-4 h-4" /> },
    { id: 'novas', label: '0 KM (NOVAS)', icon: <Flame className="w-4 h-4" /> },
    { id: 'seminovas', label: 'SEMINOVAS', icon: <Gauge className="w-4 h-4" /> },
    { id: 'eletricas', label: 'ELÉTRICAS', icon: <Zap className="w-4 h-4" /> },
  ];

  const handlePainelClick = () => {
    if (isAdminLoggedIn) {
      onNavigate('painel');
    } else {
      onOpenAdminLogin();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0d12]/95 backdrop-blur-md border-b border-[#22222d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('inicio')}
          className="flex items-center gap-3 cursor-pointer group select-none"
          id="brand-logo-btn"
        >
          <div className="flex items-center">
            <span className="font-racing text-2xl sm:text-3xl font-black italic tracking-tighter text-white uppercase group-hover:text-red-500 transition-colors">
              TOP
            </span>
            <span className="font-racing text-2xl sm:text-3xl font-black italic tracking-tighter text-[#e60012] uppercase group-hover:brightness-125 transition-all ml-1">
              MOTOS
            </span>
          </div>
          <div className="hidden sm:block h-5 w-[1px] bg-[#333342] ml-2"></div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#14141c] p-1.5 rounded-xl border border-[#272736]">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 sm:px-4 py-2 text-xs lg:text-sm font-racing font-bold tracking-wider rounded-lg transition-all uppercase flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#e60012] text-white shadow-md shadow-red-900/30'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#20202d]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Special Promos Button (Only appears when promotions are active: promosCount > 0) */}
          {promosCount > 0 && (
            <button
              id="nav-link-promocoes"
              onClick={() => onNavigate('promocoes')}
              className={`px-3 sm:px-4 py-1.5 text-xs lg:text-sm font-racing font-bold tracking-wider rounded-lg transition-all uppercase flex items-center gap-2 border ${
                currentPage === 'promocoes'
                  ? 'bg-amber-500 text-black border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-950/50'
                  : 'bg-[#221708] hover:bg-[#2e1f0c] text-amber-400 border-amber-500/70 hover:border-amber-400 shadow-md shadow-amber-950/30'
              }`}
            >
              <Flame className={`w-4 h-4 ${currentPage === 'promocoes' ? 'fill-black text-black' : 'fill-amber-500 text-amber-500'}`} />
              <span>PROMOÇÕES</span>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                currentPage === 'promocoes' ? 'bg-black text-amber-400' : 'bg-amber-500 text-black'
              }`}>
                {promosCount}
              </span>
            </button>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live sync pill */}
          <div 
            title="Sincronização em Tempo Real Ativa"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16221c] border border-emerald-900/40 text-emerald-400 text-xs font-semibold tracking-wider font-racing"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>TEMPO REAL</span>
          </div>

          {/* Admin Panel Button (Asks for Email and Password if not logged in) */}
          <button
            id="top-header-painel-btn"
            onClick={handlePainelClick}
            title={isAdminLoggedIn ? "Ir para o Painel Administrativo" : "Acessar Painel (Requer E-mail e Senha)"}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-racing font-bold uppercase transition-all tracking-wider cursor-pointer shadow-lg ${
              isAdminLoggedIn
                ? currentPage === 'painel'
                  ? 'bg-red-600 text-white ring-2 ring-red-400 shadow-red-950/60'
                  : 'bg-[#e60012] text-white hover:bg-red-700 shadow-red-950/40'
                : 'bg-[#181824] hover:bg-[#222232] text-white border border-red-600/40 hover:border-red-500 shadow-black/60 hover:text-red-400'
            }`}
          >
            <Shield className={`w-4 h-4 ${isAdminLoggedIn ? 'text-white' : 'text-[#e60012]'}`} />
            <span>{isAdminLoggedIn ? 'PAINEL ATIVO' : 'PAINEL'}</span>
          </button>

          {/* Logout button (only visible when logged in) */}
          {isAdminLoggedIn && (
            <button
              id="admin-logout-btn"
              onClick={onAdminLogout}
              title="Sair do modo administrador"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1c1417] hover:bg-red-950/60 text-red-400 hover:text-red-300 border border-red-900/40 text-xs sm:text-sm font-racing font-bold uppercase transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SAIR</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#181822] text-[#e4e4e7] border border-[#2a2a38] hover:text-white"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#101016] border-b border-[#262635] px-4 py-4 space-y-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#20202c]">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 font-racing">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>ESTOQUE SINCRONIZADO EM TEMPO REAL</span>
            </div>
          </div>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-racing font-bold tracking-wider uppercase transition-all ${
                  isActive
                    ? 'bg-[#e60012] text-white'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-[#1a1a24]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="text-xs">ATIVO</span>}
              </button>
            );
          })}

          {/* Mobile Promo button */}
          {promosCount > 0 && (
            <button
              onClick={() => {
                onNavigate('promocoes');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-racing font-bold tracking-wider uppercase transition-all bg-[#24170a] border border-amber-500/70 text-amber-400"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>PROMOÇÕES ESPECIAIS</span>
              </div>
              <span className="bg-amber-500 text-black font-black text-xs px-2 py-0.5 rounded-full">
                {promosCount} ON
              </span>
            </button>
          )}

          {/* Mobile Painel Button */}
          <button
            onClick={() => {
              handlePainelClick();
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-racing font-bold tracking-wider uppercase transition-all mt-3 border ${
              isAdminLoggedIn
                ? 'bg-red-600/20 border-red-500/50 text-red-300'
                : 'bg-[#181824] border-red-800/40 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#e60012]" />
              <span>{isAdminLoggedIn ? 'PAINEL ADMINISTRATIVO (LOGADO)' : 'ACESSAR PAINEL (E-MAIL E SENHA)'}</span>
            </div>
          </button>
        </div>
      )}
    </header>
  );
};
