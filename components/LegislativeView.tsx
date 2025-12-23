
import React, { useState } from 'react';
import { Councilor, LegislativeBill, BillStatus, UserRole } from '../types';
import { Landmark, Vote, User, ThumbsUp, ThumbsDown, FileText, ChevronRight, Mail, ArrowRight, Building2, ScrollText, CheckCircle2, XCircle, Pencil, X, Save, Plus, Lock, Trash2 } from 'lucide-react';

interface LegislativeViewProps {
  councilors: Councilor[];
  bills: LegislativeBill[];
  userRole: UserRole; // Added to check permissions
  onVoteBill: (billId: string, vote: 'FAVOR' | 'AGAINST') => void;
  onUpdateBill?: (bill: LegislativeBill) => void;
  onUpdateCouncilor?: (councilor: Councilor) => void;
  onAddCouncilor?: (councilor: Councilor) => void;
  onDeleteCouncilor?: (id: string) => void; // New delete handler
}

const LegislativeView: React.FC<LegislativeViewProps> = ({ 
  councilors, 
  bills, 
  userRole,
  onVoteBill, 
  onUpdateBill,
  onUpdateCouncilor,
  onAddCouncilor,
  onDeleteCouncilor
}) => {
  const [activeTab, setActiveTab] = useState<'BILLS' | 'COUNCILORS'>('BILLS');
  
  // Edit State
  const [editingBill, setEditingBill] = useState<LegislativeBill | null>(null);
  const [editingCouncilor, setEditingCouncilor] = useState<Councilor | null>(null);

  // PERMISSION CHECK
  const canEdit = userRole === UserRole.LEGISLATIVE || userRole === UserRole.ADMIN;

  // Helper to determine step status
  const getFlowStatus = (billStatus: BillStatus) => {
    // Returns index of active step: 0=Câmara, 1=Executivo, 2=Final
    switch (billStatus) {
        case 'EM_VOTACAO': return 0;
        case 'AGUARDANDO_SANCAO': return 1;
        case 'APROVADO': return 2;
        case 'VETADO': return 2;
        default: return 0;
    }
  };

  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBill && onUpdateBill) {
      onUpdateBill(editingBill);
      setEditingBill(null);
    }
  };

  const handleSaveCouncilor = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCouncilor) {
      if (editingCouncilor.id && onUpdateCouncilor) {
        // Editing existing
        onUpdateCouncilor(editingCouncilor);
      } else if (onAddCouncilor) {
        // Creating new (ID will be generated in App.tsx)
        onAddCouncilor(editingCouncilor);
      }
      setEditingCouncilor(null);
    }
  };

  // Handler to open modal for adding new councilor
  const handleAddNewCouncilorClick = () => {
     setEditingCouncilor({
        id: '', // Empty ID signifies new entry
        name: '',
        party: '',
        bio: '',
        email: '',
        avatar: 'https://ui-avatars.com/api/?name=Novo+Vereador&background=random'
     });
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto pb-24 animate-fade-in relative">
      
      {/* Header */}
      <div className="bg-slate-900 p-6 pb-12 rounded-b-[2.5rem] shadow-lg text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-10">
            <Landmark className="w-full h-full" />
        </div>
        <div className="relative z-10">
            <h2 className="text-2xl font-black uppercase tracking-wide flex items-center justify-center gap-2">
               <Landmark className="w-6 h-6" /> Câmara Digital
            </h2>
            <p className="text-slate-300 text-sm mt-1">Acompanhe e participe das decisões legislativas.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 -mt-6 relative z-20">
         <div className="bg-white p-1 rounded-xl shadow-lg border border-slate-100 flex">
            <button 
              onClick={() => setActiveTab('BILLS')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'BILLS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <FileText className="w-4 h-4" /> Projetos de Lei
            </button>
            <button 
              onClick={() => setActiveTab('COUNCILORS')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'COUNCILORS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <User className="w-4 h-4" /> Vereadores
            </button>
         </div>
      </div>

      {/* Content Area */}
      <div className="px-4 mt-6 space-y-4">
         
         {/* BILLS TAB */}
         {activeTab === 'BILLS' && (
            <div className="space-y-4 animate-slide-up">
               {bills.map(bill => {
                  const total = bill.poll.votesFavor + bill.poll.votesAgainst;
                  const favorPercent = total > 0 ? (bill.poll.votesFavor / total) * 100 : 0;
                  const currentStep = getFlowStatus(bill.status);

                  return (
                     <div key={bill.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 relative group">
                        
                        {/* Edit Button (Restricted) */}
                        {canEdit && onUpdateBill && (
                           <button 
                             onClick={() => setEditingBill(bill)}
                             className="absolute top-3 right-3 p-2 bg-slate-100 text-slate-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-100 hover:text-indigo-600 z-10"
                             title="Editar Projeto"
                           >
                             <Pencil className="w-4 h-4" />
                           </button>
                        )}

                        <div className="flex justify-between items-start mb-2 pr-8">
                           <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                              {bill.code}
                           </span>
                           <span className={`text-[10px] font-bold px-2 py-1 rounded border 
                             ${bill.status === 'APROVADO' ? 'bg-green-50 text-green-600 border-green-200' : 
                               bill.status === 'VETADO' ? 'bg-red-50 text-red-600 border-red-200' : 
                               'bg-amber-50 text-amber-600 border-amber-200'}`}>
                              {bill.status.replace('_', ' ')}
                           </span>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{bill.title}</h3>
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed">{bill.description}</p>
                        
                        {/* --- VISUAL FLOW (TRAMITAÇÃO) --- */}
                        <div className="mb-5 bg-slate-50 rounded-xl p-3 border border-slate-100 relative overflow-hidden">
                           <div className="flex justify-between items-center relative z-10">
                              
                              {/* Step 1: Legislative */}
                              <div className="flex flex-col items-center gap-1 z-10 w-1/3">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors 
                                   ${currentStep >= 0 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                                    <Landmark className="w-4 h-4" />
                                 </div>
                                 <span className={`text-[9px] font-bold ${currentStep >= 0 ? 'text-indigo-700' : 'text-slate-400'}`}>Votação Câmara</span>
                              </div>

                              {/* Arrow 1 */}
                              <div className={`flex-1 h-0.5 mx-1 transition-colors ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>

                              {/* Step 2: Executive */}
                              <div className="flex flex-col items-center gap-1 z-10 w-1/3">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors 
                                   ${currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 
                                     currentStep === 0 ? 'bg-white border-slate-300 text-slate-300' : ''}`}>
                                    <Building2 className="w-4 h-4" />
                                 </div>
                                 <span className={`text-[9px] font-bold ${currentStep >= 1 ? 'text-blue-700' : 'text-slate-400'}`}>
                                    {currentStep === 1 ? 'Em Análise' : 'Executivo'}
                                 </span>
                              </div>

                              {/* Arrow 2 */}
                              <div className={`flex-1 h-0.5 mx-1 transition-colors ${currentStep >= 2 ? (bill.status === 'APROVADO' ? 'bg-green-500' : 'bg-red-500') : 'bg-slate-200'}`}></div>

                              {/* Step 3: Result */}
                              <div className="flex flex-col items-center gap-1 z-10 w-1/3">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors 
                                   ${currentStep < 2 ? 'bg-white border-slate-300 text-slate-300' : 
                                     bill.status === 'APROVADO' ? 'bg-green-500 border-green-500 text-white' : 'bg-red-500 border-red-500 text-white'}`}>
                                    {bill.status === 'APROVADO' ? <CheckCircle2 className="w-4 h-4"/> : 
                                     bill.status === 'VETADO' ? <XCircle className="w-4 h-4"/> : 
                                     <ScrollText className="w-4 h-4" />}
                                 </div>
                                 <span className={`text-[9px] font-bold ${currentStep < 2 ? 'text-slate-400' : bill.status === 'APROVADO' ? 'text-green-600' : 'text-red-600'}`}>
                                    {bill.status === 'APROVADO' ? 'Lei Sancionada' : bill.status === 'VETADO' ? 'Veto Executivo' : 'Resultado'}
                                 </span>
                              </div>
                           </div>
                           
                           {/* Connecting Line (Background) */}
                           <div className="absolute top-[26px] left-10 right-10 h-0.5 bg-slate-200 z-0"></div>
                        </div>


                        {/* Interactive Poll */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                           <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1">
                              <Vote className="w-3 h-3" /> Votação Popular (Simulada)
                           </p>
                           
                           <div className="flex gap-2 mb-3">
                              <button 
                                onClick={() => !bill.poll.userVote && onVoteBill(bill.id, 'FAVOR')}
                                disabled={!!bill.poll.userVote}
                                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all
                                   ${bill.poll.userVote === 'FAVOR' ? 'bg-green-600 text-white shadow-inner' : 'bg-white border border-slate-200 text-slate-600 hover:border-green-500 hover:text-green-600'}`}
                              >
                                 <ThumbsUp className="w-3 h-3" /> A Favor
                              </button>
                              <button 
                                onClick={() => !bill.poll.userVote && onVoteBill(bill.id, 'AGAINST')}
                                disabled={!!bill.poll.userVote}
                                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all
                                   ${bill.poll.userVote === 'AGAINST' ? 'bg-red-600 text-white shadow-inner' : 'bg-white border border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-600'}`}
                              >
                                 <ThumbsDown className="w-3 h-3" /> Contra
                              </button>
                           </div>

                           {/* Results Bar */}
                           <div className="relative h-2 bg-red-200 rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full bg-green-500" 
                                style={{ width: `${favorPercent}%` }}
                              ></div>
                           </div>
                           <div className="flex justify-between mt-1 text-[9px] font-bold text-slate-400 uppercase">
                              <span className="text-green-600">{Math.round(favorPercent)}% A Favor</span>
                              <span className="text-red-500">{100 - Math.round(favorPercent)}% Contra</span>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         )}

         {/* COUNCILORS TAB */}
         {activeTab === 'COUNCILORS' && (
            <div className="space-y-4 animate-slide-up">
               {canEdit && onAddCouncilor && (
                  <button 
                    onClick={handleAddNewCouncilorClick}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold flex items-center justify-center gap-2 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                     <Plus className="w-5 h-5" />
                     Cadastrar Vereador
                  </button>
               )}

               <div className="grid grid-cols-1 gap-4">
                  {councilors.map(councilor => (
                     <div key={councilor.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4 items-center relative group">
                        {/* Edit Button (Restricted) */}
                        {canEdit && onUpdateCouncilor && (
                           <button 
                             onClick={() => setEditingCouncilor(councilor)}
                             className="absolute top-2 right-2 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                             title="Editar Vereador"
                           >
                             <Pencil className="w-4 h-4" />
                           </button>
                        )}
                        
                        <img src={councilor.avatar} alt={councilor.name} className="w-16 h-16 rounded-full bg-slate-100 object-cover border-2 border-slate-50" />
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-bold text-slate-900 truncate">{councilor.name}</h3>
                              <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">{councilor.party}</span>
                           </div>
                           <p className="text-xs text-slate-500 line-clamp-2 mb-2">{councilor.bio}</p>
                           <a href={`mailto:${councilor.email}`} className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                              <Mail className="w-3 h-3" /> Fale com o Gabinete
                           </a>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>

      {/* --- EDIT MODALS (Only rendered if user has permission) --- */}
      {canEdit && (
        <>
          {/* Bill Editor */}
          {editingBill && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">Editar Projeto de Lei</h3>
                      <button onClick={() => setEditingBill(null)} className="p-1 hover:bg-slate-200 rounded-full">
                        <X className="w-5 h-5 text-slate-500" />
                      </button>
                  </div>
                  <form onSubmit={handleSaveBill} className="p-4 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Código do Projeto</label>
                        <input 
                          type="text" 
                          value={editingBill.code}
                          onChange={e => setEditingBill({...editingBill, code: e.target.value})}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
                        <input 
                          type="text" 
                          value={editingBill.title}
                          onChange={e => setEditingBill({...editingBill, title: e.target.value})}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição / Pauta</label>
                        <textarea 
                          rows={3}
                          value={editingBill.description}
                          onChange={e => setEditingBill({...editingBill, description: e.target.value})}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status da Tramitação</label>
                        <div className="relative">
                          <select 
                            value={editingBill.status}
                            onChange={e => setEditingBill({...editingBill, status: e.target.value as BillStatus})}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium appearance-none bg-white"
                          >
                              <option value="EM_VOTACAO">Em Votação (Câmara)</option>
                              <option value="AGUARDANDO_SANCAO">Aguardando Sanção (Executivo)</option>
                              <option value="APROVADO">Aprovado (Lei Sancionada)</option>
                              <option value="VETADO">Vetado</option>
                          </select>
                          <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 rotate-90" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Alterar o status atualiza o diagrama de fluxo automaticamente.</p>
                      </div>
                      
                      <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700">
                        <Save className="w-4 h-4" /> Salvar Alterações
                      </button>
                  </form>
                </div>
            </div>
          )}

          {/* Councilor Editor */}
          {editingCouncilor && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
                  <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">{editingCouncilor.id ? 'Editar Perfil do Vereador' : 'Novo Vereador'}</h3>
                      <button onClick={() => setEditingCouncilor(null)} className="p-1 hover:bg-slate-200 rounded-full">
                        <X className="w-5 h-5 text-slate-500" />
                      </button>
                  </div>
                  <form onSubmit={handleSaveCouncilor} className="p-4 space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome</label>
                            <input 
                              type="text" 
                              value={editingCouncilor.name}
                              onChange={e => setEditingCouncilor({...editingCouncilor, name: e.target.value})}
                              className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium"
                              placeholder="Ex: Ver. João da Silva"
                              required
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Partido</label>
                            <input 
                              type="text" 
                              value={editingCouncilor.party}
                              onChange={e => setEditingCouncilor({...editingCouncilor, party: e.target.value})}
                              className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium"
                              placeholder="Ex: PART"
                              required
                            />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bio / Apresentação</label>
                        <textarea 
                          rows={3}
                          value={editingCouncilor.bio}
                          onChange={e => setEditingCouncilor({...editingCouncilor, bio: e.target.value})}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium resize-none"
                          placeholder="Breve descrição da atuação..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email do Gabinete</label>
                        <input 
                          type="email" 
                          value={editingCouncilor.email}
                          onChange={e => setEditingCouncilor({...editingCouncilor, email: e.target.value})}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium"
                          placeholder="contato@camara.leg.br"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL da Foto</label>
                        <input 
                          type="text" 
                          value={editingCouncilor.avatar}
                          onChange={e => setEditingCouncilor({...editingCouncilor, avatar: e.target.value})}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500"
                        />
                      </div>
                      
                      <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700">
                        <Save className="w-4 h-4" /> {editingCouncilor.id ? 'Salvar Perfil' : 'Cadastrar Vereador'}
                      </button>

                      {/* DELETE BUTTON (Only if editing existing) */}
                      {editingCouncilor.id && onDeleteCouncilor && (
                         <button 
                           type="button" 
                           onClick={() => {
                              onDeleteCouncilor(editingCouncilor.id);
                              setEditingCouncilor(null);
                           }}
                           className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 mt-2"
                         >
                            <Trash2 className="w-4 h-4" /> Excluir Vereador
                         </button>
                      )}
                  </form>
                </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default LegislativeView;
