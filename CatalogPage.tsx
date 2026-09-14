import React, { useState, useMemo } from 'react';
import { Moto, PageView } from '../types';
import { MotoCard } from './MotoCard';
import { Search, Filter, ArrowLeft, SlidersHorizontal, RefreshCw, Flame } from 'lucide-react';

interface CatalogPageProps {
  motos: Moto[];
  currentCategory: PageView; // 'novas' | 'seminovas' | 'eletricas' | 'todas'
  onSelectCategory: (cat: PageView) => void;
  onSelectMoto: (moto: Moto) => void;
  onNavigateHome: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  motos,
  currentCategory,
  onSelectCategory,
  onSelectMoto,
  onNavigateHome,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('TODAS');
  const [onlyPromos, setOnlyPromos] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'year_desc'>('default');

  // Available brands list
  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(motos.map((m) => m.marca.toUpperCase())));
    return brands.sort();
  }, [motos]);

  // Counts
  const counts = useMemo(() => {
    return {
      todas: motos.length,
      novas: motos.filter((m) => m.categoria === 'novas').length,
      seminovas: motos.filter((m) => m.categoria === 'seminovas').length,
      eletricas: motos.filter((m) => m.categoria === 'eletricas').length,
      promocoes: motos.filter((m) => m.emPromocao).length,
    };
  }, [motos]);

  // Filtered Motos
  const filteredMotos = useMemo(() => {
    return motos.filter((moto) => {
      // Category filter
      if (currentCategory === 'promocoes') {
        if (!moto.emPromocao) return false;
      } else if (currentCategory !== 'todas' && currentCategory !== 'inicio') {
        if (moto.categoria !== currentCategory) return false;
      }

      // Brand filter
      if (selectedBrand !== 'TODAS' && moto.marca.toUpperCase() !== selectedBrand) {
        return false;
      }

      // Promo filter
      if (onlyPromos && !moto.emPromocao) {
        return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchModel = moto.modelo.toLowerCase().includes(query);
        const matchBrand = moto.marca.toLowerCase().includes(query);
        const matchEngine = (moto.motor || '').toLowerCase().includes(query);
        const matchStyle = (moto.estilo || '').toLowerCase().includes(query);
        if (!matchModel && !matchBrand && !matchEngine && !matchStyle) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const precoA = a.emPromocao && a.precoPromocional ? a.precoPromocional : a.preco;
      const precoB = b.emPromocao && b.precoPromocional ? b.precoPromocional : b.preco;

      if (sortBy === 'price_asc') return precoA - precoB;
      if (sortBy === 'price_desc') return precoB - precoA;
      if (sortBy === 'year_desc') return b.ano - a.ano;
      return 0;
    });
  }, [motos, currentCategory, selectedBrand, onlyPromos, searchTerm, sortBy]);

  // Page title calculation based on active category
  const categoryTitles: Record<string, string> = {
    novas: 'MOTOS 0 KM (NOVAS)',
    seminovas: 'MOTOS SEMINOVAS REVISADAS',
    eletricas: 'MOTOS 100% ELÉTRICAS',
    todas: 'CATÁLOGO COMPLETO DE MOTOS',
    promocoes: 'MOTOS EM PROMOÇÃO EXCLUSIVA',
  };

  const title = categoryTitles[currentCategory] || 'CATÁLOGO DE MOTOS';

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 flex-1">
      
      {/* Header & Category Switcher */}
      <div className="space-y-6">
        
        {/* Back Link & Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <button
              id="back-to-home-btn"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-racing font-bold tracking-widest text-[#a1a1aa] hover:text-white uppercase transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#e60012]" />
              <span>VOLTAR AO INÍCIO</span>
            </button>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-racing italic tracking-tight text-white uppercase flex items-center gap-3">
              {currentCategory === 'promocoes' && <Flame className="w-8 h-8 text-amber-500 fill-amber-500 animate-pulse" />}
              <span>{title}</span>
            </h1>
            <p className="text-xs sm:text-sm font-racing font-bold text-[#71717a] tracking-widest uppercase mt-1">
              {filteredMotos.length} MODELOS ENCONTRADOS
            </p>
          </div>

          {/* Category Tabs (matching screenshot) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#14141c] p-1.5 rounded-xl border border-[#272736] self-start md:self-auto">
            <button
              id="tab-cat-todas"
              onClick={() => onSelectCategory('todas')}
              className={`px-3 sm:px-4 py-2 text-xs font-racing font-bold tracking-wider rounded-lg transition-all uppercase cursor-pointer ${
                currentCategory === 'todas'
                  ? 'bg-[#e60012] text-white shadow-md'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#1f1f2c]'
              }`}
            >
              TODAS AS MOTOS ({counts.todas})
            </button>

            <button
              id="tab-cat-novas"
              onClick={() => onSelectCategory('novas')}
              className={`px-3 sm:px-4 py-2 text-xs font-racing font-bold tracking-wider rounded-lg transition-all uppercase cursor-pointer ${
                currentCategory === 'novas'
                  ? 'bg-[#e60012] text-white shadow-md'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#1f1f2c]'
              }`}
            >
              0 KM (NOVAS) ({counts.novas})
            </button>

            <button
              id="tab-cat-seminovas"
              onClick={() => onSelectCategory('seminovas')}
              className={`px-3 sm:px-4 py-2 text-xs font-racing font-bold tracking-wider rounded-lg transition-all uppercase cursor-pointer ${
                currentCategory === 'seminovas'
                  ? 'bg-[#e60012] text-white shadow-md'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#1f1f2c]'
              }`}
            >
              SEMINOVAS ({counts.seminovas})
            </button>

            <button
              id="tab-cat-eletricas"
              onClick={() => onSelectCategory('eletricas')}
              className={`px-3 sm:px-4 py-2 text-xs font-racing font-bold tracking-wider rounded-lg transition-all uppercase cursor-pointer ${
                currentCategory === 'eletricas'
                  ? 'bg-[#e60012] text-white shadow-md'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#1f1f2c]'
              }`}
            >
              ELÉTRICAS ({counts.eletricas})
            </button>

            {counts.promocoes > 0 && (
              <button
                id="tab-cat-promocoes"
                onClick={() => onSelectCategory('promocoes')}
                className={`px-3 sm:px-4 py-2 text-xs font-racing font-bold tracking-wider rounded-lg transition-all uppercase flex items-center gap-1.5 cursor-pointer border ${
                  currentCategory === 'promocoes'
                    ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md shadow-amber-950/40'
                    : 'text-amber-400 bg-[#22170a] border-amber-500/50 hover:border-amber-400'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${currentCategory === 'promocoes' ? 'fill-black text-black' : 'fill-amber-400 text-amber-400'}`} />
                <span>PROMOÇÕES ({counts.promocoes})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar (Search + Brand Select + Sort) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          
          {/* Search Input */}
          <div className="sm:col-span-6 lg:col-span-7 relative">
            <Search className="w-4 h-4 text-[#71717a] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por modelo, marca ou cilindrada..."
              className="w-full pl-11 pr-4 py-3.5 bg-[#121218] border border-[#262638] focus:border-red-500 rounded-xl text-sm text-white placeholder-[#71717a] focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71717a] hover:text-white px-1.5 py-0.5 rounded bg-[#20202c]"
              >
                LIMPAR
              </button>
            )}
          </div>

          {/* Brand Filter Dropdown */}
          <div className="sm:col-span-3 lg:col-span-3 relative">
            <select
              id="brand-filter-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#121218] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm font-racing font-bold tracking-wider text-white uppercase focus:outline-none appearance-none cursor-pointer pr-10"
            >
              <option value="TODAS">TODAS AS MARCAS</option>
              {availableBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-[#71717a] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort & Promo Quick Toggle */}
          <div className="sm:col-span-3 lg:col-span-2 flex items-center gap-2">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-3.5 bg-[#121218] border border-[#262638] focus:border-red-500 rounded-xl text-xs font-racing font-bold tracking-wider text-white uppercase focus:outline-none cursor-pointer"
            >
              <option value="default">ORDENAR</option>
              <option value="price_asc">MENOR PREÇO</option>
              <option value="price_desc">MAIOR PREÇO</option>
              <option value="year_desc">MAIS NOVAS</option>
            </select>

            <button
              id="toggle-only-promos-btn"
              onClick={() => setOnlyPromos(!onlyPromos)}
              title="Filtrar apenas promoções"
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                onlyPromos
                  ? 'bg-amber-500 text-black border-amber-400 font-bold'
                  : 'bg-[#121218] text-[#71717a] hover:text-white border-[#262638]'
              }`}
            >
              <Flame className={`w-4 h-4 ${onlyPromos ? 'fill-black' : ''}`} />
            </button>
          </div>

        </div>

      </div>

      {/* Grid of Motorcycles */}
      {filteredMotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMotos.map((moto) => (
            <MotoCard
              key={moto.id}
              moto={moto}
              onSelect={onSelectMoto}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center space-y-4 rounded-2xl bg-[#111117] border border-[#222230] p-8">
          <div className="w-16 h-16 rounded-full bg-[#1c1c28] border border-[#2e2e42] flex items-center justify-center mx-auto text-[#71717a]">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-racing font-bold text-xl text-white uppercase tracking-wider">
            Nenhuma moto encontrada
          </h3>
          <p className="text-sm text-[#9ca3af] max-w-md mx-auto">
            Não encontramos veículos correspondentes aos filtros selecionados. Tente buscar outro termo ou limpar os filtros.
          </p>
          <button
            id="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setSelectedBrand('TODAS');
              setOnlyPromos(false);
              onSelectCategory('todas');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#e60012] text-white text-xs font-racing font-bold uppercase tracking-wider hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>LIMPAR TODOS OS FILTROS</span>
          </button>
        </div>
      )}

    </div>
  );
};
