import React from 'react';
import { User } from '../types';
import { Plus, ListChecks, LogOut, MapPin, User as UserIcon } from 'lucide-react';

interface CitizenHomeProps {
  user: User;
  city: string;
  onStartFlow: () => void;
  onViewTracking: () => void;
  onLogout: () => void;
}

const CitizenHome: React.FC<CitizenHomeProps> = ({ user, city, onStartFlow, onViewTracking, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header Minimalista */}
      <header className="px-6 py-6 flex justify-between items-center bg-white border-b border-slate-100">
        <div>
           <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
              <MapPin className="w-3 h-3" /> {city}
           </div>
           <h1 className="text-lg font-black text-slate-800">Olá, {user.name.split(' ')[0]}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
           <img src={user.avatar} alt="Perfil" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Área Principal de Decisão Única */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in pb-20">
        
        <div className="mb-10 max-w-xs">
          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-3">O que precisa melhorar?</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Ajude a prefeitura a cuidar da cidade reportando problemas reais.</p>
        </div>

        {/* CTA Único e Gigante */}
        <button 
          onClick={onStartFlow}
          className="group relative w-full max-w-sm aspect-square max-h-72 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 flex flex-col items-center justify-center gap-6 transition-all active:scale-95 border border-slate-700/50 hover:shadow-slate-900/40"
        >
           <div className="absolute inset-0 bg-white/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
           
           <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform duration-300 relative z-10">
              <Plus className="w-10 h-10 text-white stroke-[3]" />
           </div>
           
           <div className="space-y-1 relative z-10">
              <span className="block text-2xl font-bold tracking-tight">Registrar Demanda</span>
              <span className="block text-xs text-slate-400 font-bold uppercase tracking-widest">Toque para iniciar</span>
           </div>
        </button>

      </main>

      {/* Rodapé com Ações Secundárias Discretas */}
      <footer className="p-6">
        <button 
          onClick={onViewTracking}
          className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm mb-4"
        >
           <ListChecks className="w-5 h-5 text-indigo-600" />
           Acompanhar meus protocolos
        </button>

        <button onClick={onLogout} className="w-full py-2 text-xs font-bold text-red-400 hover:text-red-600 flex items-center justify-center gap-1 transition-colors">
           <LogOut className="w-3 h-3" /> Sair da conta
        </button>
      </footer>
    </div>
  );
};

export default CitizenHome;