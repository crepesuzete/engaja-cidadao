import React, { useState, useRef } from 'react';
import { Issue, IssueStatus, User, UserRole } from '../types';
import { X, Send, ThumbsUp, ShieldCheck, Clock, CheckCircle, AlertTriangle, Building2, Shield, Play, Trash2, StopCircle, Mic } from 'lucide-react';

interface IssueDetailsProps {
  issue: Issue;
  currentUser: User;
  onClose: () => void;
  onSupport: (issueId: string) => void;
  onComment: (issueId: string, text: string, audioUrl?: string) => void; // Removed video for now as per prompt "future phase"
}

const IssueDetails: React.FC<IssueDetailsProps> = ({ 
  issue, 
  currentUser, 
  onClose, 
  onSupport, 
  onComment
}) => {
  const [responseMode, setResponseMode] = useState(false);
  const [responseText, setResponseText] = useState('');
  
  // Executive Media State
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<any>(null);
  const [audioAttachment, setAudioAttachment] = useState<string | null>(null);

  const isExecutive = currentUser.role === UserRole.EXECUTIVE || currentUser.role === UserRole.ADMIN;
  const officialResponse = issue.comments.find(c => c.isOfficial);

  // --- RECORDING LOGIC (Mock) ---
  const startRecording = () => {
    setIsRecording(true);
    setTimer(0);
    timerRef.current = setInterval(() => {
       setTimer(t => t + 1);
    }, 1000);
  };

  const stopRecording = (save: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    
    if (save) {
       setAudioAttachment('mock_audio_url.mp3');
    }
    setTimer(0);
  };

  const handleSubmitResponse = () => {
    if (responseText.trim() || audioAttachment) {
      onComment(issue.id, responseText, audioAttachment || undefined);
      setResponseMode(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6 animate-fade-in">
      <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up relative">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start shrink-0">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                    issue.status === IssueStatus.RESOLVIDA ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                    'bg-amber-100 text-amber-700 border-amber-200'
                 }`}>
                    {issue.status}
                 </span>
                 <span className="text-xs text-slate-400 font-mono">#{issue.id.toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{issue.title}</h2>
           </div>
           <button onClick={onClose} className="bg-white p-2 rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
           
           {/* Info Card */}
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                    {issue.isAnonymous ? <Shield className="w-5 h-5" /> : <img src={issue.authorAvatar} className="w-full h-full rounded-full object-cover" />}
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Registrado por</p>
                    <p className="text-sm font-bold text-slate-800">
                       {issue.isAnonymous ? 'Cidadão Identificado (Dados Protegidos)' : issue.authorName}
                    </p>
                 </div>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-600 text-sm leading-relaxed">
                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Descrição Institucional</p>
                 {issue.description}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                 <Clock className="w-3.5 h-3.5" /> {new Date(issue.createdAt).toLocaleDateString()}
                 <span>•</span>
                 <span className="text-slate-500 font-bold">{issue.location.label}</span>
              </div>
           </div>

           {/* OFFICIAL RESPONSE SECTION */}
           <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                 <Building2 className="w-4 h-4 text-blue-600" /> Resposta Oficial
              </h3>

              {officialResponse ? (
                 <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <ShieldCheck className="w-32 h-32" />
                    </div>
                    
                    <div className="relative z-10">
                       <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-lg">
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
                             <button className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-400 transition-colors shadow-lg">
                                <Play className="w-4 h-4 fill-current text-white ml-0.5" />
                             </button>
                             <div className="flex-1">
                                <div className="h-1 bg-white/20 rounded-full w-full mb-1.5 overflow-hidden">
                                   <div className="h-full w-1/3 bg-emerald-400 rounded-full"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                   <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Mensagem do Gestor</span>
                                   <span className="text-[9px] text-white/60">00:30</span>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              ) : (
                 <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl p-8 text-center flex flex-col items-center gap-2">
                    <Clock className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-bold text-slate-400">Aguardando posicionamento oficial</p>
                    <p className="text-xs text-slate-400">Prazo estimado: 48h</p>
                 </div>
              )}
           </div>
        </div>

        {/* Executive Action Bar */}
        {isExecutive && !officialResponse && (
           <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              {!responseMode ? (
                 <button 
                   onClick={() => setResponseMode(true)}
                   className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                 >
                    <Building2 className="w-5 h-5" /> Responder como Executivo
                 </button>
              ) : (
                 <div className="bg-slate-50 p-4 rounded-2xl border border-blue-100 animate-slide-up shadow-inner">
                    <div className="flex justify-between items-center mb-3">
                       <p className="text-xs font-bold text-blue-800 uppercase">Nova Resposta Oficial</p>
                       <button onClick={() => setResponseMode(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4"/></button>
                    </div>
                    
                    <textarea 
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm mb-3 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                      rows={3}
                      placeholder="Digite a resposta institucional..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    ></textarea>

                    {/* Audio Recorder */}
                    {isRecording ? (
                       <div className="flex items-center gap-3 bg-red-100 p-3 rounded-xl text-red-700 mb-3 border border-red-200">
                          <div className="animate-pulse w-3 h-3 bg-red-600 rounded-full"></div>
                          <span className="text-xs font-mono font-bold flex-1">Gravando: {formatTime(timer)} / 0:30</span>
                          <button onClick={() => stopRecording(true)} className="p-1.5 bg-white rounded-full text-red-600 shadow-sm hover:scale-110 transition-transform"><StopCircle className="w-5 h-5" /></button>
                       </div>
                    ) : !audioAttachment ? (
                       <button onClick={startRecording} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 mb-4 transition-colors py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50">
                          <Mic className="w-4 h-4" />
                          Gravar Áudio (30s)
                       </button>
                    ) : (
                       <div className="flex items-center justify-between mb-4 text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                          <div className="flex items-center gap-2">
                             <CheckCircle className="w-4 h-4" /> Áudio Gravado com Sucesso
                          </div>
                          <button onClick={() => setAudioAttachment(null)} className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    )}

                    <button 
                      onClick={handleSubmitResponse} 
                      className="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md flex items-center justify-center gap-2"
                    >
                       Enviar Resposta <Send className="w-4 h-4" />
                    </button>
                 </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

export default IssueDetails;