import React, { useState } from 'react';
import { User } from '../types';
import { Award, TrendingUp, Clock, Settings, Shield, MapPin, Zap, Lock, LogOut } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
  onChangeCity: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onChangeCity }) => {
  const [activeTab, setActiveTab] = useState<'BADGES' | 'HISTORY'>('BADGES');

  // XP Progress Calculation (Mock logic: Level * 1000)
  const nextLevelPoints = (user.level + 1) * 500;
  const currentLevelBase = user.level * 500;
  const progressPercent = Math.min(100, Math.max(0, ((user.points - currentLevelBase) / (nextLevelPoints - currentLevelBase)) * 100));

  return (
    <div className="h-full bg-slate-50 overflow-y-auto pb-24 animate-fade-in">
      
      {/* 1. Header Card */}
      <div className="bg-white p-6 pb-8 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-32 bg-emerald-600"></div>
         
         <div className="relative pt-12 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200">
               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            
            <h2 className="mt-3 text-2xl font-bold text-slate-800">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Nível {user.level}
               </span>
               <span className="text-sm text-slate-500">Cidadão Verificado</span>
            </div>

            {/* XP Bar */}
            <div className="w-full max-w-xs mt-6">
               <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>{user.points} XP</span>
                  <span>{nextLevelPoints} XP</span>
               </div>
               <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
               </div>
               <p className="text-center text-[10px] text-slate-400 mt-2">
                 Faltam {nextLevelPoints - user.points} pontos para o nível {user.level + 1}
               </p>
            </div>
         </div>
      </div>

      {/* 2. Impact Stats */}
      <div className="grid grid-cols-2 gap-4 px-6 -mt-6 relative z-10">
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
            <span className="text-2xl font-bold text-slate-800">{user.recentActivity.filter(a => a.type === 'ISSUE_CREATED').length}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wide">Reportes</span>
         </div>
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <Zap className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-2xl font-bold text-slate-800">{user.recentActivity.filter(a => a.type === 'MISSION_COMPLETED').length}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wide">Missões</span>
         </div>
      </div>

      {/* 3. Tabs Navigation */}
      <div className="px-6 mt-8">
         <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex">
            <button 
              onClick={() => setActiveTab('BADGES')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'BADGES' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Conquistas
            </button>
            <button 
              onClick={() => setActiveTab('HISTORY')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'HISTORY' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Histórico
            </button>
         </div>
      </div>

      {/* 4. Content Area */}
      <div className="px-6 mt-6">
         {activeTab === 'BADGES' && (
           <div className="grid grid-cols-2 gap-4 animate-slide-up">
              {user.badges.map(badge => (
                 <div key={badge.id} className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${badge.unlocked ? 'bg-white border-emerald-100 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60 grayscale'}`}>
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">{badge.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{badge.description}</p>
                    {!badge.unlocked && <Lock className="w-3 h-3 text-slate-400 mt-2" />}
                 </div>
              ))}
           </div>
         )}

         {activeTab === 'HISTORY' && (
           <div className="space-y-4 animate-slide-up">
              {user.recentActivity.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-4">Nenhuma atividade recente.</p>
              ) : (
                user.recentActivity.map(activity => (
                  <div key={activity.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                          ${activity.type === 'LEVEL_UP' ? 'bg-purple-100 text-purple-600' :
                            activity.type === 'MISSION_COMPLETED' ? 'bg-amber-100 text-amber-600' :
                            activity.type === 'REWARD_REDEEMED' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                          }`}>
                           {activity.type === 'LEVEL_UP' ? <Award className="w-5 h-5" /> :
                            activity.type === 'REWARD_REDEEMED' ? <Zap className="w-5 h-5" /> :
                            <TrendingUp className="w-5 h-5" />}
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-slate-800">{activity.title}</h4>
                           <p className="text-xs text-slate-400">{activity.date.toLocaleDateString()}</p>
                        </div>
                     </div>
                     <span className={`text-sm font-bold ${activity.pointsEarned > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                       {activity.pointsEarned > 0 ? '+' : ''}{activity.pointsEarned} pts
                     </span>
                  </div>
                ))
              )}
           </div>
         )}
      </div>

      {/* 5. Account Actions */}
      <div className="px-6 mt-8 mb-6 space-y-3">
         <button 
           onClick={onChangeCity}
           className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50"
         >
            <MapPin className="w-4 h-4" /> Alterar Cidade
         </button>
         <button 
           onClick={onLogout}
           className="w-full py-3 bg-red-50 border border-red-100 text-red-600 font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-red-100"
         >
            <LogOut className="w-4 h-4" /> Sair da Conta
         </button>
      </div>

    </div>
  );
};

export default ProfileView;