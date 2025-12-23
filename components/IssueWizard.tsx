import React, { useState } from 'react';
import { IssueCategory, Attachment } from '../types';
import { analyzeIssueReport } from '../services/geminiService';
import { ArrowLeft, ArrowRight, MapPin, CheckCircle2, Shield, ShieldCheck, Construction, Stethoscope, GraduationCap, TreePine, ShieldAlert, Bus, Theater, Users, AlertCircle, Wand2, Loader2, Search } from 'lucide-react';

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
  { id: IssueCategory.ASSISTENCIA_SOCIAL, icon: Users, label: 'Social' },
];

const IssueWizard: React.FC<IssueWizardProps> = ({ city, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  
  // Form Data State
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [location, setLocation] = useState(city); // Simplified for wizard
  const [description, setDescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [liabilityAccepted, setLiabilityAccepted] = useState(false);

  // STEP 1: CATEGORY
  const renderStep1 = () => (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Qual área precisa de atenção?</h2>
      <p className="text-slate-500 mb-6 text-sm">Selecione a categoria que melhor descreve o problema.</p>
      
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategory(cat.id); setStep(2); }}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm group"
          >
            <cat.icon className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mb-2 transition-colors" />
            <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-800">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // STEP 2: LOCATION (Simplified)
  const renderStep2 = () => (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Onde é o problema?</h2>
      <p className="text-slate-500 mb-6 text-sm">Confirmamos sua localização automática.</p>
      
      <div className="bg-slate-50 p-8 rounded-3xl flex flex-col items-center text-center border-2 border-dashed border-slate-300 relative overflow-hidden">
        {/* Fake Map Background */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_of_st_louis_neighborhoods.svg')] bg-cover"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600 shadow-lg animate-bounce">
            <MapPin className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">{city} - Centro</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium bg-white/80 px-2 py-1 rounded">Precisão: 15 metros</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-indigo-600 text-xs font-bold">
         <Search className="w-4 h-4" /> Ajustar no mapa (Indisponível na Demo)
      </div>

      <button 
        onClick={() => setStep(3)}
        className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
      >
        Confirmar Local <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  // STEP 3: DESCRIPTION
  const handleAnalyze = async () => {
    if (description.length < 5) return;
    setIsAnalyzing(true);
    const analysis = await analyzeIssueReport(description);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
    setStep(4);
  };

  const renderStep3 = () => (
    <div className="animate-slide-up h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Descrição Livre</h2>
      <p className="text-slate-500 mb-4 text-sm">O que aconteceu? Descreva em poucas palavras.</p>
      
      <div className="relative">
        <textarea
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg resize-none focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 placeholder:text-slate-300"
            placeholder="Ex: Buraco na rua em frente à padaria..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-bold">
            {description.length} caracteres
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-4 flex gap-3 items-start">
         <Wand2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
         <p className="text-xs text-blue-700 leading-relaxed">
            Nossa <strong>Inteligência Artificial</strong> irá analisar seu texto, remover ofensas e adequar ao tom institucional automaticamente.
         </p>
      </div>

      <button 
        onClick={handleAnalyze}
        disabled={description.length < 5 || isAnalyzing}
        className="w-full mt-auto mb-4 py-4 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-emerald-700 transition-colors shadow-lg"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Analisando...
          </>
        ) : (
          <>
            Continuar <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );

  // STEP 4: AI REVIEW
  const renderStep4 = () => (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-4 text-indigo-600 bg-indigo-50 w-fit px-3 py-1 rounded-full">
        <Wand2 className="w-4 h-4" />
        <span className="font-black uppercase tracking-wide text-[10px]">Revisão Assistida</span>
      </div>
      
      <h2 className="text-xl font-bold text-slate-800 mb-2">Sugestão de Texto</h2>
      <p className="text-sm text-slate-500 mb-6">Ajustamos o texto para manter um diálogo respeitoso e eficaz.</p>

      <div className="space-y-4 mb-8">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 opacity-60">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Seu texto original</p>
          <p className="text-sm text-slate-600 italic">"{description}"</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-lg relative overflow-hidden ring-1 ring-indigo-50">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-bl-full opacity-30"></div>
          <p className="text-[10px] font-bold text-indigo-600 uppercase mb-2">Texto Institucional (Sugerido)</p>
          <p className="text-base font-medium text-slate-800 leading-relaxed">"{aiAnalysis?.summary || description}"</p>
          <div className="mt-3 flex gap-2">
             <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded border border-indigo-100">
               {aiAnalysis?.category}
             </span>
             <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded border border-indigo-100">
               Prioridade: {aiAnalysis?.severity}
             </span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setStep(5)}
        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
      >
        Aprovar e Continuar <CheckCircle2 className="w-5 h-5" />
      </button>
    </div>
  );

  // STEP 5: IDENTIFICATION
  const renderStep5 = () => (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Identificação</h2>
      
      <div className="space-y-4">
        <button
          onClick={() => setIsAnonymous(false)}
          className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all ${!isAnonymous ? 'border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500' : 'border-slate-200 bg-white hover:border-emerald-200'}`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${!isAnonymous ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Exibir nome publicamente</h3>
            <p className="text-xs text-slate-500 mt-0.5">Seu perfil será vinculado à demanda.</p>
          </div>
        </button>

        <button
          onClick={() => setIsAnonymous(true)}
          className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 text-left transition-all ${isAnonymous ? 'border-slate-800 bg-slate-800 text-white shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isAnonymous ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-400'}`}>
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-bold ${isAnonymous ? 'text-white' : 'text-slate-900'}`}>Manter identidade protegida</h3>
            <p className={`text-xs ${isAnonymous ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>Seu nome será ocultado no card público.</p>
          </div>
        </button>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 text-xs leading-relaxed border border-blue-100 items-start">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <p><strong>Nota:</strong> Sua identidade será protegida, mas a demanda será registrada com responsabilidade e auditada pela ouvidoria.</p>
      </div>

      <button 
        onClick={() => setStep(6)}
        className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
      >
        Continuar <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  // STEP 6: LIABILITY & SUBMIT
  const handleSubmit = () => {
    if (liabilityAccepted) {
      onSubmit({
        title: aiAnalysis?.summary || description,
        description: description,
        category: category,
        aiAnalysis: aiAnalysis,
        isAnonymous: isAnonymous,
        location: { label: city },
        attachments: [] 
      });
    }
  };

  const renderStep6 = () => (
    <div className="animate-slide-up">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Termo de Responsabilidade</h2>
      <p className="text-slate-500 text-center mb-8 text-sm">A falsa comunicação de ocorrências prejudica a gestão pública.</p>
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              className="peer h-6 w-6 cursor-pointer appearance-none rounded border border-slate-300 shadow transition-all checked:border-emerald-600 checked:bg-emerald-600 hover:shadow-md"
              checked={liabilityAccepted}
              onChange={(e) => setLiabilityAccepted(e.target.checked)}
            />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <span className="text-sm font-medium text-slate-700 leading-relaxed group-hover:text-slate-900">
            Declaro que as informações prestadas são verdadeiras e estou ciente das implicações legais.
          </span>
        </label>
      </div>

      <button 
        onClick={handleSubmit}
        disabled={!liabilityAccepted}
        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-lg hover:bg-emerald-700"
      >
        Aceitar e Protocolar
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Wizard Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <button onClick={step === 1 ? onCancel : () => setStep(step - 1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Passo {step} de 6</span>
        <div className="w-9 h-9"></div> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-100 w-full shrink-0">
        <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${(step / 6) * 100}%` }}></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24 bg-slate-50/50">
        <div className="max-w-md mx-auto h-full flex flex-col justify-center">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
            {step === 6 && renderStep6()}
        </div>
      </div>
    </div>
  );
};

export default IssueWizard;