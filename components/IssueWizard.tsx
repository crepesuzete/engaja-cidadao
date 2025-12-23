import React, { useState } from 'react';
import { IssueCategory } from '../types';
import { analyzeIssueReport } from '../services/geminiService';
import { 
  ArrowLeft, ArrowRight, MapPin, Search, Wand2, Loader2, 
  CheckCircle2, Shield, ShieldCheck, AlertCircle, 
  Construction, Stethoscope, GraduationCap, TreePine, 
  ShieldAlert, Bus, Theater, Users 
} from 'lucide-react';

interface IssueWizardProps {
  city: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { id: IssueCategory.INFRAESTRUTURA, icon: Construction, label: 'Infraestrutura' },
  { id: IssueCategory.SAUDE, icon: Stethoscope, label: 'Saúde' },
  { id: IssueCategory.EDUCACAO, icon: GraduationCap, label: 'Educação' },
  { id: IssueCategory.MEIO_AMBIENTE, icon: TreePine, label: 'Meio Ambiente' },
  { id: IssueCategory.SEGURANCA, icon: ShieldAlert, label: 'Segurança' },
  { id: IssueCategory.MOBILIDADE, icon: Bus, label: 'Mobilidade' },
  { id: IssueCategory.CULTURA, icon: Theater, label: 'Cultura' },
  { id: IssueCategory.ASSISTENCIA_SOCIAL, icon: Users, label: 'Limpeza/Outros' },
];

const IssueWizard: React.FC<IssueWizardProps> = ({ city, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  
  // State
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [description, setDescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [termAccepted, setTermAccepted] = useState(false);

  // --- PASSO 1: CATEGORIA ---
  const renderCategoryStep = () => (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Qual área precisa de atenção?</h2>
      <p className="text-slate-500 mb-6 text-sm">Selecione a opção que melhor descreve o problema.</p>
      
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategory(cat.id); setStep(2); }}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
          >
            <cat.icon className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs font-bold text-slate-700">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // --- PASSO 2: LOCALIZAÇÃO ---
  const renderLocationStep = () => (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Onde é o problema?</h2>
      <p className="text-slate-500 mb-6 text-sm">Identificamos sua localização aproximada.</p>
      
      <div className="bg-slate-100 p-8 rounded-3xl flex flex-col items-center text-center border-2 border-dashed border-slate-300 mb-6 relative overflow-hidden">
        {/* Mock Map BG */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10">
           <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce text-emerald-600">
              <MapPin className="w-8 h-8" />
           </div>
           <h3 className="font-bold text-lg text-slate-900">{city} - Centro</h3>
           <p className="text-xs text-slate-500 bg-white/50 px-2 py-1 rounded inline-block mt-1">Precisão: 15m</p>
        </div>
      </div>

      <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 mb-4 hover:bg-slate-50">
         <Search className="w-4 h-4" /> Ajustar no mapa
      </button>

      <button onClick={() => setStep(3)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg">
         Confirmar Local <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  // --- PASSO 3: DESCRIÇÃO ---
  const handleAnalyze = async () => {
     if (description.length < 5) return;
     setIsAnalyzing(true);
     const result = await analyzeIssueReport(description);
     setAiAnalysis(result);
     setIsAnalyzing(false);
     setStep(4);
  };

  const renderDescriptionStep = () => (
    <div className="animate-slide-up h-full flex flex-col">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Descrição Livre</h2>
      <p className="text-slate-500 mb-6 text-sm">Descreva o problema em poucas palavras.</p>
      
      <textarea
        className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg resize-none focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700"
        placeholder="Ex: Buraco grande na rua em frente à escola..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      
      <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
         <Wand2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
         <p className="text-xs text-blue-800 leading-relaxed">
            Nossa <strong>Inteligência Artificial</strong> analisará seu texto para garantir o tom institucional correto.
         </p>
      </div>

      <button 
        onClick={handleAnalyze}
        disabled={description.length < 5 || isAnalyzing}
        className="w-full mt-auto mb-4 py-4 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
      >
        {isAnalyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Analisando...</> : <><Wand2 className="w-5 h-5" /> Processar Texto</>}
      </button>
    </div>
  );

  // --- PASSO 4: REVISÃO IA ---
  const renderReviewStep = () => (
    <div className="animate-slide-up">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wide mb-4">
         <Wand2 className="w-3 h-3" /> Revisão Assistida
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 mb-2">Sugestão de Texto</h2>
      <p className="text-slate-500 mb-6 text-sm">Ajustamos o texto para manter um diálogo respeitoso e eficaz.</p>

      <div className="space-y-4 mb-8">
         {/* Original (Collapsed/Small) */}
         <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 opacity-60">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Original</p>
            <p className="text-xs text-slate-600 italic">"{description}"</p>
         </div>

         {/* Sugestão (Highlighted) */}
         <div className="p-5 rounded-xl border border-indigo-100 bg-white shadow-lg ring-1 ring-indigo-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100 rounded-bl-full opacity-50"></div>
            <p className="text-[10px] font-bold text-indigo-600 uppercase mb-2">Sugestão Institucional</p>
            <p className="text-base font-medium text-slate-800 leading-relaxed">"{aiAnalysis?.summary || description}"</p>
         </div>
      </div>

      <button onClick={() => setStep(5)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg">
         Aprovar e Continuar <CheckCircle2 className="w-5 h-5" />
      </button>
    </div>
  );

  // --- PASSO 5: IDENTIFICAÇÃO ---
  const renderIdentityStep = () => (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Identificação</h2>
      <p className="text-slate-500 mb-6 text-sm">Como você deseja se identificar nesta demanda?</p>

      <div className="space-y-4">
         <button 
           onClick={() => setIsAnonymous(false)}
           className={`w-full p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${!isAnonymous ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200 bg-white'}`}
         >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!isAnonymous ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
               <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
               <h3 className="font-bold text-slate-900 text-sm">Exibir nome publicamente</h3>
               <p className="text-xs text-slate-500 mt-1">Seu perfil será vinculado ao card público.</p>
            </div>
         </button>

         <button 
           onClick={() => setIsAnonymous(true)}
           className={`w-full p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${isAnonymous ? 'border-slate-800 bg-slate-800 text-white shadow-lg' : 'border-slate-200 bg-white'}`}
         >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isAnonymous ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
               <Shield className="w-5 h-5" />
            </div>
            <div>
               <h3 className={`font-bold text-sm ${isAnonymous ? 'text-white' : 'text-slate-900'}`}>Manter identidade protegida</h3>
               <p className={`text-xs mt-1 ${isAnonymous ? 'text-slate-400' : 'text-slate-500'}`}>Seu nome será ocultado no card público.</p>
            </div>
         </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 items-start">
         <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
         <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Nota:</strong> Mesmo protegido, o registro é feito com responsabilidade e auditado pela ouvidoria.
         </p>
      </div>

      <button onClick={() => setStep(6)} className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg">
         Continuar <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  // --- PASSO 6: TERMO ---
  const handleFinalSubmit = () => {
     if (termAccepted) {
        onSubmit({
           category,
           location: { label: city },
           description,
           aiAnalysis,
           isAnonymous,
           title: aiAnalysis?.summary || description
        });
     }
  };

  const renderTermStep = () => (
    <div className="animate-slide-up">
       <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
       </div>
       <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Termo de Responsabilidade</h2>
       <p className="text-slate-500 text-center mb-8 text-sm px-4">A falsa comunicação de ocorrências é crime e prejudica a gestão pública.</p>

       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <label className="flex items-start gap-4 cursor-pointer group">
             <div className="relative flex items-center mt-0.5">
                <input 
                  type="checkbox" 
                  checked={termAccepted}
                  onChange={e => setTermAccepted(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow checked:bg-emerald-600 checked:border-emerald-600"
                />
                <CheckCircle2 className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3.5 h-3.5 left-0.5" />
             </div>
             <span className="text-sm font-bold text-slate-700 leading-relaxed group-hover:text-slate-900">
                Declaro que as informações prestadas são verdadeiras e estou ciente das implicações legais.
             </span>
          </label>
       </div>

       <button 
         onClick={handleFinalSubmit}
         disabled={!termAccepted}
         className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-lg"
       >
         Aceitar e Protocolar
       </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans">
       {/* Wizard Header */}
       <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <button onClick={step === 1 ? onCancel : () => setStep(step-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500">
             <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passo {step} de 6</span>
          <div className="w-9"></div>
       </div>

       {/* Progress Bar */}
       <div className="h-1 bg-slate-100 w-full shrink-0">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(step/6)*100}%` }}></div>
       </div>

       {/* Step Content */}
       <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="max-w-md mx-auto h-full flex flex-col justify-center pb-20">
             {step === 1 && renderCategoryStep()}
             {step === 2 && renderLocationStep()}
             {step === 3 && renderDescriptionStep()}
             {step === 4 && renderReviewStep()}
             {step === 5 && renderIdentityStep()}
             {step === 6 && renderTermStep()}
          </div>
       </div>
    </div>
  );
};

export default IssueWizard;