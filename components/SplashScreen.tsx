import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  city: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, city }) => {
  const [status, setStatus] = useState('Conectando...');

  useEffect(() => {
    // Simula carregamento de contexto leve (1-2s)
    setTimeout(() => setStatus('Verificando sessão...'), 800);
    setTimeout(() => setStatus('Carregando alertas...'), 1400);
    setTimeout(() => onComplete(), 2000);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50 text-white font-sans">
      <div className="relative mb-6">
         <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full"></div>
         <img src="https://i.imgur.com/zayXZvH.png" alt="Logo" className="h-20 w-auto relative z-10" />
      </div>
      
      <h1 className="text-2xl font-black tracking-tight mb-1">Engaja Cidadão</h1>
      <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-10">{city}</p>
      
      <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
        <Loader2 className="w-3 h-3 animate-spin" />
        {status}
      </div>
    </div>
  );
};

export default SplashScreen;