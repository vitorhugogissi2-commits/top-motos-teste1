import React, { useState, useEffect } from 'react';
import { Moto, PageView } from './types';
import {
  getMotos,
  addMoto,
  updateMoto,
  deleteMoto,
  togglePromotion,
  resetToDefaultMotos,
  subscribeToMotoUpdates,
} from './services/motoService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CatalogPage } from './components/CatalogPage';
import { AdminPanel } from './components/AdminPanel';
import { MotoDetailModal } from './components/MotoDetailModal';
import { FinancingModal } from './components/FinancingModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ServiceContactModal } from './components/ServiceContactModal';

export default function App() {
  const [motos, setMotos] = useState<Moto[]>(() => getMotos());
  const [currentPage, setCurrentPage] = useState<PageView>('inicio');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('topmotos_admin_logged') === 'true';
  });

  // Modals state
  const [selectedMotoForDetail, setSelectedMotoForDetail] = useState<Moto | null>(null);
  const [financingMoto, setFinancingMoto] = useState<Moto | null>(null);
  const [isFinancingOpen, setIsFinancingOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [serviceModalType, setServiceModalType] = useState<'assistencia' | 'compramos_sua_moto' | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Subscribe to real-time updates via Firebase onSnapshot
  useEffect(() => {
    const unsubscribe = subscribeToMotoUpdates((updatedMotos) => {
      setMotos(updatedMotos);
    });
    return () => unsubscribe();
  }, []);

  // Handle URL deep link (e.g. ?moto=id)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const motoId = params.get('moto');
      if (motoId) {
        const found = motos.find((m) => m.id === motoId);
        if (found) {
          setSelectedMotoForDetail(found);
        }
      }
    }
  }, [motos]);

  // Sync URL query parameter when selected moto changes
  const handleSelectMotoForDetail = (moto: Moto | null) => {
    setSelectedMotoForDetail(moto);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (moto) {
        url.searchParams.set('moto', moto.id);
      } else {
        url.searchParams.delete('moto');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleNavigate = (page: PageView) => {
    if (page === 'painel' && !isAdminLoggedIn) {
      setIsAdminLoginOpen(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('topmotos_admin_logged', 'true');
    setCurrentPage('painel');
    showNotification('Autenticado com sucesso no Painel!');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('topmotos_admin_logged');
    setCurrentPage('inicio');
    showNotification('Sessão de administrador encerrada.');
  };

  const handleAddMoto = async (newMotoData: Omit<Moto, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = await addMoto(newMotoData);
      showNotification(`Moto "${created.modelo}" adicionada em tempo real!`);
    } catch (e) {
      console.error('Error adding moto:', e);
      showNotification('Erro ao adicionar moto.');
    }
  };

  const handleUpdateMoto = async (id: string, updates: Partial<Moto>) => {
    try {
      await updateMoto(id, updates);
      showNotification(`Atualização gravada em tempo real!`);
    } catch (e) {
      console.error('Error updating moto:', e);
      showNotification('Erro ao atualizar moto.');
    }
  };

  const handleDeleteMoto = async (id: string) => {
    try {
      await deleteMoto(id);
      showNotification('Veículo removido do estoque em tempo real.');
    } catch (e) {
      console.error('Error deleting moto:', e);
      showNotification('Erro ao excluir moto.');
    }
  };

  const handleTogglePromo = async (id: string, precoPromocional?: number) => {
    try {
      await togglePromotion(id, precoPromocional);
      showNotification('Promoção atualizada em tempo real!');
    } catch (e) {
      console.error('Error toggling promo:', e);
      showNotification('Erro ao atualizar promoção.');
    }
  };

  const handleResetDefaults = async () => {
    try {
      await resetToDefaultMotos();
      showNotification('Estoque padrão restaurado com sucesso!');
    } catch (e) {
      console.error('Error resetting defaults:', e);
      showNotification('Erro ao restaurar padrão.');
    }
  };

  const handleOpenFinancing = (moto?: Moto) => {
    setFinancingMoto(moto || selectedMotoForDetail || motos[0]);
    setIsFinancingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans flex flex-col selection:bg-red-600 selection:text-white relative">
      
      {/* Toast Notification Bar */}
      {notification && (
        <div className="fixed top-20 right-5 z-50 bg-[#161622] border border-red-600/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#e60012] animate-ping"></span>
          <span className="text-xs font-racing font-bold tracking-wider uppercase">
            {notification}
          </span>
        </div>
      )}

      {/* Main Global Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleLogout}
        promosCount={motos.filter((m) => m.emPromocao).length}
      />

      {/* Dynamic Page Views */}
      <main className="flex-1 flex flex-col">
        {currentPage === 'inicio' ? (
          <HomePage
            motos={motos}
            onNavigate={handleNavigate}
            onOpenServiceModal={(type) => setServiceModalType(type)}
          />
        ) : currentPage === 'painel' && isAdminLoggedIn ? (
          <AdminPanel
            motos={motos}
            onAddMoto={handleAddMoto}
            onUpdateMoto={handleUpdateMoto}
            onDeleteMoto={handleDeleteMoto}
            onTogglePromo={handleTogglePromo}
            onResetToDefaults={handleResetDefaults}
            onLogout={handleLogout}
            onPreviewMoto={(moto) => handleSelectMotoForDetail(moto)}
          />
        ) : (
          <CatalogPage
            motos={motos}
            currentCategory={currentPage}
            onSelectCategory={(cat) => setCurrentPage(cat)}
            onSelectMoto={(moto) => handleSelectMotoForDetail(moto)}
            onNavigateHome={() => setCurrentPage('inicio')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Moto Detail Modal */}
      <MotoDetailModal
        moto={selectedMotoForDetail}
        onClose={() => handleSelectMotoForDetail(null)}
        onOpenFinancing={(moto) => {
          handleSelectMotoForDetail(null);
          handleOpenFinancing(moto);
        }}
      />

      {/* Financing Calculator Modal */}
      <FinancingModal
        isOpen={isFinancingOpen}
        onClose={() => setIsFinancingOpen(false)}
        motos={motos}
        initialMoto={financingMoto}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Quick Service Contact Modal (Assistência Técnica / Compramos sua Moto) */}
      <ServiceContactModal
        type={serviceModalType}
        onClose={() => setServiceModalType(null)}
      />

    </div>
  );
}
