import React, { useState } from 'react';
import { Issue, IssueStatus, IssueCategory } from '../types';
import { ChevronDown, ChevronUp, MapPin, MessageCircle, AlertCircle, CheckCircle, Clock, ArrowRightCircle, Volume2, Video, Play } from 'lucide-react';

interface IssueListSidebarProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onFocusLocation: (lat: number, lng: number) => void;
}

const IssueListSidebar: React.FC<IssueListSidebarProps> = ({ issues, onSelectIssue, onFocusLocation }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Default to closed to show the grid button first

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.RESOLVIDA: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case IssueStatus.EXECUCAO: return 'bg-blue-100 text-blue-800 border-blue-200';
      case IssueStatus.ANALISE: return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Helper to find the latest official response
  const getOfficialResponse = (issue: Issue) => {
    return issue.comments.find(c => c.isOfficial);
  };

<<<<<<< HEAD
  // Updated handler to open media
  const handlePlayMedia = (url: string | undefined, type: 'audio' | 'video', e: React.MouseEvent) => {
    e.stopPropagation();
    if (url) {
        window.open(url, '_blank');
    } else {
        alert(`Nenhuma mídia anexada a esta resposta.`);
    }
=======
  // Mock function to simulate playing media
  const handlePlayMedia = (type: 'audio' | 'video', e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Abrindo player de ${type === 'audio' ? 'áudio' : 'vídeo'}... (Funcionalidade demonstrativa)`);
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-[4.5rem] left-2 z-20 bg-white h-12 w-[30vw] rounded-xl shadow-lg border border-slate-200 text-slate-700 font-bold text-[10px] sm:text-xs flex flex-col items-center justify-center gap-0.5 hover:bg-slate-50 transition-all leading-none"
      >
        <MessageCircle className="w-4 h-4 text-slate-400" />
        <span>Ver Lista ({issues.length})</span>
      </button>
    );
  }

  return (
    <div className="absolute top-[4.5rem] left-2 z-20 w-[95vw] sm:w-80 max-h-[70vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white animate-slide-in-left">
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center sticky top-0">
        <div>
           <h3 className="font-bold text-slate-800">Ocorrências</h3>
           <p className="text-xs text-slate-500">{issues.length} registradas na região</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
          <ChevronUp className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Accordion List */}
      <div className="overflow-y-auto flex-1 custom-scrollbar bg-slate-100/50 p-2 space-y-2">
        {issues.map(issue => {
          const isExpanded = expandedId === issue.id;
          const officialResponse = getOfficialResponse(issue);
          
          return (
            <div 
              key={issue.id} 
              className={`bg-white rounded-xl border transition-all duration-200 ${isExpanded ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20' : 'border-slate-200 shadow-sm hover:border-emerald-300'}`}
            >
              {/* Card Header (Always Visible) */}
              <div 
                onClick={() => toggleExpand(issue.id)}
                className="p-3 cursor-pointer flex items-start gap-3"
              >
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${issue.status === IssueStatus.RESOLVIDA ? 'bg-emerald-500' : issue.status === IssueStatus.REGISTRADA ? 'bg-red-500' : 'bg-amber-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{issue.category}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 leading-snug truncate">{issue.title}</h4>
                  
                  {/* Small preview text if collapsed */}
                  {!isExpanded && (
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] font-medium text-slate-400">
                      {issue.status === IssueStatus.RESOLVIDA ? (
                        <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Resolvido</span>
                      ) : issue.status === IssueStatus.REGISTRADA ? (
                        <span className="text-red-400 flex items-center gap-1"><Clock className="w-3 h-3"/> Aguardando</span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-1"><ArrowRightCircle className="w-3 h-3"/> Em andamento</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Accordion Body (Expanded) */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-0 animate-fade-in">
                  <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                    "{issue.description}"
                  </p>

                  {/* TRAFFIC LIGHT STATUS BOXES */}
                  
                  {/* 1. GREEN BOX: RESOLVIDA */}
                  {issue.status === IssueStatus.RESOLVIDA ? (
                    <div className="mb-3 bg-emerald-600 text-white rounded-lg p-3 shadow-sm border border-emerald-700 relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="flex items-center gap-1.5 mb-1.5 border-b border-emerald-500/50 pb-1.5">
                              <CheckCircle className="w-4 h-4 text-emerald-100" />
                              <span className="text-xs font-bold uppercase tracking-wide">Prefeitura Respondeu</span>
                          </div>
                          <p className="text-xs font-medium leading-relaxed opacity-95">
                            {officialResponse ? `"${officialResponse.text}"` : "A solicitação foi marcada como resolvida pela equipe técnica."}
                          </p>
                          
                          {/* MULTIMEDIA BUTTONS */}
<<<<<<< HEAD
                          <div className="mt-3 flex gap-2 flex-wrap">
                             {officialResponse?.audioUrl && (
                               <button 
                                 onClick={(e) => handlePlayMedia(officialResponse.audioUrl, 'audio', e)}
                                 className="flex items-center gap-1.5 text-[10px] font-bold bg-black/20 hover:bg-black/30 text-white px-2.5 py-1.5 rounded-lg transition-colors"
                               >
                                  <Volume2 className="w-3 h-3" />
                                  Ouvir Mensagem
                               </button>
                             )}
                             
                             {officialResponse?.videoUrl && (
                               <button 
                                 onClick={(e) => handlePlayMedia(officialResponse.videoUrl, 'video', e)}
                                 className="w-full flex items-center justify-center gap-1.5 text-[10px] font-black bg-red-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-all animate-pulse border border-red-400"
                               >
                                  <Video className="w-4 h-4" />
                                  VER VÍDEO DO PREFEITO
                               </button>
                             )}
=======
                          <div className="mt-3 flex gap-2">
                             <button 
                               onClick={(e) => handlePlayMedia('audio', e)}
                               className="flex items-center gap-1.5 text-[10px] font-bold bg-black/20 hover:bg-black/30 text-white px-2.5 py-1.5 rounded-lg transition-colors"
                             >
                                <Volume2 className="w-3 h-3" />
                                Ouvir Mensagem
                             </button>
                             <button 
                               onClick={(e) => handlePlayMedia('video', e)}
                               className="flex items-center gap-1.5 text-[10px] font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-lg transition-colors border border-white/20"
                             >
                                <Video className="w-3 h-3" />
                                Vídeo Resposta
                             </button>
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
                          </div>

                          {officialResponse && (
                            <span className="text-[9px] text-emerald-200 mt-2 block text-right">Respondido por {officialResponse.userName}</span>
                          )}
                       </div>
                    </div>
                  ) : 
                  
                  /* 2. YELLOW BOX: ENCAMINHADO (Analise ou Execucao) */
                  (issue.status === IssueStatus.ANALISE || issue.status === IssueStatus.EXECUCAO) ? (
                    <div className="mb-3 bg-amber-300 text-slate-900 rounded-lg p-3 shadow-sm border border-amber-400">
                       <div className="flex items-center gap-1.5 mb-1.5 border-b border-amber-400/50 pb-1.5">
                          <ArrowRightCircle className="w-4 h-4 text-slate-800" />
                          <span className="text-xs font-bold uppercase tracking-wide">Encaminhado ao Setor</span>
                       </div>
                       <p className="text-xs font-medium leading-relaxed">
                         {officialResponse ? `"${officialResponse.text}"` : "Sua demanda já foi recebida e encaminhada para o setor responsável."}
                       </p>
                       
                       {/* MULTIMEDIA BUTTONS (YELLOW VARIANT) */}
                       <div className="mt-3 flex gap-2">
<<<<<<< HEAD
                           {officialResponse?.audioUrl && (
                             <button 
                               onClick={(e) => handlePlayMedia(officialResponse.audioUrl, 'audio', e)}
                               className="flex items-center gap-1.5 text-[10px] font-bold bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 px-2.5 py-1.5 rounded-lg transition-colors"
                             >
                                <Play className="w-3 h-3 fill-current" />
                                Ouvir Status
                             </button>
                           )}
                           
                           {officialResponse?.videoUrl && (
                               <button 
                                 onClick={(e) => handlePlayMedia(officialResponse.videoUrl, 'video', e)}
                                 className="flex items-center gap-1.5 text-[10px] font-black bg-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-indigo-700 transition-all animate-pulse"
                               >
                                  <Video className="w-3 h-3" />
                                  VÍDEO RESPOSTA
                               </button>
                             )}
=======
                           <button 
                             onClick={(e) => handlePlayMedia('audio', e)}
                             className="flex items-center gap-1.5 text-[10px] font-bold bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 px-2.5 py-1.5 rounded-lg transition-colors"
                           >
                              <Play className="w-3 h-3 fill-current" />
                              Ouvir Status
                           </button>
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
                       </div>

                       <div className="mt-2 flex gap-2">
                          <span className="px-1.5 py-0.5 bg-white/40 rounded text-[9px] font-bold">Protocolo Ativo</span>
                          <span className="px-1.5 py-0.5 bg-white/40 rounded text-[9px] font-bold">Em andamento</span>
                       </div>
                    </div>
                  ) :
                  
                  /* 3. RED BOX: AGUARDANDO (Registrada) */
                  (
                    <div className="mb-3 bg-red-500 text-white rounded-lg p-3 shadow-sm border border-red-600">
                       <div className="flex items-center gap-1.5 mb-1.5 border-b border-red-400/50 pb-1.5">
                          <AlertCircle className="w-4 h-4 text-red-100" />
                          <span className="text-xs font-bold uppercase tracking-wide">Aguardando Resposta</span>
                       </div>
                       <p className="text-xs font-medium leading-relaxed opacity-95">
                         Esta solicitação está na fila de triagem. A prefeitura ainda não visualizou ou iniciou o processo.
                       </p>
                       <div className="mt-2 text-[9px] bg-red-600/50 inline-block px-2 py-1 rounded text-red-100">
                          Prazo médio de 1ª resposta: 48h
                       </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if(issue.location.lat && issue.location.lng) {
                          onFocusLocation(issue.location.lat, issue.location.lng);
                        }
                      }}
                      className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-slate-200 transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      Ver no Mapa
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIssue(issue);
                      }}
                      className="flex-1 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors"
                    >
                      Detalhes Completos
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IssueListSidebar;