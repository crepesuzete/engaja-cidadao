import React from 'react';
import { Reward, User } from '../types';
import { Tag, ShoppingBag } from 'lucide-react';

interface RewardsViewProps {
  rewards: Reward[];
  user: User;
}

const RewardsView: React.FC<RewardsViewProps> = ({ rewards, user }) => {
  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Clube de Benefícios</h2>
        <p className="text-slate-500">Troque seus pontos por descontos reais no comércio local.</p>
        <div className="mt-4 inline-flex items-center bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold">
           <Tag className="w-4 h-4 mr-2" />
           Saldo: {user.points} pts
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
             <div className="h-48 md:h-auto md:w-1/3 bg-slate-200 relative">
               <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" />
             </div>
             <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                   <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1 block">{reward.partner}</span>
                   <h3 className="font-bold text-lg text-slate-900 mb-2">{reward.title}</h3>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                   <span className="text-xl font-bold text-amber-500">{reward.cost} pts</span>
                   <button 
                     disabled={user.points < reward.cost}
                     className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors
                       ${user.points >= reward.cost 
                         ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                         : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                   >
                     <ShoppingBag className="w-4 h-4 mr-2" />
                     Resgatar
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsView;