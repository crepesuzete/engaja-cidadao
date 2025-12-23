import React, { useState } from 'react';
import { Issue, IssueStatus, User, UserRole } from '../types';
import { X, Building2, Shield, Play, Mic, Send, Trash2, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

interface IssueDetailsProps {
  issue: Issue;
  currentUser: User;
  onClose: () => void;
  onSupport: (id: string) => void;
  onComment: (id: string, text: string, audio?: string) => void;
}

const IssueDetails: React.FC<IssueDetailsProps> = ({ issue, currentUser, onClose, onComment }) => {
  const isExecutive = currentUser.role === UserRole.EXECUTIVE || currentUser.role === UserRole.ADMIN;
  const officialResponse = issue.comments.find(c => c.isOfficial);
  
  // Executive Reply State
  const [replyMode, setReplyMode] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [hasAudio, setHasAudio] = useState(false);

  const handleSendReply = () => {
     if (replyText || hasAudio) {
        onComment(issue.id, replyText, hasAudio ? 'mock_audio.mp3' : undefined);
        setReplyMode(false);
     }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in p-0 sm:p-4">
       <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-auto rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                      issue.status === IssueStatus.RESOLVIDA ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                      issue.status === IssueStatus.ANALISE ? 'bg-amber-100 text-amber-700 border-amber-200' :
                      'bg-slate-200 text-slate-600 border-slate-300'
                   }`}>
                      {issue.status}
                   </span>
                   <span className="text-xs text-slate-400 font-mono">#{issue.id}</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 leading-tight">{issue.title}</h2>
             </div>
             <button onClick={onClose} className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             
             {/* Info Card */}
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                      {issue.isAnonymous ? <Shield className="w-5 h-5" /> : <img src={issue.authorAvatar} className="w-full h-full rounded-full object-cover" />}
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Autor</p>
                      <p className="text-sm font-bold text-slate-800">
                         {issue.isAnonymous ? 'Cidadão Identificado (Protegido)' : issue.authorName}
                      </p>
                   </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Descrição Institucional</p>
                   <p className="text-sm text-slate-700 leading-relaxed font-medium">"{issue.description}"</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                   <Clock className="w-3.5 h-3.5" /> {new Date(issue.createdAt).toLocaleDateString()}
                   <span>•</span>
                   <span>{issue.location.label}</span>
                </div>
             </div>

             {/* RESPOSTA DO EXECUTIVO */}
             <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                   <Building2 className="w-4 h-4 text-blue-600" /> Resposta Oficial
                </h3>

                {officialResponse ? (
                   <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="w-24 h-24" /></div>
                      
                      <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-2 border-slate-700">
                               <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                               <p className="font-bold text-sm">Gabinete Digital</p>
                               <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wide">Prefeitura Municipal</p>
                            </div>
                         </div>

                         {officialResponse.text && (
                            <p className="text-sm text-slate-200 leading-relaxed mb-4 font-medium">{officialResponse.text}</p>
                         )}

                         {officialResponse.audioUrl && (
                            <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3 border border-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors">
                               <button className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-400 transition-colors shadow-lg shrink-0">
                                  <Play className="w-4 h-4 fill-current text-white ml-0.5" />
                               </button>
                               <div className="flex-1">
                                  <div className="h-1 bg-white/20 rounded-full w-full mb-1.5 overflow-hidden">
                                     <div className="h-full w-1/3 bg-emerald-400 rounded-full"></div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Áudio do Gestor</span>
                                     <span className="text-[9px] text-white/60">00:30</span>
                                  </div>
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
                ) : (
                   <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl p-8 text-center">
                      <p className="text-sm font-bold text-slate-400">Aguardando resposta do Executivo.</p>
                   </div>
                )}
             </div>
          </div>

          {/* Executive Action Area */}
          {isExecutive && !officialResponse && (
             <div className="p-4 bg-white border-t border-slate-200">
                {!replyMode ? (
                   <button onClick={() => setReplyMode(true)} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">
                      Responder Demanda
                   </button>
                ) : (
                   <div className="bg-slate-50 p-4 rounded-xl border border-blue-100 animate-slide-up">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-blue-800 uppercase">Nova Resposta</span>
                         <button onClick={() => setReplyMode(false)}><X className="w-4 h-4 text-slate-400" /></button>
                      </div>
                      <textarea 
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Digite a resposta..."
                        rows={3}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                      ></textarea>
                      
                      <div className="flex gap-2">
                         <button 
                           onClick={() => setHasAudio(!hasAudio)}
                           className={`flex-1 py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 ${hasAudio ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-500'}`}
                         >
                            {hasAudio ? <><Trash2 className="w-4 h-4"/> Remover Áudio</> : <><Mic className="w-4 h-4"/> Gravar (30s)</>}
                         </button>
                         <button 
                           onClick={handleSendReply}
                           className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md"
                         >
                            <Send className="w-4 h-4" /> Enviar
                         </button>
                      </div>
                      {hasAudio && (
                         <div className="mt-2 text-[10px] text-center text-emerald-600 font-bold bg-emerald-50 py-1 rounded border border-emerald-100">
                            <CheckCircle2 className="w-3 h-3 inline mr-1" /> Áudio anexado com sucesso
                         </div>
                      )}
                   </div>
                )}
             </div>
          )}
       </div>
    </div>
  );
};

export default IssueDetails;