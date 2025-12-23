import React from 'react';
import { Mission, User } from '../types';
import { Trophy, Star, Calendar, Users, Briefcase } from 'lucide-react';

interface MissionsViewProps {
  missions: Mission[];
  user: User;
  onCompleteMission: (missionId: string) => void;
}

const MissionsView: React.FC<MissionsViewProps> = ({ missions, user, onCompleteMission }) => {
  // Sort missions: Active first, then completed
  const sortedMissions = [...missions].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex items-center justify-between bg-emerald-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div>
           <h2 className="text-2xl font-bold">Missões Cidadãs</h2>
           <p className="text-emerald-100 text-sm">Complete tarefas, ganhe pontos e transforme sua cidade.</p>
        </div>
        <div className="text-center">
           <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
             <span className="block text-2xl font-bold">{user.points}</span>
             <span className="text-xs uppercase font-medium tracking-wide">Pontos</span>
           </div>
        </div>
      </header>

      <div className="space-y-4">
        {sortedMissions.map((mission) => (
          <div 
            key={mission.id}
            className={`relative bg-white p-5 rounded-xl shadow-sm border border-slate-100 transition-all ${mission.completed ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md hover:-translate-y-1'}`}
          >
            {mission.completed && (
              <div className="absolute top-3 right-3 text-emerald-500">
                <Trophy className="w-6 h-6" />
              </div>
            )}
            
            <div className="flex items-start justify-between mb-3">
               <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider 
                 ${mission.type === 'PUBLIC' ? 'bg-blue-100 text-blue-700' : 
                   mission.type === 'COMMUNITY' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                  {mission.type === 'PUBLIC' ? 'Prefeitura' : mission.type === 'COMMUNITY' ? 'Comunidade' : 'Parceiro'}
               </div>
               <div className="flex items-center text-amber-500 font-bold text-sm">
                 <Star className="w-4 h-4 mr-1 fill-current" />
                 {mission.points} pts
               </div>
            </div>

            <h3 className="font-bold text-slate-800 text-lg mb-1">{mission.title}</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">{mission.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
               <div className="flex items-center text-slate-400 text-xs">
                  {mission.type === 'PUBLIC' && <Briefcase className="w-3 h-3 mr-1" />}
                  {mission.type === 'COMMUNITY' && <Users className="w-3 h-3 mr-1" />}
                  {mission.expiry ? (
                    <span className="flex items-center text-red-400">
                      <Calendar className="w-3 h-3 mr-1" /> Expira em 2 dias
                    </span>
                  ) : <span>Sem data limite</span>}
               </div>

               <button
                 onClick={() => !mission.completed && onCompleteMission(mission.id)}
                 disabled={mission.completed}
                 className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                   ${mission.completed 
                     ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                     : 'bg-slate-900 text-white hover:bg-slate-700'}`}
               >
                 {mission.completed ? 'Concluída' : 'Participar'}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionsView;