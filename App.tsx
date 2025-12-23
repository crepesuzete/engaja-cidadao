import React, { useState, useEffect } from 'react';
import { 
  MOCK_USER, 
  INITIAL_ISSUES, 
  MOCK_NOTIFICATIONS
} from './constants';
import { 
  User, 
  Issue, 
  IssueStatus, 
  UserRole,
  Comment,
  Notification
} from './types';
import { dataService } from './services/dataService';

// NEW COMPONENTS
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import CitizenHome from './components/CitizenHome';
import IssueWizard from './components/IssueWizard';
import IssueDetails from './components/IssueDetails';
import AdminDashboard from './components/AdminDashboard';
import LegislativeView from './components/LegislativeView';
import { CheckCircle2, Copy } from 'lucide-react';

// STAGES ENUM
enum AppStage {
  SPLASH = 'SPLASH',
  AUTH = 'AUTH',
  HOME_CITIZEN = 'HOME_CITIZEN',
  WIZARD = 'WIZARD',
  MY_ISSUES = 'MY_ISSUES',
  DASHBOARD_EXEC = 'DASHBOARD_EXEC',
  DASHBOARD_LEG = 'DASHBOARD_LEG',
  SUCCESS_SCREEN = 'SUCCESS_SCREEN'
}

const App: React.FC = () => {
  // Global State
  const [appStage, setAppStage] = useState<AppStage>(AppStage.SPLASH);
  const [user, setUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  
  // Specific UI State
  const [lastProtocol, setLastProtocol] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null); // For Details Modal

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    // Basic Persistence
    const storedUser = localStorage.getItem('ec_user');
    if (storedUser) {
       const parsedUser = JSON.parse(storedUser);
       setUser(parsedUser);
    }
    
    // Load Issues
    const fetchIssues = async () => {
      const remoteIssues = await dataService.getIssues();
      if (remoteIssues.length > 0) setIssues(remoteIssues);
    };
    fetchIssues();
  }, []);

  // --- HANDLERS ---

  const handleSplashComplete = () => {
    if (user) {
      // Redirect based on role
      if (user.role === UserRole.EXECUTIVE) setAppStage(AppStage.DASHBOARD_EXEC);
      else if (user.role === UserRole.LEGISLATIVE) setAppStage(AppStage.DASHBOARD_LEG);
      else setAppStage(AppStage.HOME_CITIZEN);
    } else {
      setAppStage(AppStage.AUTH);
    }
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('ec_user', JSON.stringify(newUser));
    
    if (newUser.role === UserRole.EXECUTIVE) setAppStage(AppStage.DASHBOARD_EXEC);
    else if (newUser.role === UserRole.LEGISLATIVE) setAppStage(AppStage.DASHBOARD_LEG);
    else setAppStage(AppStage.HOME_CITIZEN);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ec_user');
    setAppStage(AppStage.AUTH);
  };

  const handleWizardSubmit = async (data: any) => {
    if (!user) return;

    const newIssue: Issue = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      title: data.title,
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

    // Optimistic Update
    setIssues([newIssue, ...issues]);
    
    // DB Save (Async)
    dataService.createIssue(newIssue).catch(console.error);

    setLastProtocol(newIssue.id);
    setAppStage(AppStage.SUCCESS_SCREEN);
  };

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
        // Update status automatically on response
        const newStatus = i.status === IssueStatus.REGISTRADA ? IssueStatus.ANALISE : i.status;
        return { ...i, status: newStatus, comments: [...i.comments, newComment] };
      }
      return i;
    });

    setIssues(updatedIssues);
    // Sync with selectedIssue if open
    const current = updatedIssues.find(i => i.id === issueId);
    if(current) setSelectedIssue(current);
  };

  // --- RENDER VIEWS ---

  if (appStage === AppStage.SPLASH) {
    return <SplashScreen onComplete={handleSplashComplete} city="São Paulo (Demo)" />;
  }

  if (appStage === AppStage.AUTH) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // --- CITIZEN FLOW ---

  if (appStage === AppStage.HOME_CITIZEN && user) {
    return (
      <CitizenHome 
        user={user} 
        city="São Paulo" 
        onNewIssue={() => setAppStage(AppStage.WIZARD)}
        onTrackIssues={() => setAppStage(AppStage.MY_ISSUES)}
        onLogout={handleLogout}
      />
    );
  }

  if (appStage === AppStage.WIZARD) {
    return (
      <IssueWizard 
        city="São Paulo" 
        onSubmit={handleWizardSubmit} 
        onCancel={() => setAppStage(AppStage.HOME_CITIZEN)} 
      />
    );
  }

  if (appStage === AppStage.SUCCESS_SCREEN) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Sucesso!</h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">Sua demanda foi registrada e encaminhada para a triagem.</p>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 w-full max-w-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-slate-200 rounded-bl-full opacity-20"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Número do Protocolo</p>
          <div className="flex items-center justify-center gap-2">
             <p className="text-3xl font-mono font-bold text-slate-800 tracking-wider">#{lastProtocol}</p>
             <button className="text-slate-400 hover:text-slate-600"><Copy className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="space-y-3 w-full max-w-sm">
          <button 
            onClick={() => setAppStage(AppStage.MY_ISSUES)}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-colors"
          >
            Acompanhar Demanda
          </button>
          <button 
            onClick={() => setAppStage(AppStage.HOME_CITIZEN)}
            className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // --- MY ISSUES LIST (Replacing MapView context) ---
  if (appStage === AppStage.MY_ISSUES && user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="px-6 py-6 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10 sticky top-0">
           <button onClick={() => setAppStage(AppStage.HOME_CITIZEN)} className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">← Voltar</button>
           <h1 className="font-black text-slate-800 text-lg">Meus Protocolos</h1>
           <div className="w-12"></div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {issues.filter(i => i.authorId === user.id || i.isAnonymous).length === 0 && (
              <div className="text-center py-20 opacity-50">
                 <p>Nenhuma demanda encontrada.</p>
              </div>
           )}

           {issues.filter(i => i.authorId === user.id || i.isAnonymous).map(issue => (
              <div 
                key={issue.id} 
                onClick={() => setSelectedIssue(issue)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all relative group"
              >
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-50 px-2 py-1 rounded">{issue.category}</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${issue.status === IssueStatus.RESOLVIDA ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                       {issue.status}
                    </span>
                 </div>
                 
                 <h3 className="font-bold text-slate-900 mb-2 leading-tight">{issue.title}</h3>
                 <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{issue.description}</p>
                 
                 <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="text-[10px] font-mono text-slate-400">#{issue.id}</span>
                    <span className="text-[10px] text-slate-400">{issue.location.label}</span>
                 </div>

                 {/* Notification Badge */}
                 {issue.comments.some(c => c.isOfficial) && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1">
                       <CheckCircle2 className="w-3 h-3" /> Resposta Oficial
                    </div>
                 )}
              </div>
           ))}
        </div>
        
        {/* Floating Action Button for New Issue inside List */}
        <button 
          onClick={() => setAppStage(AppStage.WIZARD)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-20"
        >
           <span className="text-2xl font-light">+</span>
        </button>

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

  // --- EXECUTIVE FLOW ---

  if (appStage === AppStage.DASHBOARD_EXEC && user) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col font-sans">
         {/* Simple Executive Header */}
         <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-lg z-20">
            <h1 className="font-bold text-lg flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               Painel Executivo
            </h1>
            <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white font-bold bg-white/10 px-3 py-1.5 rounded-lg transition-colors">Sair</button>
         </div>
         
         <div className="flex-1 overflow-hidden flex">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-slate-200 bg-white overflow-y-auto">
               {issues.map(issue => (
                  <div 
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedIssue?.id === issue.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                  >
                     <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{issue.category}</span>
                        <span className="text-[10px] font-mono text-slate-400">#{issue.id.slice(0,4)}</span>
                     </div>
                     <h4 className="font-bold text-sm text-slate-800 truncate mb-1">{issue.title}</h4>
                     <div className="flex gap-2">
                        {issue.status === IssueStatus.REGISTRADA && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">Novo</span>}
                        {issue.isAnonymous && <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">Anônimo</span>}
                     </div>
                  </div>
               ))}
            </div>
            
            {/* Detail Area / Stats */}
            <div className="flex-1 bg-slate-50 relative">
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

  // --- LEGISLATIVE FLOW ---
  if (appStage === AppStage.DASHBOARD_LEG && user) {
     return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans">
           <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-lg z-20">
              <h1 className="font-bold text-lg">Câmara Municipal</h1>
              <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white font-bold bg-white/10 px-3 py-1.5 rounded-lg transition-colors">Sair</button>
           </div>
           <div className="flex-1 overflow-hidden">
              <LegislativeView 
                councilors={[]} // Re-populate with mock if needed or keep existing logic
                bills={[]} 
                userRole={user.role} 
                onVoteBill={() => {}} 
              />
           </div>
        </div>
     )
  }

  return <div>Estado desconhecido</div>;
};

export default App;