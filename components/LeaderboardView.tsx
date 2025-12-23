import React from 'react';
import { User, UserRole } from '../types';
import { Trophy, Medal, Crown, TrendingUp, MapPin, Star } from 'lucide-react';

interface LeaderboardViewProps {
  currentUser: User;
}

// Mock Data generator for the leaderboard
const generateMockLeaderboard = (currentUser: User) => {
  const baseUsers = [
    { id: 'l1', name: 'Ricardo Mendes', points: 3450, avatar: 'https://ui-avatars.com/api/?name=Ricardo+Mendes&background=eab308&color=fff', neighborhood: 'Centro', level: 8 },
    { id: 'l2', name: 'Fernanda Lima', points: 3120, avatar: 'https://ui-avatars.com/api/?name=Fernanda+Lima&background=94a3b8&color=fff', neighborhood: 'Jd. Flores', level: 7 },
    { id: 'l3', name: 'Carlos Duba', points: 2890, avatar: 'https://ui-avatars.com/api/?name=Carlos+Duba&background=b45309&color=fff', neighborhood: 'Vila Nova', level: 7 },
    { id: 'l4', name: 'Patricia Poeta', points: 2100, avatar: 'https://ui-avatars.com/api/?name=Patricia+Poeta&background=random', neighborhood: 'Centro', level: 5 },
    { id: 'l5', name: 'João Kleber', points: 1800, avatar: 'https://ui-avatars.com/api/?name=Joao+Kleber&background=random', neighborhood: 'Zona Norte', level: 4 },
  ];

  // Insert current user and sort
  const allUsers = [...baseUsers, { 
    id: currentUser.id, 
    name: currentUser.name, 
    points: currentUser.points, 
    avatar: currentUser.avatar, 
    neighborhood: 'Meu Perfil',
    level: currentUser.level
  }];

  // Sort descending by points and remove duplicates if any
  return allUsers.sort((a, b) => b.points - a.points).filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
};

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUser }) => {
  const leaderboard = generateMockLeaderboard(currentUser);
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="h-full bg-slate-50 overflow-y-auto pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-indigo-600 p-6 pb-12 rounded-b-[2.5rem] shadow-lg text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <TrendingUp className="w-full h-full" />
        </div>
        <div className="relative z-10">
            <h2 className="text-2xl font-black uppercase tracking-wide">Ranking Cidadão</h2>
            <p className="text-indigo-200 text-sm">Quem mais transforma a cidade?</p>
        </div>
      </div>

      {/* Podium Section */}
      <div className="flex justify-center items-end gap-2 -mt-10 px-4 mb-8">
        
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
            <div className="relative mb-2">
                <img src={top3[1].avatar} className="w-16 h-16 rounded-full border-4 border-slate-300 shadow-md" alt="2nd" />
                <div className="absolute -bottom-2 -right-1 bg-slate-400 text-white text-[10px] font-bold px-1.5 rounded-full border border-white">2</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-t-lg p-3 w-24 flex flex-col items-center shadow-sm h-32 justify-end">
                <span className="font-bold text-xs text-slate-800 text-center leading-tight mb-1">{top3[1].name.split(' ')[0]}</span>
                <span className="text-xs font-black text-slate-500">{top3[1].points}</span>
            </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center z-10">
            <div className="relative mb-2">
                <Crown className="w-8 h-8 text-yellow-400 absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce" />
                <img src={top3[0].avatar} className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-xl" alt="1st" />
                <div className="absolute -bottom-2 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 rounded-full border border-white">1</div>
            </div>
            <div className="bg-gradient-to-b from-yellow-50 to-white rounded-t-xl p-3 w-28 flex flex-col items-center shadow-md h-40 justify-end border-t-4 border-yellow-400">
                <span className="font-bold text-sm text-slate-900 text-center leading-tight mb-1">{top3[0].name.split(' ')[0]}</span>
                <span className="text-sm font-black text-yellow-600">{top3[0].points}</span>
                <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold">Campeão</span>
            </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
            <div className="relative mb-2">
                <img src={top3[2].avatar} className="w-16 h-16 rounded-full border-4 border-orange-300 shadow-md" alt="3rd" />
                <div className="absolute -bottom-2 -right-1 bg-orange-400 text-white text-[10px] font-bold px-1.5 rounded-full border border-white">3</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-t-lg p-3 w-24 flex flex-col items-center shadow-sm h-24 justify-end">
                <span className="font-bold text-xs text-slate-800 text-center leading-tight mb-1">{top3[2].name.split(' ')[0]}</span>
                <span className="text-xs font-black text-slate-500">{top3[2].points}</span>
            </div>
        </div>
      </div>

      {/* List Section */}
      <div className="px-4 space-y-3">
        {rest.map((user, index) => {
           const isMe = user.id === currentUser.id;
           return (
             <div key={user.id} className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm border transition-all ${isMe ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-100'}`}>
                <span className="text-slate-400 font-bold w-4 text-center">{index + 4}</span>
                
                <img src={user.avatar} className="w-10 h-10 rounded-full bg-slate-200" alt={user.name} />
                
                <div className="flex-1">
                   <h3 className={`text-sm font-bold ${isMe ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {user.name} {isMe && '(Você)'}
                   </h3>
                   <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {user.neighborhood}</span>
                      <span>• Nível {user.level}</span>
                   </div>
                </div>

                <div className="text-right">
                   <div className="flex items-center gap-1 font-black text-indigo-600">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {user.points}
                   </div>
                </div>
             </div>
           );
        })}
      </div>
      
      <div className="mt-8 text-center px-8">
         <p className="text-xs text-slate-400">
            O ranking é atualizado semanalmente. Os 3 primeiros ganham medalhas digitais e destaque no jornal do bairro!
         </p>
      </div>
    </div>
  );
};

export default LeaderboardView;