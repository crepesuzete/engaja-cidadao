import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  city: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, city }) => {
  const [loadingText, setLoadingText] = useState('Conectando à cidade...');

  useEffect(() => {
    const timers = [
      setTimeout(() => setLoadingText('Verificando serviços...'), 800),
      setTimeout(() => setLoadingText('Carregando contexto...'), 1500),
      setTimeout(() => onComplete(), 2500)
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-900 text-white flex flex-col items-center justify-center z-[100]">
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <img src="https://i.imgur.com/zayXZvH.png" alt="Engaja Cidadão" className="h-24 w-auto relative z-10 drop-shadow-2xl" />
      </div>
      
      <h1 className="text-2xl font-black tracking-tight mb-1">Engaja Cidadão</h1>
      <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-8">{city}</p>

      <div className="flex items-center gap-3 text-slate-400 text-xs">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
        <span>{loadingText}</span>
      </div>
    </div>
  );
};

export default SplashScreen;