import React from 'react';
import { User } from '../types';
import { PlusCircle, ListChecks, LogOut, MapPin } from 'lucide-react';

interface CitizenHomeProps {
  user: User;
  city: string;
  onNewIssue: () => void;
  onTrackIssues: () => void;
  onLogout: () => void;
}

const CitizenHome: React.FC<CitizenHomeProps> = ({ user, city, onNewIssue, onTrackIssues, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Minimalist Header */}
      <header className="px-6 py-6 flex justify-between items-center bg-white border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
             <MapPin className="w-3 h-3" /> {city}
          </div>
          <h1 className="text-xl font-black text-slate-800">Olá, {user.name.split(' ')[0]}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
          <img src={user.avatar} alt="Perfil" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Main Action Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-fade-in">
        
        <div className="space-y-2 max-w-xs mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">O que precisa melhorar hoje?</h2>
          <p className="text-slate-500 text-sm">Ajude a transformar a sua cidade reportando problemas reais.</p>
        </div>

        {/* Primary CTA - Big Button */}
        <button 
          onClick={onNewIssue}
          className="group relative w-full max-w-sm aspect-square max-h-64 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2rem] shadow-2xl shadow-slate-900/20 flex flex-col items-center justify-center gap-6 transition-all active:scale-95 hover:shadow-slate-900/30 border border-slate-700/50"
        >
          <div className="absolute inset-0 bg-white/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
            <PlusCircle className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-1 relative z-10">
            <span className="block text-2xl font-bold tracking-tight">Registrar Demanda</span>
            <span className="block text-xs text-slate-400 font-bold uppercase tracking-widest">Toque para iniciar</span>
          </div>
        </button>

        {/* Secondary Action */}
        <button 
          onClick={onTrackIssues}
          className="w-full max-w-sm py-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-slate-600 font-bold shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ListChecks className="w-5 h-5 text-indigo-600" />
          Acompanhar meus protocolos
        </button>

      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <button onClick={onLogout} className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center justify-center gap-2 mx-auto transition-colors">
          <LogOut className="w-3 h-3" /> Sair da conta
        </button>
      </footer>
    </div>
  );
};

export default CitizenHome;