
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
  audioUrl?: string; // NEW: Audio response
  videoUrl?: string; // NEW: Video response
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
  location: { 
    x?: number; 
    y?: number; 
    lat?: number; 
    lng?: number; 
    label: string 
  };
  imageUrl?: string; // Kept for backward compatibility
  attachments: Attachment[]; // NEW: Multi-media support
  
  authorId: string;
  authorName: string; 
  authorAvatar: string; 
  isAnonymous: boolean; 
  createdAt: Date;
  aiAnalysis?: string; 
  comments: Comment[]; 
  supportedBy: string[]; 
  
  flaggedBy: string[]; 
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

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; 
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
  badges: Badge[]; 
  recentActivity: ActivityLog[]; 
  department?: string; 
  party?: string; 
}

export interface EmergencyAlert {
  id: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  contactInfo?: string; 
  active: boolean;
  createdAt: Date;
}

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
  points: number; 
  userHasVoted?: boolean; 
}

export interface Councilor {
  id: string;
  name: string;
  party: string;
  avatar: string;
  bio: string;
  email: string;
}

export type BillStatus = 
  | 'EM_VOTACAO'        
  | 'AGUARDANDO_SANCAO' 
  | 'APROVADO'          
  | 'VETADO';           

export interface LegislativeBill {
  id: string;
  code: string; 
  title: string;
  description: string;
  author: string; 
  status: BillStatus;
  poll: {
    votesFavor: number;
    votesAgainst: number;
    userVote?: 'FAVOR' | 'AGAINST'; 
  };
}
