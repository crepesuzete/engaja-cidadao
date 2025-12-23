import React, { useState, useEffect, useRef } from 'react';
import { IssueCategory, Issue, Attachment } from '../types';
import { analyzeIssueReport } from '../services/geminiService';
import { uploadAttachment, supabase } from '../supabaseClient';
import { Loader2, Wand2, MapPin, Camera, Shield, ShieldCheck, AlertTriangle, CheckCircle2, Mic, Video, X, Play, Square, Image as ImageIcon, ArrowDownToLine, CloudUpload } from 'lucide-react';

interface IssueFormProps {
  onSubmit: (title: string, description: string, category: IssueCategory, aiAnalysis: any, isAnonymous: boolean, attachments: Attachment[]) => void;
  onCancel: () => void;
  initialData?: Issue | null; // Support for editing
}

// --- IMAGE COMPRESSION UTILITY ---
const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024; // Limit width for "Extreme Compression"
        const scaleSize = MAX_WIDTH / img.width;
        
        let width = img.width;
        let height = img.height;

        // Resize if larger than max width
        if (width > MAX_WIDTH) {
            width = MAX_WIDTH;
            height = img.height * scaleSize;
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject("Canvas context unavailable");
            return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // COMPRESSION MAGIC: Convert to JPEG at 60% quality
        // This usually turns a 5MB file into ~100KB-150KB
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const IssueForm: React.FC<IssueFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [locationSet, setLocationSet] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  // Media State
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New Upload State
  
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Liability Checkbox State
  const [liabilityAccepted, setLiabilityAccepted] = useState(false);

  // Success State for UX
  const [isSuccess, setIsSuccess] = useState(false);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setIsAnonymous(initialData.isAnonymous);
      setAttachments(initialData.attachments || []);
      setAiResult({
        category: initialData.category,
        summary: initialData.title,
        severity: 'MEDIUM', // Default fallback
        constructiveFeedback: 'Edição de registro existente.'
      });
      setLocationSet(true);
      setLiabilityAccepted(true); // Pre-accept if editing
    }
  }, [initialData]);

  // Timer logic for recordings
  useEffect(() => {
    if (isRecordingAudio) {
      timerRef.current = setInterval(() => {
        setRecordingTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecordingAudio]);

  const handleAnalyze = async () => {
    if (description.length < 10) return;
    setIsAnalyzing(true);
    const result = await analyzeIssueReport(description);
    setAiResult(result);
    if (!initialData) {
       setTitle(result.summary);
    }
    if (result.category === 'Segurança' || result.category === 'SEGURANCA') {
      setIsAnonymous(true);
    }
    setIsAnalyzing(false);
  };

  // --- MEDIA HANDLERS ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
          // Perform Extreme Compression
          const compressedUrl = await compressImage(file);
          
          const newAttachment: Attachment = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'IMAGE',
            url: compressedUrl, // Initially store Data URL for preview
            name: file.name
          };
          setAttachments([...attachments, newAttachment]);
      } catch (error) {
          console.error("Compression failed", error);
          alert("Erro ao processar imagem. Tente novamente.");
      } finally {
          setIsCompressing(false);
      }
    }
  };

  const toggleAudioRecording = () => {
    if (isRecordingAudio) {
      // Stop Recording
      setIsRecordingAudio(false);
      const newAttachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'AUDIO',
        url: '#', // Mock URL
        name: `Áudio ${new Date().toLocaleTimeString()}`
      };
      setAttachments([...attachments, newAttachment]);
    } else {
      // Start Recording
      setIsRecordingAudio(true);
    }
  };

  const simulateVideoRecording = () => {
    // Mock video addition
    const newAttachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'VIDEO',
        url: '#', // Mock URL
        name: `Vídeo ${new Date().toLocaleTimeString()}`
      };
      setAttachments([...attachments, newAttachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- SUBMIT WITH REAL UPLOAD AND TIMEOUT PROTECTION ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (aiResult || initialData) {
      if (liabilityAccepted) {
        
        // 1. Process Attachments
        setIsUploading(true);
        const processedAttachments: Attachment[] = [];

        try {
          // Promise.all to handle multiple uploads concurrently
          // Add a 10s timeout race to prevent infinite loading
          const uploadPromises = attachments.map(async (att) => {
             // Check if we need to upload (is Base64) AND Supabase is valid
             if (att.url.startsWith('data:') && supabase) {
                try {
                   // Create a timeout promise
                   const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000));
                   
                   // Create upload promise
                   const uploadTask = (async () => {
                      const res = await fetch(att.url);
                      const blob = await res.blob();
                      const file = new File([blob], att.name || 'image.jpg', { type: blob.type });
                      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${blob.type.split('/')[1] || 'jpg'}`;
                      return await uploadAttachment(file, fileName);
                   })();

                   // Race them
                   const publicUrl = await Promise.race([uploadTask, timeout]);
                   
                   if (publicUrl) {
                      return { ...att, url: publicUrl };
                   } else {
                      // Fallback: keep base64 if upload failed or timed out
                      return att;
                   }
                } catch (err) {
                   console.error("Upload error for item", err);
                   return att; // Keep local
                }
             } else {
                return att; // Already URL or Supabase disabled
             }
          });

          const results = await Promise.all(uploadPromises);
          processedAttachments.push(...results);

        } catch (error) {
           console.error("Critical error processing attachments", error);
           // Panic fallback: just use original attachments
           processedAttachments.push(...attachments);
        } finally {
           setIsUploading(false);
        }

        // 2. Submit Final Data
        setIsSuccess(true);
        setTimeout(() => {
           onSubmit(
             title || aiResult?.summary || "Solicitação",
             description,
             (aiResult?.category as IssueCategory) || IssueCategory.INFRAESTRUTURA,
             aiResult,
             isAnonymous,
             processedAttachments
           );
        }, 1500);
      }
    }
  };

  // Manual escape hatch in case it still gets stuck
  const forceSubmitLocal = () => {
      setIsUploading(false);
      setIsSuccess(true);
      setTimeout(() => {
         onSubmit(
           title || aiResult?.summary || "Solicitação",
           description,
           (aiResult?.category as IssueCategory) || IssueCategory.INFRAESTRUTURA,
           aiResult,
           isAnonymous,
           attachments // Send local files
         );
      }, 500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in p-6">
         <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-slate-100 text-center animate-scale-up">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Sucesso!</h2>
            <p className="text-lg font-medium text-emerald-700 mb-4">Sua solicitação foi enviada.</p>
            <div className="mt-8">
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-[width_2s_ease-in-out_forwards] w-0"></div>
               </div>
               <p className="text-[10px] text-slate-400 mt-2">Redirecionando...</p>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
      {/* Loading Overlay for Uploads */}
      {isUploading && (
        <div className="absolute inset-0 z-[60] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full border border-slate-100">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Enviando arquivos...</h3>
                <p className="text-sm text-slate-500 mb-6">Estamos processando suas evidências.</p>
                
                <button 
                  onClick={forceSubmitLocal}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
                >
                   Demorando muito? Pular upload e salvar localmente
                </button>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white shrink-0">
         <button onClick={onCancel} className="text-slate-500 font-medium">Cancelar</button>
         <h2 className="text-lg font-bold text-slate-900">{initialData ? 'Editar Solicitação' : 'Nova Solicitação'}</h2>
         <button 
           onClick={handleSubmit}
           disabled={(!aiResult && !initialData) || !description || !liabilityAccepted || isCompressing || isUploading}
           className={`font-bold ${(!aiResult && !initialData) || !description || !liabilityAccepted || isCompressing || isUploading ? 'text-slate-300' : 'text-emerald-600'}`}
         >
           {initialData ? 'Salvar' : 'Enviar'}
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Step 1: Location */}
        <div className="mb-6">
           <button 
             onClick={() => setLocationSet(true)}
             className={`w-full h-16 rounded-xl border flex items-center justify-between px-4 transition-colors ${locationSet ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-300 text-slate-400 bg-white'}`}
            >
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-full ${locationSet ? 'bg-emerald-200' : 'bg-slate-100'}`}>
                    <MapPin className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                    <span className="block text-xs font-bold uppercase">{locationSet ? 'Localização Definida' : 'Onde é o problema?'}</span>
                    <span className="text-xs opacity-70">{locationSet ? 'Toque para alterar' : 'Toque para marcar no mapa'}</span>
                 </div>
              </div>
              {locationSet && <CheckCircle2 className="w-5 h-5" />}
           </button>
        </div>

        {/* Step 2: Content Editor */}
        <div className="space-y-4">
           
           {/* Title Input */}
           <div>
             <input 
               type="text"
               className="w-full text-lg font-bold placeholder:text-slate-300 border-none focus:ring-0 p-0"
               placeholder="Dê um título curto..."
               value={title}
               onChange={(e) => setTitle(e.target.value)}
             />
           </div>

           {/* Description Textarea */}
           <div className="relative">
             <textarea 
               className="w-full h-32 text-slate-600 placeholder:text-slate-300 border-none focus:ring-0 p-0 resize-none text-base leading-relaxed"
               placeholder="Descreva o que aconteceu em detalhes..."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               onBlur={() => !aiResult && !initialData && description.length > 10 && handleAnalyze()}
             />
             
             {/* AI Floating Button */}
             {!aiResult && !initialData && description.length > 10 && (
                <button 
                  onClick={handleAnalyze}
                  className="absolute bottom-2 right-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg animate-bounce"
                >
                   {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                   {isAnalyzing ? 'Analisando...' : 'Melhorar com IA'}
                </button>
             )}
           </div>

           {/* Media Toolbar */}
           <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center justify-between">
                  Adicionar Evidências
                  {isCompressing && (
                      <span className="text-emerald-600 flex items-center gap-1 text-[10px]">
                          <Loader2 className="w-3 h-3 animate-spin" /> Otimizando imagem...
                      </span>
                  )}
              </p>
              
              <div className="flex gap-3 overflow-x-auto pb-2">
                 {/* Hidden File Input */}
                 <input 
                   type="file" 
                   accept="image/*" 
                   className="hidden" 
                   ref={fileInputRef}
                   onChange={handleImageUpload}
                 />

                 {/* Photo Button */}
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   disabled={isCompressing}
                   className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-500 hover:bg-slate-100 shrink-0 disabled:opacity-50"
                 >
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-[9px] font-bold">Foto</span>
                 </button>

                 {/* Audio Button */}
                 <button 
                   onClick={toggleAudioRecording}
                   className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center gap-1 shrink-0 transition-all ${isRecordingAudio ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                 >
                    {isRecordingAudio ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
                    <span className="text-[9px] font-bold">{isRecordingAudio ? formatTime(recordingTimer) : 'Áudio'}</span>
                 </button>

                 {/* Video Button */}
                 <button 
                   onClick={simulateVideoRecording}
                   className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-500 hover:bg-slate-100 shrink-0"
                 >
                    <Video className="w-6 h-6" />
                    <span className="text-[9px] font-bold">Vídeo</span>
                 </button>
              </div>

              {/* Attachments Preview List */}
              {attachments.length > 0 && (
                 <div className="grid grid-cols-3 gap-2 mt-4">
                    {attachments.map((att) => (
                       <div key={att.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group bg-slate-100">
                          {att.type === 'IMAGE' && (
                             <>
                                <img src={att.url} className="w-full h-full object-cover" alt="preview" />
                                {att.url.startsWith('data:') && (
                                   <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded text-center">
                                      {supabase ? 'Pendente Upload' : 'Local'}
                                   </div>
                                )}
                             </>
                          )}
                          {att.type === 'AUDIO' && (
                             <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                <Mic className="w-6 h-6" />
                                <span className="text-[8px] font-bold mt-1">ÁUDIO</span>
                             </div>
                          )}
                          {att.type === 'VIDEO' && (
                             <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                <Video className="w-6 h-6" />
                                <span className="text-[8px] font-bold mt-1">VÍDEO</span>
                             </div>
                          )}
                          
                          <button 
                            onClick={() => removeAttachment(att.id)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <X className="w-3 h-3" />
                          </button>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>

        {/* AI Result Card */}
        {aiResult && (
          <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
               <Wand2 className="w-4 h-4 text-indigo-600" />
               <h3 className="text-sm font-bold text-indigo-800">Classificação Automática</h3>
            </div>
            <div className="flex gap-2">
               <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">{aiResult.category}</span>
               <span className="px-2 py-1 bg-white text-indigo-600 text-xs font-bold rounded border border-indigo-100">Severidade: {aiResult.severity}</span>
            </div>
          </div>
        )}

        {/* ANONYMITY & LIABILITY */}
        <div className="mt-6 space-y-4">
           <div 
             onClick={() => setIsAnonymous(!isAnonymous)}
             className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${isAnonymous ? 'bg-slate-800 border-slate-700 shadow-md' : 'bg-white border-slate-200'}`}
           >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isAnonymous ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-400'}`}>
                 {isAnonymous ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                 <h3 className={`text-sm font-bold ${isAnonymous ? 'text-white' : 'text-slate-800'}`}>
                    {isAnonymous ? 'Identidade Protegida' : 'Denúncia Pública'}
                 </h3>
                 <p className={`text-xs ${isAnonymous ? 'text-slate-300' : 'text-slate-500'}`}>
                    {isAnonymous 
                       ? 'Seu nome será ocultado.' 
                       : 'Seu nome aparecerá como autor.'}
                 </p>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isAnonymous ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                 <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isAnonymous ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
           </div>

           <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                 <div className="pt-0.5">
                    <input 
                      type="checkbox" 
                      id="liability"
                      checked={liabilityAccepted}
                      onChange={(e) => setLiabilityAccepted(e.target.checked)}
                      className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                 </div>
                 <div>
                    <label htmlFor="liability" className="text-sm font-bold text-red-800 cursor-pointer">
                       Termo de Responsabilidade
                    </label>
                    <p className="text-xs text-red-600 mt-1 leading-relaxed">
                       Declaro que as informações são verdadeiras e estou ciente das implicações legais (Art. 340 CP) sobre falsa comunicação de crime.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IssueForm;