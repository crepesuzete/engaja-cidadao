import React, { useState, useEffect } from 'react';
import { 
  MOCK_USER, 
  INITIAL_ISSUES, 
  INITIAL_MISSIONS, 
  REWARDS,
  MOCK_NOTIFICATIONS,
  MOCK_ALERT,
  MOCK_POLL,
  MOCK_COUNCILORS,
  MOCK_BILLS
} from './constants';
import { 
  User, 
  Issue, 
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
    };
    fetchIssues();
  }, []);

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
  };

  const handleLogout = () => {
    setUser(null);
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
      comments: [],
      supportedBy: [],
      flaggedBy: [],
      moderationStatus: 'APPROVED'
    };

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
