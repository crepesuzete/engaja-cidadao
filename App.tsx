import React, { useState, useEffect } from 'react';
import { 
  MOCK_USER, 
  INITIAL_ISSUES, 
<<<<<<< HEAD
  MOCK_NOTIFICATIONS
=======
  INITIAL_MISSIONS, 
  REWARDS,
  MOCK_NOTIFICATIONS,
  MOCK_ALERT,
  MOCK_POLL,
  MOCK_COUNCILORS,
  MOCK_BILLS
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
} from './constants';
import { 
  User, 
  Issue, 
<<<<<<< HEAD
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
=======
  Mission, 
  IssueCategory, 
  IssueStatus, 
  UserRole,
  Comment,
  Notification,
  EmergencyAlert,
  Poll,
  Councilor,
  LegislativeBill,
  Attachment
} from './types';
import { dataService } from './services/dataService'; // Importa o serviço de dados

// Icons
import { Map, Target, UserCircle, Gift, PlusCircle, MapPin, Landmark, Bell, Check, Building2, ChevronDown, Shield, Trophy } from 'lucide-react';

// Components
import MapView from './components/MapView';
import MissionsView from './components/MissionsView';
import RewardsView from './components/RewardsView';
import AdminDashboard from './components/AdminDashboard';
import IssueForm from './components/IssueForm';
import LocationSelector from './components/LocationSelector';
import IssueDetails from './components/IssueDetails';
import IssueListSidebar from './components/IssueListSidebar';
import MayorChannel from './components/MayorChannel';
import ProfileView from './components/ProfileView';
import EmergencyBanner from './components/EmergencyBanner';
import ActivePoll from './components/ActivePoll';
import LeaderboardView from './components/LeaderboardView';
import LegislativeView from './components/LegislativeView';
import AuthScreen from './components/AuthScreen'; // NEW Auth Screen

// SAFETY VERSION: Changing this clears local storage to prevent crashes on update
const APP_VERSION = '1.1';

enum View {
  MAP = 'MAP',
  MISSIONS = 'MISSIONS',
  REWARDS = 'REWARDS',
  ADMIN = 'ADMIN',
  PROFILE = 'PROFILE',
  MAYOR = 'MAYOR',
  LEADERBOARD = 'LEADERBOARD',
  LEGISLATIVE = 'LEGISLATIVE'
}

const App: React.FC = () => {
  // --- STATE WITH LOCAL STORAGE PERSISTENCE ---
  
  // Safe loader that handles corrupt JSON and version mismatches
  const loadFromStorage = <T,>(key: string, defaultVal: T): T => {
    try {
      // Version Check
      const version = localStorage.getItem('ec_version');
      if (version !== APP_VERSION) {
         console.log('New version detected. Clearing storage to prevent conflicts.');
         localStorage.clear();
         localStorage.setItem('ec_version', APP_VERSION);
         return defaultVal;
      }

      const stored = localStorage.getItem(key);
      if (!stored) return defaultVal;
      
      return JSON.parse(stored, (key, value) => {
         // Restore Date objects
         if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
            return new Date(value);
         }
         return value;
      });
    } catch (e) {
      console.error(`Error loading ${key}, resetting to default.`, e);
      return defaultVal;
    }
  };

  // Global State
  // Initial User is NULL now to trigger Auth Screen
  const [user, setUser] = useState<User | null>(() => loadFromStorage('ec_user', null)); 
  
  const [issues, setIssues] = useState<Issue[]>(() => loadFromStorage('ec_issues', INITIAL_ISSUES));
  const [missions, setMissions] = useState<Mission[]>(() => loadFromStorage('ec_missions', INITIAL_MISSIONS));
  
  // Legislative State
  const [bills, setBills] = useState<LegislativeBill[]>(() => loadFromStorage('ec_bills', MOCK_BILLS));
  const [councilors, setCouncilors] = useState<Councilor[]>(() => loadFromStorage('ec_councilors', MOCK_COUNCILORS));

  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeView, setActiveView] = useState<View>(View.MAP);
  
  // New States for Features
  const [emergencyAlert, setEmergencyAlert] = useState<EmergencyAlert | null>(MOCK_ALERT);
  const [activePoll, setActivePoll] = useState<Poll | null>(MOCK_POLL);
  
  // UI State
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [selectedIssueDetails, setSelectedIssueDetails] = useState<Issue | null>(null);
  
  // Location State
  const [selectedLocation, setSelectedLocation] = useState<{city: string, state: string} | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const remoteIssues = await dataService.getIssues();
        if (remoteIssues && remoteIssues.length > 0) {
          setIssues(remoteIssues);
        }
      } catch (error) {
        console.error("Failed to fetch issues from Supabase, using local", error);
      }
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
    };
    fetchIssues();
  }, []);

<<<<<<< HEAD
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
=======
  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('ec_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ec_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('ec_missions', JSON.stringify(missions));
  }, [missions]);
  
  useEffect(() => {
    localStorage.setItem('ec_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('ec_councilors', JSON.stringify(councilors));
  }, [councilors]);

  // --- Handlers ---

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    // Determine default view based on Role
    if (newUser.role === UserRole.EXECUTIVE) {
      setActiveView(View.ADMIN);
    } else if (newUser.role === UserRole.LEGISLATIVE) {
      setActiveView(View.LEGISLATIVE);
    } else {
      setActiveView(View.MAP);
    }
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
  };

  const handleLogout = () => {
    setUser(null);
<<<<<<< HEAD
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
=======
    setSelectedLocation(null);
    localStorage.removeItem('ec_user');
  };

  const handleNotificationsToggle = () => {
     setShowNotifications(!showNotifications);
     if (!showNotifications && unreadCount > 0) {
        setTimeout(() => {
           setNotifications(prev => prev.map(n => ({...n, read: true})));
        }, 1000);
     }
  };

  const handleAddIssue = async (title: string, description: string, category: IssueCategory, aiAnalysis: any, isAnonymous: boolean, attachments: Attachment[]) => {
    if (!user) return;
    
    if (editingIssue) {
      handleUpdateIssue(editingIssue.id, { title, description, category, isAnonymous, attachments });
      setEditingIssue(null);
      setShowIssueForm(false);
      return;
    }

    const newIssue: Issue = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      category,
      status: IssueStatus.REGISTRADA,
      votes: 1,
      location: { label: selectedLocation?.city || 'Local' }, 
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      isAnonymous: isAnonymous,
      attachments: attachments, 
      createdAt: new Date(),
      aiAnalysis: aiAnalysis?.summary,
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
      comments: [],
      supportedBy: [],
      flaggedBy: [],
      moderationStatus: 'APPROVED'
    };

<<<<<<< HEAD
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
=======
    // 1. Optimistic Update (Show immediately)
    setIssues([newIssue, ...issues]);
    setShowIssueForm(false);

    // 2. Persist to Supabase
    try {
      await dataService.createIssue(newIssue);
    } catch (e) {
      console.error("Failed to save to cloud", e);
      // Optional: rollback or show error
    }
    
    setUser(prev => prev ? ({ 
      ...prev, 
      points: prev.points + 50,
      recentActivity: [{
         id: Math.random().toString(),
         type: 'ISSUE_CREATED',
         title: `Reportou: ${title.substring(0, 15)}...`,
         date: new Date(),
         pointsEarned: 50
      }, ...prev.recentActivity]
    }) : null);
  };

  const handleUpdateIssue = (id: string, updates: Partial<Issue> | { location: { lat: number, lng: number } }) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id !== id) return issue;
      if ('location' in updates && updates.location) {
          return {
              ...issue,
              ...updates,
              location: {
                  ...issue.location,
                  ...updates.location
              }
          } as Issue;
      }
      return { ...issue, ...(updates as Partial<Issue>) };
    }));
  };

  const handleDeleteIssue = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta ocorrência?")) {
       setIssues(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleEditRequest = (issue: Issue) => {
    setEditingIssue(issue);
    setShowIssueForm(true);
  };

  const handleViewDetails = (issue: Issue) => {
    setSelectedIssueDetails(issue);
  };

  const handleSupportIssue = (issueId: string) => {
     if(!user) return;
     setIssues(prev => prev.map(issue => {
       if (issue.id !== issueId) return issue;

       const isSupported = issue.supportedBy.includes(user.id);
       let newSupportedBy = [...issue.supportedBy];
       
       if (isSupported) {
         newSupportedBy = newSupportedBy.filter(id => id !== user.id);
       } else {
         newSupportedBy.push(user.id);
       }

       return { ...issue, supportedBy: newSupportedBy };
     }));

     if (selectedIssueDetails && selectedIssueDetails.id === issueId) {
        setSelectedIssueDetails(prev => {
          if(!prev) return null;
          const isSupported = prev.supportedBy.includes(user.id);
          let newSupportedBy = [...prev.supportedBy];
          if (isSupported) {
             newSupportedBy = newSupportedBy.filter(id => id !== user.id);
          } else {
             newSupportedBy.push(user.id);
          }
          return { ...prev, supportedBy: newSupportedBy };
        });
     }
  };

  const handleFlagIssue = (issueId: string) => {
    if(!user) return;
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      
      const alreadyFlagged = issue.flaggedBy.includes(user.id);
      if (alreadyFlagged) return issue;

      const newFlaggedBy = [...issue.flaggedBy, user.id];
      const newStatus = newFlaggedBy.length >= 3 ? 'UNDER_REVIEW' : issue.moderationStatus;

      return { 
        ...issue, 
        flaggedBy: newFlaggedBy,
        moderationStatus: newStatus 
      };
    }));

     if (selectedIssueDetails && selectedIssueDetails.id === issueId) {
        setSelectedIssueDetails(prev => {
           if (!prev) return null;
           const newFlaggedBy = [...prev.flaggedBy, user.id];
           const newStatus = newFlaggedBy.length >= 3 ? 'UNDER_REVIEW' : prev.moderationStatus;
           return { ...prev, flaggedBy: newFlaggedBy, moderationStatus: newStatus };
        });
     }
     
     alert("Denúncia enviada. Nossa equipe e a comunidade irão analisar o conteúdo.");
  };

  const handleAddComment = (issueId: string, text: string) => {
     if(!user) return;
     const newComment: Comment = {
       id: Math.random().toString(36).substr(2, 9),
       userId: user.id,
       userName: user.name,
       userAvatar: user.avatar,
       text,
       createdAt: new Date(),
       isOfficial: user.role === UserRole.ADMIN || user.role === UserRole.EXECUTIVE // Allow executive to be official
     };

     setIssues(prev => prev.map(issue => {
       if (issue.id !== issueId) return issue;
       return { ...issue, comments: [...issue.comments, newComment] };
     }));

     if (selectedIssueDetails && selectedIssueDetails.id === issueId) {
        setSelectedIssueDetails(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
     }
  };

  const handleCompleteMission = (missionId: string) => {
    if(!user) return;
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, completed: true } : m));
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      setUser(prev => prev ? ({ 
        ...prev, 
        points: prev.points + mission.points,
        recentActivity: [{
           id: Math.random().toString(),
           type: 'MISSION_COMPLETED',
           title: mission.title,
           date: new Date(),
           pointsEarned: mission.points
        }, ...prev.recentActivity]
      }) : null);
    }
  };

  const handlePollVote = (pollId: string, optionId: string) => {
    if (!activePoll || activePoll.id !== pollId || !user) return;

    setActivePoll(prev => {
      if(!prev) return null;
      return {
        ...prev,
        userHasVoted: true,
        totalVotes: prev.totalVotes + 1,
        options: prev.options.map(opt => 
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        )
      };
    });

    setUser(prev => prev ? ({ 
      ...prev, 
      points: prev.points + activePoll.points,
      recentActivity: [{
         id: Math.random().toString(),
         type: 'POLL_VOTED',
         title: 'Voto: Consulta Pública',
         date: new Date(),
         pointsEarned: activePoll.points
      }, ...prev.recentActivity]
    }) : null);
  };

  // HANDLER: Vote on Bill (Legislative)
  const handleBillVote = (billId: string, vote: 'FAVOR' | 'AGAINST') => {
    setBills(prev => prev.map(b => {
      if (b.id !== billId) return b;
      return {
        ...b,
        poll: {
          ...b.poll,
          votesFavor: vote === 'FAVOR' ? b.poll.votesFavor + 1 : b.poll.votesFavor,
          votesAgainst: vote === 'AGAINST' ? b.poll.votesAgainst + 1 : b.poll.votesAgainst,
          userVote: vote
        }
      };
    }));

    // Reward for civic engagement
    if(user) {
      setUser(prev => prev ? ({ 
        ...prev, 
        points: prev.points + 10,
        recentActivity: [{
           id: Math.random().toString(),
           type: 'BILL_VOTED',
           title: 'Voto: Projeto de Lei',
           date: new Date(),
           pointsEarned: 10
        }, ...prev.recentActivity]
      }) : null);
    }
  };

  // HANDLER: Update Bill Data (Admin/Simulated)
  const handleUpdateBill = (updatedBill: LegislativeBill) => {
    setBills(prev => prev.map(b => b.id === updatedBill.id ? updatedBill : b));
  };

  // HANDLER: Update Councilor Data (Admin/Simulated)
  const handleUpdateCouncilor = (updatedCouncilor: Councilor) => {
    setCouncilors(prev => prev.map(c => c.id === updatedCouncilor.id ? updatedCouncilor : c));
  };
  
  // HANDLER: Add New Councilor
  const handleAddCouncilor = (newCouncilor: Councilor) => {
    const councilorWithId = { 
       ...newCouncilor, 
       id: Math.random().toString(36).substr(2, 9) 
    };
    setCouncilors(prev => [...prev, councilorWithId]);
  };

  // --- RENDER LOGIC ---

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // If user is logged in but location not set (Only for Citizens)
  if (!selectedLocation && user.role === UserRole.CITIZEN) { 
     return <LocationSelector onSelect={(state, city) => setSelectedLocation({state, city})} />;
  }
  
  // Auto-set location for Gov users if null
  if (!selectedLocation && (user.role === UserRole.EXECUTIVE || user.role === UserRole.LEGISLATIVE || user.role === UserRole.ADMIN)) {
     setSelectedLocation({state: 'SP', city: 'São Paulo (Gestão)'});
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 z-40 shrink-0 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] relative">
        <div className="flex items-center gap-2.5 shrink-0">
           {/* LOGO IMAGE INCREASED SIZE h-14 */}
           <img src="https://i.imgur.com/zayXZvH.png" alt="Engaja Cidadão" className="h-14 w-auto object-contain" />
           
           <div className="flex flex-col border-l border-slate-200 pl-3 ml-1 h-8 justify-center">
              <div className="flex items-center gap-1">
                 <MapPin className="w-2.5 h-2.5 text-slate-400" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {selectedLocation?.city} {selectedLocation?.state ? `- ${selectedLocation.state}` : ''}
                 </span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
           {/* Role Badge */}
           <div className={`text-[9px] px-2 py-1.5 rounded-lg font-bold border transition-colors whitespace-nowrap flex items-center gap-1 
             ${user.role === UserRole.EXECUTIVE ? 'bg-blue-100 text-blue-700 border-blue-200' : 
               user.role === UserRole.LEGISLATIVE ? 'bg-purple-100 text-purple-700 border-purple-200' :
               user.role === UserRole.ADMIN ? 'bg-red-100 text-red-700 border-red-200' :
               'bg-slate-50 text-slate-400 border-slate-200'}`}
           >
             {user.role === UserRole.EXECUTIVE && <Building2 className="w-3 h-3" />}
             {user.role === UserRole.LEGISLATIVE && <Landmark className="w-3 h-3" />}
             {user.role === UserRole.ADMIN && <Shield className="w-3 h-3" />}
             
             <span className="hidden sm:inline">
               {user.role === UserRole.EXECUTIVE ? 'EXECUTIVO' : 
                user.role === UserRole.LEGISLATIVE ? 'LEGISLATIVO' : 
                user.role === UserRole.ADMIN ? 'ADMIN' : 'CIDADÃO'}
             </span>
           </div>
           
           <div className="h-6 w-px bg-slate-200 mx-0.5 sm:mx-0"></div>

           <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={handleNotificationsToggle} className="relative p-2 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  )}
              </button>

              <button 
                onClick={() => setActiveView(View.PROFILE)} 
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 pl-1 pr-3 py-1 rounded-full transition-all group"
              >
                  {user.role === UserRole.CITIZEN ? (
                    <img src={user.avatar} className="w-8 h-8 rounded-full border border-white shadow-sm group-hover:scale-105 transition-transform" alt="Profile" />
                  ) : (
                    <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold border border-white shadow-sm">
                      {user.role === UserRole.EXECUTIVE ? 'E' : user.role === UserRole.LEGISLATIVE ? 'L' : 'A'}
                    </div>
                  )}
                  
                  <div className="flex flex-col items-start hidden xs:flex">
                      <span className="text-xs font-bold text-slate-700 leading-none group-hover:text-emerald-700 transition-colors">
                        {user.name.split(' ')[0]}
                      </span>
                      {user.role === UserRole.CITIZEN && (
                        <span className="text-[9px] text-amber-500 font-bold leading-none mt-0.5">
                          {user.points} pts
                        </span>
                      )}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500 hidden xs:block" />
              </button>
           </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
           <div className="absolute top-16 right-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-up z-50">
              <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-sm text-slate-700">Notificações</h3>
                 <button onClick={() => setNotifications([])} className="text-[10px] text-slate-400 hover:text-red-500">Limpar tudo</button>
              </div>
              <div className="max-h-80 overflow-y-auto p-4">
                 {notifications.length === 0 && <div className="text-center text-slate-400 text-xs">Sem notificações.</div>}
              </div>
           </div>
        )}
      </div>

      {/* Info Bar (Only for Citizen on Map) */}
      {user.role === UserRole.CITIZEN && activeView === View.MAP && (
         <div className="flex w-full h-12 bg-slate-50 border-b border-slate-200 z-30 shrink-0 justify-end">
            {emergencyAlert && (
               <EmergencyBanner 
                  alert={emergencyAlert} 
                  onDismiss={() => setEmergencyAlert(null)} 
               />
            )}
            {activePoll && (
               <ActivePoll 
                  poll={activePoll} 
                  onVote={handlePollVote} 
               />
            )}
         </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        
        {/* EXECUTIVE / ADMIN VIEW */}
        {(user.role === UserRole.EXECUTIVE || user.role === UserRole.ADMIN) && activeView === View.ADMIN && (
          <div className="h-full overflow-y-auto">
             <AdminDashboard issues={issues} />
          </div>
        )}

        {/* LEGISLATIVE VIEW */}
        {(activeView === View.LEGISLATIVE) && (
          <div className="h-full overflow-hidden">
            <LegislativeView 
              bills={bills} 
              councilors={councilors} 
              userRole={user.role} // Pass role to determine edit permissions
              onVoteBill={handleBillVote}
              onUpdateBill={handleUpdateBill}
              onUpdateCouncilor={handleUpdateCouncilor}
              onAddCouncilor={handleAddCouncilor}
            />
          </div>
        )}

        {/* CITIZEN VIEWS (But Executive/Legislative can navigate to them too, read-only mostly) */}
        
        {activeView === View.MAP && (
          <>
            <MapView 
              issues={issues.filter(i => i.moderationStatus === 'APPROVED')}
              onAddIssue={() => { setEditingIssue(null); setShowIssueForm(true); }}
              onUpdateLocation={(id, lat, lng) => handleUpdateIssue(id, { location: { lat, lng } })}
              onDeleteIssue={handleDeleteIssue}
              onEditIssue={handleEditRequest}
              onViewDetails={handleViewDetails}
              currentCity={selectedLocation?.city || 'Cidade'}
            />
            <IssueListSidebar 
              issues={issues.filter(i => i.moderationStatus === 'APPROVED')} 
              onSelectIssue={handleViewDetails}
              onFocusLocation={(lat, lng) => {}}
            />
          </>
        )}
        
        {activeView === View.MISSIONS && (
          <div className="h-full overflow-y-auto">
            <MissionsView missions={missions} user={user} onCompleteMission={handleCompleteMission} />
          </div>
        )}

        {activeView === View.REWARDS && (
          <div className="h-full overflow-y-auto">
            <RewardsView rewards={REWARDS} user={user} />
          </div>
        )}

        {activeView === View.LEADERBOARD && (
          <div className="h-full overflow-hidden">
            <LeaderboardView currentUser={user} />
          </div>
        )}

        {activeView === View.MAYOR && (
          <div className="h-full overflow-hidden">
            <MayorChannel user={user} />
          </div>
        )}

        {activeView === View.PROFILE && (
          <ProfileView 
             user={user} 
             onLogout={handleLogout}
             onChangeCity={() => setSelectedLocation(null)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation (Glassmorphism Dock) */}
      <div className="absolute bottom-6 left-3 right-3 z-40 flex justify-center pointer-events-none">
        <nav className="h-16 w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-900/10 rounded-2xl flex items-center justify-between px-2 relative pointer-events-auto">
          
          {/* 1. MAP (Everyone) */}
          <button 
            onClick={() => setActiveView(View.MAP)}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 group
              ${activeView === View.MAP ? 'bg-emerald-100' : 'hover:bg-slate-50'}`}
          >
            <Map className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeView === View.MAP ? 'text-emerald-700 fill-emerald-700/20' : 'text-slate-400'}`} strokeWidth={2.5} />
            <span className={`text-[9px] font-bold mt-0.5 ${activeView === View.MAP ? 'text-emerald-700' : 'text-slate-400'}`}>Mapa</span>
          </button>

          {/* 2. POWERS GROUP */}
          <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
             <button 
               onClick={() => setActiveView(View.LEGISLATIVE)}
               className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all ${activeView === View.LEGISLATIVE ? 'bg-white shadow-sm ring-1 ring-indigo-100' : 'hover:bg-slate-200'}`}
             >
               <Landmark className={`w-4 h-4 ${activeView === View.LEGISLATIVE ? 'text-indigo-600 fill-indigo-100' : 'text-slate-400'}`} />
             </button>

             {/* Mayor Channel or Admin Dashboard based on Role */}
             <button 
               onClick={() => {
                 if (user.role === UserRole.EXECUTIVE) {
                   setActiveView(View.ADMIN);
                 } else {
                   setActiveView(View.MAYOR);
                 }
               }}
               className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all 
                 ${(activeView === View.MAYOR || activeView === View.ADMIN) ? 'bg-white shadow-sm ring-1 ring-blue-100' : 'hover:bg-slate-200'}`}
             >
               {user.role === UserRole.EXECUTIVE ? (
                 <Shield className={`w-4 h-4 ${(activeView === View.ADMIN) ? 'text-blue-600 fill-blue-100' : 'text-slate-400'}`} />
               ) : (
                 <Building2 className={`w-4 h-4 ${(activeView === View.MAYOR) ? 'text-blue-600 fill-blue-100' : 'text-slate-400'}`} />
               )}
             </button>
          </div>

          {/* 3. CENTER CTA (Report - Only Citizens) */}
          {user.role === UserRole.CITIZEN ? (
             <div className="relative -top-6 mx-1">
               <button 
                 onClick={() => { setEditingIssue(null); setShowIssueForm(true); }}
                 className="flex flex-col items-center justify-center group"
               >
                 <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full shadow-lg shadow-slate-900/30 flex items-center justify-center border-[3px] border-white group-active:scale-95 transition-transform">
                    <PlusCircle className="w-6 h-6 text-emerald-400" />
                 </div>
                 <span className="text-[9px] font-bold mt-1 text-slate-500 bg-white/80 px-1.5 rounded-md backdrop-blur-sm">Reportar</span>
               </button>
             </div>
          ) : (
            // Space filler for Gov roles who don't report via bottom bar
            <div className="w-10"></div>
          )}

          {/* 4. MISSIONS (Everyone sees, but mainly for Citizens) */}
          <button 
            onClick={() => setActiveView(View.MISSIONS)}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 group
              ${activeView === View.MISSIONS ? 'bg-amber-100' : 'hover:bg-slate-50'}`}
          >
            <Target className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeView === View.MISSIONS ? 'text-amber-700 fill-amber-700/20' : 'text-slate-400'}`} strokeWidth={2.5} />
            <span className={`text-[9px] font-bold mt-0.5 ${activeView === View.MISSIONS ? 'text-amber-700' : 'text-slate-400'}`}>Missões</span>
          </button>

          {/* 5. PROFILE */}
          <button 
            onClick={() => setActiveView(View.PROFILE)}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-300 group
              ${activeView === View.PROFILE ? 'bg-blue-100' : 'hover:bg-slate-50'}`}
          >
            <UserCircle className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeView === View.PROFILE ? 'text-blue-700 fill-blue-700/20' : 'text-slate-400'}`} strokeWidth={2.5} />
            <span className={`text-[9px] font-bold mt-0.5 ${activeView === View.PROFILE ? 'text-blue-700' : 'text-slate-400'}`}>Perfil</span>
          </button>

        </nav>
      </div>

      {/* Modals & Panels */}
      {showIssueForm && (
        <IssueForm 
          initialData={editingIssue}
          onCancel={() => { setShowIssueForm(false); setEditingIssue(null); }} 
          onSubmit={handleAddIssue}
        />
      )}

      {selectedIssueDetails && (
        <IssueDetails 
          issue={selectedIssueDetails}
          currentUser={user}
          onClose={() => setSelectedIssueDetails(null)}
          onSupport={handleSupportIssue}
          onComment={handleAddComment}
          onFlag={handleFlagIssue}
        />
      )}
    </div>
  );
};

export default App;
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
