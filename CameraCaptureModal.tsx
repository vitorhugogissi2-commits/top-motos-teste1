import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, FlipHorizontal } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Photo: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startCamera = async (mode: 'user' | 'environment') => {
    setErrorMsg(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Câmera não suportada neste navegador.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMsg('Não foi possível acessar a câmera. Verifique as permissões do navegador ou selecione uma foto da galeria.');
    }
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera(facingMode);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  const handleStopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    onClose();
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
    }
  };

  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleStopCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative z-10 w-full max-w-xl bg-[#101016] border border-[#272738] rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col space-y-4 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#e60012]" />
            <h3 className="font-racing font-bold text-lg text-white uppercase tracking-wider">
              CÂMERA INTEGRADA - FOTO DA MOTO
            </h3>
          </div>
          <button
            onClick={handleStopCamera}
            className="p-1.5 rounded-full bg-[#181824] text-[#a1a1aa] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder or Captured Preview */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-[#252536] flex items-center justify-center">
          {errorMsg ? (
            <div className="p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <p className="text-xs text-red-300 max-w-xs mx-auto">{errorMsg}</p>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Foto capturada" className="w-full h-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Guidelines overlay */}
          {!capturedImage && !errorMsg && (
            <div className="absolute inset-4 border border-dashed border-white/30 rounded-xl pointer-events-none flex items-center justify-center">
              <span className="text-[10px] font-racing font-bold tracking-widest text-white/50 bg-black/60 px-3 py-1 rounded-full uppercase">
                Enquadre a moto no centro
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="px-4 py-3 rounded-xl bg-[#1c1c28] hover:bg-[#272736] text-white text-xs font-racing font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>TIRAR OUTRA</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="px-6 py-3 rounded-xl bg-[#e60012] hover:bg-red-700 text-white text-xs font-racing font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/40"
              >
                <Check className="w-4 h-4" />
                <span>USAR ESTA FOTO</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleToggleFacingMode}
                className="px-4 py-3 rounded-xl bg-[#1c1c28] hover:bg-[#272736] text-[#a1a1aa] hover:text-white text-xs font-racing font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <FlipHorizontal className="w-4 h-4" />
                <span>ALTERNAR CÂMERA</span>
              </button>

              <button
                type="button"
                disabled={!!errorMsg}
                onClick={handleTakeSnapshot}
                className="px-6 py-3 rounded-xl bg-[#e60012] hover:bg-red-700 disabled:opacity-50 text-white text-xs font-racing font-black italic uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/40"
              >
                <Camera className="w-4 h-4" />
                <span>CAPTURAR FOTO</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
