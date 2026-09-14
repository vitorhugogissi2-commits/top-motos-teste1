import React, { useState, useEffect, useRef } from 'react';
import { Moto, MotoCategory } from '../types';
import { PHOTO_PRESETS } from '../data/initialMotos';
import { CameraCaptureModal } from './CameraCaptureModal';
import { X, Camera, Upload, Plus, Trash2, Check, Sparkles, Image as ImageIcon, Flame, Star, Loader2, Smartphone, Monitor } from 'lucide-react';

interface MotoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (motoData: Omit<Moto, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  motoToEdit?: Moto | null;
}

/**
 * Compresses an image file from smartphone gallery or PC file explorer to a max dimension of 1280px
 * and 0.82 JPEG quality. This ensures lightning-fast upload, high visual fidelity, and keeps
 * the base64 string lightweight (~80-150 KB) so Firestore can store multiple photos per moto effortlessly.
 */
function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler arquivo da galeria'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.onload = () => {
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const MotoFormModal: React.FC<MotoFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  motoToEdit,
}) => {
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('HONDA');
  const [categoria, setCategoria] = useState<MotoCategory>('novas');
  const [ano, setAno] = useState<number>(2026);
  const [quilometragem, setQuilometragem] = useState<number>(0);
  const [quantidadeEstoque, setQuantidadeEstoque] = useState<number>(1);
  const [preco, setPreco] = useState<number>(24900);
  const [emPromocao, setEmPromocao] = useState<boolean>(false);
  const [precoPromocional, setPrecoPromocional] = useState<number | undefined>(undefined);
  const [destaque, setDestaque] = useState<boolean>(false);
  const [motor, setMotor] = useState('160 cc');
  const [combustivel, setCombustivel] = useState('Flex (Gasolina / Etanol)');
  const [estilo, setEstilo] = useState('Urbana / Dia a Dia');
  const [garantia, setGarantia] = useState('3 Anos Garantia de Fábrica');
  const [tanqueCombustivel, setTanqueCombustivel] = useState('16.1 Litros');
  const [consumoMedio, setConsumoMedio] = useState('42 km/L');
  const [cambio, setCambio] = useState('5 Marchas');
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate fields when editing or reset when adding
  useEffect(() => {
    if (motoToEdit) {
      setModelo(motoToEdit.modelo);
      setMarca(motoToEdit.marca);
      setCategoria(motoToEdit.categoria);
      setAno(motoToEdit.ano);
      setQuilometragem(motoToEdit.quilometragem);
      setQuantidadeEstoque(motoToEdit.quantidadeEstoque);
      setPreco(motoToEdit.preco);
      setEmPromocao(motoToEdit.emPromocao);
      setPrecoPromocional(motoToEdit.precoPromocional);
      setDestaque(!!motoToEdit.destaque);
      setMotor(motoToEdit.motor || '');
      setCombustivel(motoToEdit.combustivel || '');
      setEstilo(motoToEdit.estilo || '');
      setGarantia(motoToEdit.garantia || '');
      setTanqueCombustivel(motoToEdit.tanqueCombustivel || '');
      setConsumoMedio(motoToEdit.consumoMedio || '');
      setCambio(motoToEdit.cambio || '');
      setDescricao(motoToEdit.descricao || '');
      setFotos(motoToEdit.fotos || []);
    } else {
      setModelo('');
      setMarca('HONDA');
      setCategoria('novas');
      setAno(2026);
      setQuilometragem(0);
      setQuantidadeEstoque(1);
      setPreco(24900);
      setEmPromocao(false);
      setPrecoPromocional(undefined);
      setDestaque(false);
      setMotor('160 cc');
      setCombustivel('Flex (Gasolina / Etanol)');
      setEstilo('Urbana / Dia a Dia');
      setGarantia('3 Anos Garantia de Fábrica');
      setTanqueCombustivel('16.1 Litros');
      setConsumoMedio('42 km/L');
      setCambio('5 Marchas');
      setDescricao('Veículo em perfeito estado com todas as revisões em dia e documentação 100% regularizada.');
      setFotos([
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'
      ]);
    }
  }, [motoToEdit, isOpen]);

  if (!isOpen) return null;

  // Discount quick calculate buttons
  const applyDiscountPercent = (pct: number) => {
    const discounted = Math.round(preco * (1 - pct / 100));
    setPrecoPromocional(discounted);
    setEmPromocao(true);
  };

  // Add photo from URL
  const handleAddLink = () => {
    if (linkInput.trim()) {
      setFotos([...fotos, linkInput.trim()]);
      setLinkInput('');
    }
  };

  // Add photo from Camera capture
  const handleCameraCapture = (base64: string) => {
    setFotos([base64, ...fotos]);
  };

  // Add photos from File Upload (Smartphone Gallery or PC Explorer)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);
    const newPhotos: string[] = [];

    try {
      const fileList = Array.from(files) as File[];
      for (const file of fileList) {
        try {
          const compressed = await compressImageFile(file);
          newPhotos.push(compressed);
        } catch (err) {
          console.error('Erro ao processar imagem da galeria:', err);
        }
      }

      if (newPhotos.length > 0) {
        setFotos((prev) => [...prev, ...newPhotos]);
      }
    } finally {
      setIsProcessingPhotos(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Drag and drop handler for photos
  const handleDropPhotos = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);
    const newPhotos: string[] = [];

    try {
      const fileList = Array.from(files) as File[];
      for (const file of fileList) {
        if (!file.type.startsWith('image/')) continue;
        try {
          const compressed = await compressImageFile(file);
          newPhotos.push(compressed);
        } catch (err) {
          console.error('Erro ao processar imagem solta:', err);
        }
      }

      if (newPhotos.length > 0) {
        setFotos((prev) => [...prev, ...newPhotos]);
      }
    } finally {
      setIsProcessingPhotos(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const handleSetPrimaryPhoto = (index: number) => {
    if (index === 0) return;
    const target = fotos[index];
    const rest = fotos.filter((_, i) => i !== index);
    setFotos([target, ...rest]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelo.trim() || !marca.trim() || preco <= 0) return;

    const payload = {
      modelo: modelo.trim(),
      marca: marca.trim().toUpperCase(),
      categoria,
      ano: Number(ano),
      quilometragem: Number(quilometragem),
      quantidadeEstoque: Number(quantidadeEstoque),
      preco: Number(preco),
      emPromocao: Boolean(emPromocao),
      precoPromocional: emPromocao && precoPromocional ? Number(precoPromocional) : undefined,
      destaque: Boolean(destaque),
      motor: motor.trim(),
      combustivel: combustivel.trim(),
      estilo: estilo.trim(),
      garantia: garantia.trim(),
      tanqueCombustivel: tanqueCombustivel.trim(),
      consumoMedio: consumoMedio.trim(),
      cambio: cambio.trim(),
      descricao: descricao.trim(),
      fotos: fotos.length > 0 ? fotos : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80'],
    };

    onSave(payload, motoToEdit?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#101016] border border-[#272738] rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/80 my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#20202e]">
          <div className="flex items-center gap-2">
            <span className="text-xl">✏️</span>
            <h2 className="font-racing font-black italic text-xl sm:text-2xl text-white uppercase tracking-tight">
              {motoToEdit ? 'EDITAR MOTOCICLETA' : 'CADASTRAR NOVA MOTOCICLETA'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#181822] text-[#a1a1aa] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-1 space-y-6 flex-1 mt-4">
          
          {/* Row 1: Model, Brand, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* MODELO / TÍTULO */}
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                MODELO / TÍTULO DA MOTO *
              </label>
              <input
                type="text"
                required
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ex: BMW S 1000 RR M Package"
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white placeholder-[#52525b] focus:outline-none"
              />
            </div>

            {/* MARCA */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                MARCA *
              </label>
              <input
                type="text"
                required
                value={marca}
                onChange={(e) => setMarca(e.target.value.toUpperCase())}
                placeholder="HONDA, YAMAHA, BMW..."
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm font-racing font-bold text-white uppercase placeholder-[#52525b] focus:outline-none"
              />
            </div>

            {/* CATEGORIA */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                CATEGORIA *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as MotoCategory)}
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm font-racing font-bold text-white uppercase focus:outline-none cursor-pointer"
              >
                <option value="novas">NOVAS (0 KM)</option>
                <option value="seminovas">SEMINOVAS</option>
                <option value="eletricas">ELÉTRICAS</option>
              </select>
            </div>

          </div>

          {/* Row 2: Year, KM, Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* ANO DE FABRICAÇÃO */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                ANO DE FABRICAÇÃO *
              </label>
              <input
                type="number"
                required
                min="1990"
                max="2030"
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

            {/* QUILOMETRAGEM */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                QUILOMETRAGEM (KM) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={quilometragem}
                onChange={(e) => setQuilometragem(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

            {/* QUANTIDADE EM ESTOQUE */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                QUANTIDADE EM ESTOQUE *
              </label>
              <input
                type="number"
                required
                min="0"
                value={quantidadeEstoque}
                onChange={(e) => setQuantidadeEstoque(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

          </div>

          {/* Row 3: Regular Price, Promo Price with Discount Calcs, Motor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* PREÇO NORMAL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                PREÇO NORMAL (R$) *
              </label>
              <input
                type="number"
                required
                min="100"
                value={preco}
                onChange={(e) => setPreco(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm font-bold text-white focus:outline-none"
              />
            </div>

            {/* PREÇO PROMOCIONAL & CALCULATOR */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase">
                  PREÇO PROMOCIONAL (R$)
                </label>
                <span className="text-[9px] font-racing text-amber-400 font-bold uppercase">
                  Calcular Descontos:
                </span>
              </div>
              <input
                type="number"
                min="0"
                value={precoPromocional || ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  setPrecoPromocional(val);
                  setEmPromocao(!!val);
                }}
                placeholder="Ex: 21000"
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm font-bold text-amber-400 focus:outline-none placeholder-[#52525b]"
              />
              {/* Discount pills (-5%, -10%, -15%, -20%, -25%, -30%) */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                {[5, 10, 15, 20, 25, 30].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => applyDiscountPercent(pct)}
                    className="px-1.5 py-0.5 rounded bg-[#1e1e2c] hover:bg-amber-500 hover:text-black text-[10px] font-racing font-bold text-[#a1a1aa] transition-colors"
                  >
                    -{pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* MOTOR / POTÊNCIA */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                MOTOR / POTÊNCIA
              </label>
              <input
                type="text"
                value={motor}
                onChange={(e) => setMotor(e.target.value)}
                placeholder="Ex: 160 cc ou 3000W"
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none placeholder-[#52525b]"
              />
            </div>

          </div>

          {/* Row 4: Fuel, Style, Warranty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                COMBUSTÍVEL / ENERGIA
              </label>
              <input
                type="text"
                value={combustivel}
                onChange={(e) => setCombustivel(e.target.value)}
                placeholder="Flex / Gasolina / Elétrica"
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                ESTILO / USO RECOMENDADO
              </label>
              <input
                type="text"
                value={estilo}
                onChange={(e) => setEstilo(e.target.value)}
                placeholder="Urbana / Scooter / Trail / Speed"
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                GARANTIA OFICIAL
              </label>
              <input
                type="text"
                value={garantia}
                onChange={(e) => setGarantia(e.target.value)}
                placeholder="3 Anos Garantia de Fábrica"
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

          </div>

          {/* Row 5: Section ESPECIFICAÇÕES DE COMBUSTÃO & CÂMBIO (matching screenshot 5) */}
          <div className="p-4 rounded-2xl bg-[#14141d] border border-[#252536] space-y-3">
            <div className="flex items-center gap-2 text-xs font-racing font-bold tracking-widest text-[#e60012] uppercase">
              <span>🔧</span>
              <span>ESPECIFICAÇÕES DE COMBUSTÃO & CÂMBIO</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-racing font-bold text-[#71717a] uppercase block">
                  TANQUE DE COMBUSTÍVEL
                </label>
                <input
                  type="text"
                  value={tanqueCombustivel}
                  onChange={(e) => setTanqueCombustivel(e.target.value)}
                  placeholder="16.1 Litros ou Bateria 72V"
                  className="w-full px-3 py-2 bg-[#1b1b26] border border-[#2c2c3e] rounded-lg text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-racing font-bold text-[#71717a] uppercase block">
                  CONSUMO MÉDIO ESTIMADO
                </label>
                <input
                  type="text"
                  value={consumoMedio}
                  onChange={(e) => setConsumoMedio(e.target.value)}
                  placeholder="42 km/L ou Autonomia 80km"
                  className="w-full px-3 py-2 bg-[#1b1b26] border border-[#2c2c3e] rounded-lg text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-racing font-bold text-[#71717a] uppercase block">
                  CÂMBIO / TRANSMISSÃO
                </label>
                <input
                  type="text"
                  value={cambio}
                  onChange={(e) => setCambio(e.target.value)}
                  placeholder="5 Marchas ou Automático CVT"
                  className="w-full px-3 py-2 bg-[#1b1b26] border border-[#2c2c3e] rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 6: GALERIA DE FOTOS DA MOTO (matching screenshot 5) */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropPhotos}
            className="p-4 rounded-2xl bg-[#14141d] border border-[#252536] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-racing font-bold tracking-widest text-[#f59e0b] uppercase">
                <ImageIcon className="w-4 h-4" />
                <span>GALERIA DE FOTOS DA MOTO ({fotos.length} FOTO{fotos.length === 1 ? '' : 'S'})</span>
              </div>
              <span className="text-[10px] font-racing text-[#10b981] uppercase flex items-center gap-1 font-bold">
                <Check className="w-3 h-3" /> Galeria / PC / Câmera
              </span>
            </div>
            
            <p className="text-[11px] text-[#a1a1aa]">
              Selecione fotos direto da <strong className="text-white">galeria do seu celular</strong>, do seu <strong className="text-white">computador (PC)</strong>, ou tire foto na hora com a câmera.
            </p>

            {/* Photo Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
              
              {/* Gallery File Picker Button (Mobile & PC) */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingPhotos}
                className="sm:col-span-6 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black text-xs font-racing font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isProcessingPhotos ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>PROCESSANDO FOTO DA GALERIA...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-black" />
                    <span>📁 ESCOLHER DA GALERIA (CELULAR OU PC)</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp, image/heic, image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Camera Button */}
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                disabled={isProcessingPhotos}
                className="sm:col-span-3 py-3 px-3 rounded-xl bg-[#e60012] hover:bg-red-700 text-white text-xs font-racing font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>📷 TIRAR FOTO</span>
              </button>

              {/* URL Input */}
              <div className="sm:col-span-3 flex items-center gap-1.5">
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Link web (URL)"
                  className="w-full px-3 py-2.5 bg-[#1b1b26] border border-[#2c2c3e] rounded-lg text-xs text-white focus:outline-none placeholder-[#52525b]"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="px-3 py-2.5 rounded-lg bg-[#272738] hover:bg-[#34344a] text-white text-xs font-racing font-bold uppercase"
                >
                  + Link
                </button>
              </div>

            </div>

            {/* Quick Photo Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-racing text-[#71717a] uppercase mr-1">Fotos Exemplo:</span>
              {PHOTO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFotos([...fotos, preset.url])}
                  className="px-2 py-1 rounded bg-[#1c1c28] hover:bg-[#28283a] text-[10px] font-racing font-semibold text-[#a1a1aa] hover:text-white border border-[#2a2a3b] transition-colors"
                >
                  + {preset.label}
                </button>
              ))}
            </div>

            {/* Photo Gallery Grid */}
            {fotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                {fotos.map((foto, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden bg-black border border-[#2c2c3e] aspect-video sm:aspect-square"
                  >
                    <img src={foto} alt="" className="w-full h-full object-cover" />
                    
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-red-600 text-[9px] font-racing font-black text-white uppercase shadow">
                        CAPA
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryPhoto(idx)}
                          title="Definir como foto principal (Capa)"
                          className="p-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        title="Remover foto"
                        className="p-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="py-6 px-4 border-2 border-dashed border-[#2f2f44] hover:border-amber-500/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-[#101017]/50 group"
              >
                <Upload className="w-8 h-8 text-[#52525b] group-hover:text-amber-400 transition-colors mb-2" />
                <p className="text-xs font-racing font-bold text-[#d4d4d8] group-hover:text-white uppercase tracking-wider">
                  Nenhuma foto selecionada ainda
                </p>
                <p className="text-[11px] text-[#71717a] mt-0.5">
                  Toque aqui para abrir a galeria do celular ou escolher do computador
                </p>
              </div>
            )}
          </div>

          {/* Description & Toggles */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-racing font-bold text-[#a1a1aa] tracking-widest uppercase block">
                DESCRIÇÃO DETALHADA
              </label>
              <textarea
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Detalhes sobre o estado, acessórios inclusos, histórico de revisões..."
                className="w-full px-3.5 py-2.5 bg-[#15151e] border border-[#262638] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white placeholder-[#52525b] focus:outline-none"
              />
            </div>

            {/* Promo & Destaque Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={emPromocao}
                  onChange={(e) => setEmPromocao(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-[#1e1e2a] border-[#313144]"
                />
                <span className="text-xs font-racing font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>ATIVAR STATUS DE PROMOÇÃO</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={destaque}
                  onChange={(e) => setDestaque(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-[#1e1e2a] border-[#313144]"
                />
                <span className="text-xs font-racing font-bold text-[#e4e4e7] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#e60012]" />
                  <span>DESTACAR NA PÁGINA INICIAL</span>
                </span>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#20202e] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-[#181822] hover:bg-[#242432] text-[#a1a1aa] hover:text-white text-xs font-racing font-bold uppercase tracking-wider"
            >
              CANCELAR
            </button>

            <button
              type="submit"
              id="btn-save-moto-submit"
              className="px-7 py-3 rounded-xl bg-[#e60012] hover:bg-red-700 text-white font-racing font-black italic tracking-wider text-xs sm:text-sm uppercase flex items-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{motoToEdit ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR NO ESTOQUE'}</span>
            </button>
          </div>

        </form>

      </div>

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

    </div>
  );
};
