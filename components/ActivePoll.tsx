import React, { useState } from 'react';
import { Poll } from '../types';
import { BarChart2, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ActivePollProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
}

const ActivePoll: React.FC<ActivePollProps> = ({ poll, onVote }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!poll.active) return null;

  const handleVote = () => {
    if (selectedOption) {
      onVote(poll.id, selectedOption);
    }
  };

  return (
    <div className="relative z-40 flex-1 min-w-[200px] ml-auto">
      {/* Minimized Trigger Button (Fills the remaining space) */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full h-full flex items-center justify-center gap-3 px-3 py-2 transition-all border-l border-b border-slate-200
          ${isExpanded ? 'bg-indigo-50 border-indigo-100' : 'bg-white hover:bg-slate-50'}`}
      >
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm shadow-indigo-200">
           <BarChart2 className="w-4 h-4" />
        </div>
        
        <div className="flex flex-col items-start leading-none">
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Consulta Pública</span>
           <span className="text-xs font-black text-indigo-700 tracking-tight">VOTE NAS MUDANÇAS</span>
        </div>
        
        <div className="hidden sm:flex bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">
          +{poll.points} pts
        </div>
      </button>

      {/* Expanded Dropdown (Absolute position relative to the button container) */}
      {isExpanded && (
        <>
          {/* Backdrop to close when clicking outside */}
          <div className="fixed inset-0 z-30" onClick={() => setIsExpanded(false)}></div>

          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden animate-slide-down origin-top-right z-40 mr-2">
             {/* Header */}
             <div className="bg-indigo-50 p-3 border-b border-indigo-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wide">Consulta Pública</h3>
                </div>
                <button onClick={() => setIsExpanded(false)} className="text-indigo-400 hover:text-indigo-600">
                   <ChevronUp className="w-4 h-4" />
                </button>
             </div>

             {poll.userHasVoted ? (
               // Results View
               <div className="p-4 bg-white">
                   <div className="flex items-center gap-2 mb-3 text-emerald-600 font-bold text-sm bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                      <CheckCircle className="w-4 h-4" /> Voto Registrado!
                   </div>
                   <h3 className="text-sm font-bold text-slate-800 mb-4">{poll.question}</h3>
                   
                   <div className="space-y-3">
                      {poll.options.map(opt => {
                         const percent = Math.round((opt.votes / poll.totalVotes) * 100) || 0;
                         const isWinning = Math.max(...poll.options.map(o => o.votes)) === opt.votes;
                         
                         return (
                           <div key={opt.id}>
                              <div className="flex justify-between text-xs mb-1">
                                 <span className={`font-medium ${isWinning ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>{opt.text}</span>
                                 <span className="text-slate-500">{percent}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                   className={`h-full rounded-full transition-all duration-1000 ${isWinning ? 'bg-indigo-500' : 'bg-slate-300'}`} 
                                   style={{width: `${percent}%`}}
                                 ></div>
                              </div>
                           </div>
                         );
                      })}
                   </div>
                   <p className="text-[9px] text-center text-slate-400 mt-3">Total: {poll.totalVotes} votos</p>
               </div>
             ) : (
               // Voting View
               <div className="p-4 bg-white">
                  <h3 className="font-bold text-sm text-slate-800 mb-3 leading-snug">{poll.question}</h3>
                  
                  <div className="space-y-2 mb-4">
                     {poll.options.map(opt => (
                       <button
                         key={opt.id}
                         onClick={() => setSelectedOption(opt.id)}
                         className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between group
                           ${selectedOption === opt.id 
                             ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                             : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-white hover:border-indigo-200 hover:shadow-sm'}`}
                       >
                         {opt.text}
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedOption === opt.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 bg-white'}`}>
                            {selectedOption === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                         </div>
                       </button>
                     ))}
                  </div>

                  <button
                    onClick={handleVote}
                    disabled={!selectedOption}
                    className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
                  >
                    Confirmar Voto
                  </button>
               </div>
             )}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivePoll;