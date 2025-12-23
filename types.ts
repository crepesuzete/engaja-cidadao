
export enum UserRole {
  CITIZEN = 'CITIZEN',
  ADMIN = 'ADMIN', // Legacy/Superuser
  EXECUTIVE = 'EXECUTIVE', // Mayor, Secretaries
  LEGISLATIVE = 'LEGISLATIVE' // Councilors
}

export enum IssueCategory {
  INFRAESTRUTURA = 'Infraestrutura',
  SAUDE = 'Saúde',
  EDUCACAO = 'Educação',
  MEIO_AMBIENTE = 'Meio Ambiente',
  SEGURANCA = 'Segurança',
  MOBILIDADE = 'Mobilidade',
  CULTURA = 'Cultura',
  ASSISTENCIA_SOCIAL = 'Assistência Social'
}

export enum IssueStatus {
  REGISTRADA = 'Registrada',
  ANALISE = 'Em Análise',
  EXECUCAO = 'Em Execução',
  RESOLVIDA = 'Resolvida'
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: Date;
  isOfficial?: boolean; // If true, it's a city official responding
<<<<<<< HEAD
  audioUrl?: string; // NEW: Audio response
  videoUrl?: string; // NEW: Video response
=======
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
}

export interface Attachment {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO';
  url: string; // Base64 or URL
  thumbnail?: string;
  name?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  votes: number;
  // Updated location to optional lat/lng for real map support
  location: { 
    x?: number; 
    y?: number; 
    lat?: number; 
    lng?: number; 
    label: string 
  };
  // Replaced single imageUrl with attachments array
  imageUrl?: string; // Kept for backward compatibility
  attachments: Attachment[]; // NEW: Multi-media support
  
  authorId: string;
  authorName: string; // Added to store snapshot of name (or anonymous alias)
  authorAvatar: string; // Added to store snapshot of avatar (or anonymous icon)
  isAnonymous: boolean; // New Protection Flag
  createdAt: Date;
  aiAnalysis?: string; // Analysis from Gemini
  comments: Comment[]; // New: Community discussion
  supportedBy: string[]; // New: List of user IDs who supported/upvoted
  
  // Integrity & Moderation
  flaggedBy: string[]; // List of user IDs who reported this issue as fake/abusive
  moderationStatus: 'APPROVED' | 'UNDER_REVIEW' | 'REJECTED';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'PUBLIC' | 'COMMUNITY' | 'SPONSORED';
  completed: boolean;
  expiry?: Date;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  partner: string;
  image: string;
}

// New Interfaces for Gamification & Profile
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name or emoji
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface ActivityLog {
  id: string;
  type: 'ISSUE_CREATED' | 'MISSION_COMPLETED' | 'LEVEL_UP' | 'REWARD_REDEEMED' | 'POLL_VOTED' | 'BILL_VOTED';
  title: string;
  date: Date;
  pointsEarned: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  type: 'SUCCESS' | 'WARNING' | 'INFO';
}

export interface User {
  id: string;
  name: string;
  points: number;
  level: number;
  role: UserRole;
  avatar: string;
  badges: Badge[]; // Added badges
  recentActivity: ActivityLog[]; // Added history
  department?: string; // For Executive
  party?: string; // For Legislative
}

// NEW: Emergency Alerts
export interface EmergencyAlert {
  id: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  contactInfo?: string; // New field for emergency phone (e.g., "199")
  active: boolean;
  createdAt: Date;
}

// NEW: Public Polls
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  active: boolean;
  points: number; // Points for voting
  userHasVoted?: boolean; // Local state check
}

// --- LEGISLATIVE MODULE ---
export interface Councilor {
  id: string;
  name: string;
  party: string;
  avatar: string;
  bio: string;
  email: string;
}

// UPDATE: Expanded Status for Flow Visualization
export type BillStatus = 
  | 'EM_VOTACAO'        // Na Câmara
  | 'AGUARDANDO_SANCAO' // Enviado ao Executivo
  | 'APROVADO'          // Sancionado (Lei)
  | 'VETADO';           // Vetado pelo Prefeito

export interface LegislativeBill {
  id: string;
  code: string; // e.g., PL 123/2024
  title: string;
  description: string;
  author: string; // Councilor Name or Executive
  status: BillStatus;
  poll: {
    votesFavor: number;
    votesAgainst: number;
    userVote?: 'FAVOR' | 'AGAINST'; // Local state
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> c5dc7d1ae8e11d69d016bf79a6630b933d6a12bf
