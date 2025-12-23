<<<<<<< HEAD
import React, { useState, useRef } from 'react';
import { Issue, IssueStatus, User, UserRole } from '../types';
import { X, Send, ThumbsUp, ShieldCheck, Clock, CheckCircle, AlertTriangle, Building2, Shield, Play, Trash2, StopCircle, Mic } from 'lucide-react';
=======
import React, { useState } from 'react';
import { Issue, IssueStatus, User, Comment } from '../types';
import { X, Send, ThumbsUp, MessageSquare, ShieldCheck, Clock, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Building2, User as UserIcon, Shield, Flag, Image as ImageIcon, Video, Mic, Play } from 'lucide-react';
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf

interface IssueDetailsProps {
  issue: Issue;
  currentUser: User;
  onClose: () => void;
  onSupport: (issueId: string) => void;
<<<<<<< HEAD
  onComment: (issueId: string, text: string, audioUrl?: string) => void; // Removed video for now as per prompt "future phase"
=======
  onComment: (issueId: string, text: string) => void;
  onFlag?: (issueId: string) => void; // New prop for flagging
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
}

const IssueDetails: React.FC<IssueDetailsProps> = ({ 
  issue, 
  currentUser, 
  onClose, 
  onSupport, 
<<<<<<< HEAD
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
=======
  onComment,
  onFlag
}) => {
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'DISCUSSION'>('DETAILS');
  const [showFlagModal, setShowFlagModal] = useState(false);
  
  const isSupported = issue.supportedBy.includes(currentUser.id);
  const isFlaggedByMe = issue.flaggedBy.includes(currentUser.id);
  const officialResponse = issue.comments.find(c => c.isOfficial);
  const communityComments = issue.comments.filter(c => !c.isOfficial);
  const hasAttachments = issue.attachments && issue.attachments.length > 0;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(issue.id, newComment);
      setNewComment('');
    }
  };

  const handleFlagConfirm = () => {
    if (onFlag) {
      onFlag(issue.id);
      setShowFlagModal(false);
    }
  };

  const getStatusConfig = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.RESOLVIDA:
        return { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Resolvido' };
      case IssueStatus.EXECUCAO:
        return { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Em Execução' };
      case IssueStatus.ANALISE:
        return { color: 'bg-amber-100 text-amber-800', icon: AlertTriangle, label: 'Em Análise' };
      default:
        return { color: 'bg-slate-100 text-slate-800', icon: ShieldCheck, label: 'Registrada' };
    }
  };

  const statusConfig = getStatusConfig(issue.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl z-[60] flex flex-col animate-slide-in-right">
      
      {/* Flagging Modal */}
      {showFlagModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <div className="flex flex-col items-center text-center mb-4">
                 <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                    <Flag className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-800">Denunciar Conteúdo</h3>
                 <p className="text-sm text-slate-500">Ajude a manter a comunidade segura e verdadeira.</p>
              </div>
              
              <div className="space-y-2 mb-6">
                 <p className="text-xs font-bold text-slate-700 uppercase">Motivo da denúncia:</p>
                 <button className="w-full text-left p-3 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Fake News / Informação Falsa</button>
                 <button className="w-full text-left p-3 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Conteúdo Ofensivo / Ódio</button>
                 <button className="w-full text-left p-3 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Spam / Propaganda Política</button>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setShowFlagModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm">Cancelar</button>
                 <button onClick={handleFlagConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700">Confirmar Denúncia</button>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50">
        <div className="flex justify-between items-start mb-4">
           <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusConfig.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
           </div>
           
           <div className="flex gap-2">
             <button 
               onClick={() => setShowFlagModal(true)}
               disabled={isFlaggedByMe}
               className={`p-1.5 rounded-full transition-colors ${isFlaggedByMe ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
               title="Denunciar Abuso"
             >
               <Flag className={`w-5 h-5 ${isFlaggedByMe ? 'fill-current' : ''}`} />
             </button>
             <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
               <X className="w-5 h-5" />
             </button>
           </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">{issue.title}</h2>
        <p className="text-xs text-slate-500 flex items-center">
           Protocolo: #{issue.id.toUpperCase()} • {new Date(issue.createdAt).toLocaleDateString()}
        </p>

        {issue.moderationStatus === 'UNDER_REVIEW' && (
           <div className="mt-3 bg-red-50 border border-red-100 text-red-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Conteúdo sob revisão comunitária devido a denúncias.
           </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/30">
        
        {/* AUTHOR INFO (PROTECTED) */}
        <div className="px-5 py-3 bg-white border-b border-slate-100">
           <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${issue.isAnonymous ? 'bg-slate-800' : 'bg-slate-200'}`}>
                 {issue.isAnonymous ? (
                    <Shield className="w-5 h-5 text-white" />
                 ) : (
                    <img src={issue.authorAvatar} alt={issue.authorName} className="w-full h-full rounded-full object-cover" />
                 )}
              </div>
              <div>
                 <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-0.5">Reportado por</p>
                 <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-bold ${issue.isAnonymous ? 'text-slate-500 italic' : 'text-slate-900'}`}>
                       {issue.isAnonymous ? 'Identidade Preservada' : issue.authorName}
                    </span>
                    {issue.isAnonymous && (
                       <span className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                          Denúncia Segura
                       </span>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* SECTION 1: OFFICIAL RESPONSE */}
        <div className="p-4 pb-0">
          {officialResponse ? (
            <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
               <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-blue-800">Resposta da Prefeitura</h3>
               </div>
               <div className="p-4">
                  <div className="flex items-start gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <img src="https://ui-avatars.com/api/?name=Prefeitura&background=0284c7&color=fff" className="w-8 h-8 rounded-full" alt="Gov" />
                     </div>
                     <div>
                        <p className="text-sm text-slate-800 leading-relaxed">{officialResponse.text}</p>
                        <p className="text-[10px] text-slate-400 mt-2">
                           Respondido por {officialResponse.userName} em {new Date(officialResponse.createdAt).toLocaleDateString()}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-xl border border-slate-200 p-4 flex items-center justify-center gap-2 text-slate-500">
               <Clock className="w-4 h-4" />
               <span className="text-xs font-medium">Aguardando posicionamento oficial</span>
            </div>
          )}
        </div>

        {/* SECTION 2: ATTACHMENTS (NEW) */}
        {hasAttachments && (
           <div className="p-4 pb-0">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Evidências Anexadas</h3>
              <div className="grid grid-cols-2 gap-2">
                 {issue.attachments.map(att => (
                    <div key={att.id} className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                       <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                          {att.type === 'IMAGE' ? (
                             <img src={att.url} className="w-full h-full object-cover" alt="attachment" />
                          ) : att.type === 'VIDEO' ? (
                             <Video className="w-5 h-5" />
                          ) : (
                             <Mic className="w-5 h-5" />
                          )}
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{att.name || 'Anexo'}</p>
                          <p className="text-[10px] text-slate-400">{att.type === 'IMAGE' ? 'Foto' : att.type}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* SECTION 3: DETAILS */}
        <div className="p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Descrição da Ocorrência</h3>
             <p className="text-sm text-slate-700 leading-relaxed">
               {issue.description}
             </p>
             {issue.aiAnalysis && (
               <div className="mt-3 text-xs bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg border border-indigo-100">
                  🤖 <b>Análise IA:</b> {issue.aiAnalysis}
               </div>
             )}
          </div>
        </div>

        {/* SECTION 4: COMMUNITY ACTION */}
        <div className="p-4 pt-0 grid grid-cols-2 gap-3">
           <button 
             onClick={() => onSupport(issue.id)}
             className={`py-3 rounded-xl font-bold text-sm flex items-col sm:flex-row items-center justify-center gap-2 transition-all active:scale-95 border
               ${isSupported 
                 ? 'bg-emerald-50 text-emerald-700 border-emerald-500' 
                 : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'}`}
           >
             <ThumbsUp className={`w-4 h-4 ${isSupported ? 'fill-current' : ''}`} />
             <span>{isSupported ? 'Apoiado' : 'Apoiar'}</span>
             <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
               {issue.votes + issue.supportedBy.length}
             </span>
           </button>
           
           <div className="py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
             <MessageSquare className="w-4 h-4" />
             <span>Comentar</span>
           </div>
        </div>

        {/* SECTION 5: DISCUSSION ACCORDION */}
        <div className="p-4 pt-0">
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <button 
               onClick={() => setActiveTab(activeTab === 'DISCUSSION' ? 'DETAILS' : 'DISCUSSION')}
               className="w-full px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center"
             >
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  Comentários da Comunidade ({communityComments.length})
                </span>
                {activeTab === 'DISCUSSION' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
             </button>
             
             {activeTab === 'DISCUSSION' && (
               <div className="divide-y divide-slate-100">
                 {communityComments.length === 0 ? (
                   <div className="p-6 text-center text-slate-400 text-sm">
                     Seja o primeiro a comentar!
                   </div>
                 ) : (
                   communityComments.map(comment => (
                     <div key={comment.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                           <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{comment.userName}</span>
                              <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <p className="text-sm text-slate-600">{comment.text}</p>
                     </div>
                   ))
                 )}
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Input Footer */}
      <div className="p-4 bg-white border-t border-slate-200">
         <form onSubmit={handleSubmitComment} className="relative">
           <input 
             type="text"
             value={newComment}
             onChange={(e) => setNewComment(e.target.value)}
             placeholder="Escreva um comentário..."
             className="w-full bg-slate-100 border-none rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all shadow-inner"
           />
           <button 
             disabled={!newComment.trim()}
             type="submit"
             className="absolute right-2 top-1.5 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
           >
             <Send className="w-4 h-4" />
           </button>
         </form>
      </div>
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
    </div>
  );
};

export default IssueDetails;