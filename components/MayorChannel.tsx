import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Send, Video, Mic, Paperclip, CheckCircle2, Landmark, Trash2, StopCircle, Play, Link as LinkIcon } from 'lucide-react';

interface MayorChannelProps {
  user: User;
}

const MayorChannel: React.FC<MayorChannelProps> = ({ user }) => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, text: string, type: 'TEXT' | 'AUDIO' | 'VIDEO' | 'VIDEO_LINK', sender: 'USER' | 'SYSTEM'}>>([
     {id: 'sys1', text: 'Bem-vindo ao canal oficial. Sua mensagem será lida diretamente pela minha assessoria.', type: 'TEXT', sender: 'SYSTEM'}
  ]);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'AUDIO' | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<any>(null);

  const startRecording = (type: 'AUDIO') => {
    setRecordingType(type);
    setIsRecording(true);
    setTimer(0);
    timerRef.current = setInterval(() => {
       setTimer(t => t + 1);
    }, 1000);
  };

  const stopRecording = (shouldSend: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    
    if (shouldSend && recordingType) {
       // Mock sending media
       const newMsg = {
         id: Math.random().toString(),
         text: `Áudio (${formatTime(timer)})`,
         type: recordingType,
         sender: 'USER' as const
       };
       setMessages([...messages, newMsg]);
       simulateAutoReply();
    }
    setRecordingType(null);
    setTimer(0);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMsg = {
         id: Math.random().toString(),
         text: message,
         type: 'TEXT' as const,
         sender: 'USER' as const
      };
      setMessages([...messages, newMsg]);
      setMessage('');
      simulateAutoReply();
    }
  };

  const handleAddVideoLink = () => {
     const url = prompt("Insira o link do seu vídeo (YouTube, Drive, etc):");
     if (url) {
        const newMsg = {
            id: Math.random().toString(),
            text: url,
            type: 'VIDEO_LINK' as const,
            sender: 'USER' as const
        };
        setMessages([...messages, newMsg]);
        simulateAutoReply();
     }
  };

  const simulateAutoReply = () => {
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-fade-in relative">
      
      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* Header / Video Section */}
        <div className="bg-slate-900 text-white p-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Landmark className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center mt-2">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-500 p-1 mb-3 shadow-lg bg-slate-800">
              <img 
                src="https://ui-avatars.com/api/?name=Prefeito+Municipal&background=0f172a&color=fff&size=200" 
                alt="Prefeito" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold">Gabinete Digital</h2>
            <p className="text-slate-300 text-sm max-w-xs mx-auto mt-2 italic">
              "Olá, envie suas sugestões diretamente para mim."
            </p>

            {/* YouTube Video Player */}
            <div className="mt-6 w-full max-w-sm aspect-video bg-black rounded-xl border border-slate-700 overflow-hidden shadow-2xl relative">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/5qap5aO4i9A?modestbranding=1&rel=0" 
                  title="Palavra do Prefeito"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               Atualização Semanal
            </div>
          </div>
        </div>

        {/* Chat Interface Content */}
        <div className="px-4 py-6 max-w-md mx-auto space-y-4 pb-20">
          
          {messages.map(msg => (
             <div key={msg.id} className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : ''}`}>
                {msg.sender === 'SYSTEM' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center">
                      <Landmark className="w-4 h-4 text-slate-600" />
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl shadow-sm border max-w-[80%] 
                  ${msg.sender === 'USER' ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-none' : 'bg-white border-slate-200 rounded-tl-none'}`}>
                    
                    {msg.type === 'TEXT' && (
                       <p className={`text-sm ${msg.sender === 'USER' ? 'text-white' : 'text-slate-700'}`}>{msg.text}</p>
                    )}

                    {msg.type === 'AUDIO' && (
                       <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'USER' ? 'bg-white/20' : 'bg-indigo-100'}`}>
                             <Play className="w-4 h-4 fill-current" />
                          </div>
                          <div>
                             <div className="h-1 w-24 bg-current opacity-30 rounded-full mb-1"></div>
                             <span className="text-[10px] font-bold opacity-80">{msg.text}</span>
                          </div>
                       </div>
                    )}

                    {(msg.type === 'VIDEO' || msg.type === 'VIDEO_LINK') && (
                       <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'USER' ? 'bg-white/20' : 'bg-indigo-100'}`}>
                             <LinkIcon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                             <span className="text-[10px] font-bold uppercase opacity-70">Link de Vídeo</span>
                             <a href={msg.text} target="_blank" rel="noopener noreferrer" className="text-xs font-bold underline truncate max-w-[150px]">
                                {msg.text}
                             </a>
                          </div>
                       </div>
                    )}
                    
                    <span className={`text-[9px] mt-1 block opacity-60 ${msg.sender === 'USER' ? 'text-indigo-100' : 'text-slate-400'}`}>
                       {msg.sender === 'SYSTEM' ? 'Prefeitura' : 'Você'}
                    </span>
                </div>
             </div>
          ))}
          
          {sent && (
             <div className="flex justify-end animate-fade-in">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Enviado
                </span>
             </div>
          )}
        </div>
      </div>

      {/* Input Area (Fixed at Bottom) */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
         <div className="max-w-md mx-auto">
           
           {isRecording ? (
             // --- RECORDING UI ---
             <div className="flex items-center gap-3 bg-red-50 p-2 rounded-xl border border-red-100 animate-fade-in">
                 <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                    <Mic className="w-5 h-5 text-white" />
                 </div>
                 
                 <div className="flex-1">
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wide">
                       Gravando Áudio
                    </p>
                    <p className="text-sm font-mono text-red-800">{formatTime(timer)}</p>
                 </div>

                 <button 
                   onClick={() => stopRecording(false)} 
                   className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
                 >
                    <Trash2 className="w-5 h-5" />
                 </button>

                 <button 
                   onClick={() => stopRecording(true)} 
                   className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 shadow-md"
                 >
                    <Send className="w-4 h-4" />
                 </button>
             </div>
           ) : (
             // --- STANDARD INPUT UI ---
             <form onSubmit={handleSendText} className="relative flex items-end gap-2">
               <button type="button" className="p-3 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                 <Paperclip className="w-5 h-5" />
               </button>
               
               <div className="flex-1 relative">
                 <textarea 
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   placeholder="Digite ou grave uma mensagem..."
                   className="w-full bg-slate-100 border-none rounded-2xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all shadow-inner resize-none h-12 max-h-32"
                 />
               </div>

               {message.trim() ? (
                  <button 
                    type="submit"
                    className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                  >
                    <Send className="w-5 h-5" />
                  </button>
               ) : (
                  // Mic/Link Buttons when text is empty
                  <div className="flex gap-1">
                    <button 
                      type="button"
                      onClick={() => startRecording('AUDIO')}
                      className="p-3 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-indigo-600 rounded-xl transition-colors"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <button 
                      type="button"
                      onClick={handleAddVideoLink}
                      title="Enviar Link de Vídeo (Economize Dados)"
                      className="p-3 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-indigo-600 rounded-xl transition-colors"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </button>
                  </div>
               )}
             </form>
           )}
         </div>
      </div>
    </div>
  );
};

export default MayorChannel;