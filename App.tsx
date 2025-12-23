import React, { useState, useEffect } from 'react';
import { 
  MOCK_USER, 
  INITIAL_ISSUES
} from './constants';
import { 
  User, 
  Issue, 
  IssueStatus, 
  UserRole,
  Comment
} from './types';
import { dataService } from './services/dataService';

// COMPONENTS
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import CitizenHome from './components/CitizenHome';
import IssueWizard from './components/IssueWizard';
import IssueDetails from './components/IssueDetails';
import AdminDashboard from './components/AdminDashboard';
import { CheckCircle2, Copy, ArrowRight } from 'lucide-react';

// FLUXO DE ESTADOS DO APP
enum AppStage {
  SPLASH = 'SPLASH',
  AUTH = 'AUTH',
  HOME_CITIZEN = 'HOME_CITIZEN',     // Decisão Única
  WIZARD = 'WIZARD',                 // Fluxo Guiado
  SUCCESS_PROTOCOL = 'SUCCESS_PROTOCOL', // Confirmação
  TRACKING_LIST = 'TRACKING_LIST',   // Acompanhamento
  DASHBOARD_EXEC = 'DASHBOARD_EXEC'  // Painel Executivo
}

const App: React.FC = () => {
  const [appStage, setAppStage] = useState<AppStage>(AppStage.SPLASH);
  const [user, setUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  
  // UI State
  const [lastProtocol, setLastProtocol] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // --- INITIAL LOAD ---
  useEffect(() => {
    const storedUser = localStorage.getItem('ec_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    dataService.getIssues().then(data => {
      if (data.length > 0) setIssues(data);
    });
  }, []);

  // --- HANDLERS ---

  const handleSplashComplete = () => {
    if (user) {
      if (user.role === UserRole.EXECUTIVE) setAppStage(AppStage.DASHBOARD_EXEC);
      else setAppStage(AppStage.HOME_CITIZEN);
    } else {
      setAppStage(AppStage.AUTH);
    }
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('ec_user', JSON.stringify(newUser));
    if (newUser.role === UserRole.EXECUTIVE) setAppStage(AppStage.DASHBOARD_EXEC);
    else setAppStage(AppStage.HOME_CITIZEN);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ec_user');
    setAppStage(AppStage.AUTH);
  };

  const handleWizardSubmit = (data: any) => {
    if (!user) return;

    const protocol = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const newIssue: Issue = {
      id: protocol,
      title: data.title, // Gerado pela IA ou fallback
      description: data.description,
      category: data.category,
      status: IssueStatus.REGISTRADA,
      votes: 0,
      location: data.location,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      isAnonymous: data.isAnonymous,
      attachments: [],
      createdAt: new Date(),
      aiAnalysis: data.aiAnalysis?.summary,
      comments: [],
      supportedBy: [],
      flaggedBy: [],
      moderationStatus: 'APPROVED'
    };

    setIssues([newIssue, ...issues]);
    setLastProtocol(protocol);
    setAppStage(AppStage.SUCCESS_PROTOCOL);
    
    // Async Persist
    dataService.createIssue(newIssue).catch(console.error);
  };

  // Executivo responde ao chamado
  const handleExecutiveComment = (issueId: string, text: string, audioUrl?: string) => {
    if (!user) return;
    
    const updatedIssues = issues.map(i => {
      if (i.id === issueId) {
        const newComment: Comment = {
          id: Math.random().toString(),
          userId: user.id,
          userName: 'Gabinete Digital',
          userAvatar: '',
          text: text,
          audioUrl: audioUrl,
          isOfficial: true,
          createdAt: new Date()
        };
        // Muda status automaticamente
        const newStatus = i.status === IssueStatus.REGISTRADA ? IssueStatus.ANALISE : i.status;
        return { ...i, status: newStatus, comments: [...i.comments, newComment] };
      }
      return i;
    });

    setIssues(updatedIssues);
    const current = updatedIssues.find(i => i.id === issueId);
    if(current) setSelectedIssue(current);
  };

  // --- RENDER STAGES ---

  if (appStage === AppStage.SPLASH) {
    return <SplashScreen onComplete={handleSplashComplete} city="São Paulo" />;
  }

  if (appStage === AppStage.AUTH) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // 1. HOME DO CIDADÃO (Decisão Única)
  if (appStage === AppStage.HOME_CITIZEN && user) {
    return (
      <CitizenHome 
        user={user} 
        city="São Paulo" 
        onStartFlow={() => setAppStage(AppStage.WIZARD)}
        onViewTracking={() => setAppStage(AppStage.TRACKING_LIST)}
        onLogout={handleLogout}
      />
    );
  }

  // 2. WIZARD (Fluxo Guiado 6 Passos)
  if (appStage === AppStage.WIZARD) {
    return (
      <IssueWizard 
        city="São Paulo" 
        onSubmit={handleWizardSubmit} 
        onCancel={() => setAppStage(AppStage.HOME_CITIZEN)} 
      />
    );
  }

  // 3. PROTOCOLO (Confirmação)
  if (appStage === AppStage.SUCCESS_PROTOCOL) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in font-sans">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-scale-up">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 mb-2">Demanda Registrada</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">Agradecemos sua colaboração. Sua solicitação foi encaminhada para triagem.</p>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 w-full max-w-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Número do Protocolo</p>
          <div className="flex items-center justify-center gap-3">
             <span className="text-3xl font-mono font-bold text-slate-800 tracking-wider">#{lastProtocol}</span>
             <Copy className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <button 
            onClick={() => setAppStage(AppStage.TRACKING_LIST)}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Acompanhar Demanda <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setAppStage(AppStage.HOME_CITIZEN)}
            className="w-full py-4 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // 4. ACOMPANHAMENTO (Lista de Cards)
  if (appStage === AppStage.TRACKING_LIST && user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
           <button onClick={() => setAppStage(AppStage.HOME_CITIZEN)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600">←</button>
           <h1 className="font-bold text-slate-900 text-lg">Meus Protocolos</h1>
        </header>
        
        <div className="flex-1 p-4 space-y-4">
           {issues.filter(i => i.authorId === user.id || i.isAnonymous).map(issue => (
              <div 
                key={issue.id} 
                onClick={() => setSelectedIssue(issue)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 cursor-pointer active:scale-[0.98] transition-all"
              >
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-50 px-2 py-1 rounded">{issue.category}</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                        issue.status === IssueStatus.RESOLVIDA ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                        issue.status === IssueStatus.ANALISE ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                       {issue.status}
                    </span>
                 </div>
                 
                 <h3 className="font-bold text-slate-900 mb-2">{issue.title}</h3>
                 <p className="text-xs text-slate-500 line-clamp-2 mb-3">{issue.description}</p>
                 
                 <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="text-[10px] font-mono text-slate-400">#{issue.id}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      {issue.isAnonymous && <span className="bg-slate-100 px-1 rounded">Identidade Protegida</span>}
                    </span>
                 </div>
                 
                 {/* Notification Badge if Official Response */}
                 {issue.comments.some(c => c.isOfficial) && (
                    <div className="mt-3 bg-blue-50 text-blue-700 p-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-100">
                        <CheckCircle2 className="w-4 h-4" /> Nova resposta oficial
                    </div>
                 )}
              </div>
           ))}
        </div>

        {selectedIssue && (
          <IssueDetails 
            issue={selectedIssue} 
            currentUser={user} 
            onClose={() => setSelectedIssue(null)}
            onSupport={() => {}}
            onComment={() => {}}
          />
        )}
      </div>
    );
  }

  // 5. ÁREA EXECUTIVA (Painel)
  if (appStage === AppStage.DASHBOARD_EXEC && user) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col font-sans">
         <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-lg z-20">
            <h1 className="font-bold text-lg">Gabinete Digital</h1>
            <button onClick={handleLogout} className="text-xs font-bold text-slate-400 border border-slate-700 px-3 py-1 rounded hover:bg-slate-800">Sair</button>
         </div>
         <div className="flex-1 flex overflow-hidden">
            <div className="w-1/3 border-r border-slate-200 bg-white overflow-y-auto">
               {issues.map(issue => (
                  <div 
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${selectedIssue?.id === issue.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                  >
                     <span className="text-[10px] font-bold text-slate-400 uppercase">{issue.category}</span>
                     <h4 className="font-bold text-sm text-slate-800 truncate">{issue.title}</h4>
                     <span className="text-[10px] text-slate-500">#{issue.id}</span>
                  </div>
               ))}
            </div>
            <div className="flex-1 relative bg-slate-50">
               {selectedIssue ? (
                  <IssueDetails 
                    issue={selectedIssue} 
                    currentUser={user} 
                    onClose={() => setSelectedIssue(null)}
                    onSupport={() => {}}
                    onComment={handleExecutiveComment}
                  />
               ) : (
                  <AdminDashboard issues={issues} />
               )}
            </div>
         </div>
      </div>
    );
  }

  return null;
};

export default App;