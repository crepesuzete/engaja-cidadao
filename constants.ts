import { Issue, IssueCategory, IssueStatus, Mission, Reward, User, UserRole, Notification, EmergencyAlert, Poll, Councilor, LegislativeBill } from './types';

// Mock Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Solicitação Atendida!',
    message: 'A prefeitura respondeu ao seu chamado sobre o buraco na via.',
    read: false,
    date: new Date(),
    type: 'SUCCESS'
  },
  {
    id: 'n2',
    title: 'Nova Missão Disponível',
    message: 'Participe do mutirão de limpeza neste sábado.',
    read: false,
    date: new Date(Date.now() - 86400000),
    type: 'INFO'
  }
];

// NEW: Active Emergency Alert (Mock)
export const MOCK_ALERT: EmergencyAlert = {
  id: 'alert1',
  level: 'WARNING',
  title: 'Alerta de Chuvas',
  message: 'Risco de alagamentos. Evite áreas baixas.',
  contactInfo: 'Ligue 199',
  active: true,
  createdAt: new Date()
};

// NEW: Active Poll (Mock)
export const MOCK_POLL: Poll = {
  id: 'poll1',
  question: 'Qual deve ser a prioridade da reforma da Praça Central?',
  points: 20,
  active: true,
  totalVotes: 1240,
  userHasVoted: false,
  options: [
    { id: 'opt1', text: 'Mais Iluminação LED', votes: 450 },
    { id: 'opt2', text: 'Playground Infantil', votes: 320 },
    { id: 'opt3', text: 'Área para Pets (Parcão)', votes: 470 }
  ]
};

// --- LEGISLATIVE MOCKS ---
export const MOCK_COUNCILORS: Councilor[] = [
  {
    id: 'c1',
    name: 'Roberto Viana',
    party: 'PV',
    avatar: 'https://ui-avatars.com/api/?name=Roberto+Viana&background=16a34a&color=fff',
    bio: 'Defensor das causas ambientais e mobilidade urbana sustentável.',
    email: 'roberto@camara.gov.br'
  },
  {
    id: 'c2',
    name: 'Dra. Cláudia',
    party: 'PSDB',
    avatar: 'https://ui-avatars.com/api/?name=Claudia+Silva&background=0284c7&color=fff',
    bio: 'Médica, focada na melhoria do atendimento básico de saúde.',
    email: 'claudia@camara.gov.br'
  },
  {
    id: 'c3',
    name: 'Jorge do Bairro',
    party: 'MDB',
    avatar: 'https://ui-avatars.com/api/?name=Jorge+Bairro&background=ea580c&color=fff',
    bio: 'Líder comunitário com 20 anos de atuação na Zona Norte.',
    email: 'jorge@camara.gov.br'
  }
];

export const MOCK_BILLS: LegislativeBill[] = [
  {
    id: 'bill1',
    code: 'PL 42/2024',
    title: 'Programa Escola Aberta',
    description: 'Institui a abertura das quadras escolares para a comunidade aos finais de semana.',
    author: 'Ver. Roberto Viana',
    status: 'EM_VOTACAO',
    poll: { votesFavor: 1250, votesAgainst: 45 }
  },
  {
    id: 'bill2',
    code: 'PL 15/2024',
    title: 'Proibição de Fogos com Estampido',
    description: 'Proíbe o manuseio e soltura de fogos de artifício que causem poluição sonora, visando o bem-estar animal. Aprovado na câmara, aguardando sanção do prefeito.',
    author: 'Ver. Dra. Cláudia',
    status: 'AGUARDANDO_SANCAO',
    poll: { votesFavor: 3400, votesAgainst: 890 }
  },
  {
    id: 'bill3',
    code: 'PL 89/2024',
    title: 'Isenção de IPTU para Áreas Verdes',
    description: 'Concede desconto no imposto para residências que mantenham mais de 30% de área permeável.',
    author: 'Executivo Municipal',
    status: 'APROVADO',
    poll: { votesFavor: 900, votesAgainst: 120 }
  },
  {
    id: 'bill4',
    code: 'PL 102/2024',
    title: 'Aumento de Gabinete',
    description: 'Proposta para aumento da verba de gabinete dos vereadores.',
    author: 'Mesa Diretora',
    status: 'VETADO',
    poll: { votesFavor: 12, votesAgainst: 4500 }
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Ana Souza',
  points: 1250,
  level: 5,
  role: UserRole.CITIZEN,
  avatar: 'https://ui-avatars.com/api/?name=Ana+Souza&background=059669&color=fff',
  badges: [
    {
      id: 'b1',
      name: 'Vigilante Urbano',
      description: 'Reportou 5 problemas de infraestrutura.',
      icon: '🚧',
      unlocked: true,
      unlockedAt: new Date('2023-09-15')
    },
    {
      id: 'b2',
      name: 'Voluntário de Ouro',
      description: 'Completou 3 missões comunitárias.',
      icon: '🤝',
      unlocked: true,
      unlockedAt: new Date('2023-10-01')
    },
    {
      id: 'b3',
      name: 'Influenciador Cívico',
      description: 'Teve 10 apoios em suas publicações.',
      icon: '📢',
      unlocked: false
    },
    {
      id: 'b4',
      name: 'Prefeito do Bairro',
      description: 'Alcançou o nível 10.',
      icon: '👑',
      unlocked: false
    }
  ],
  recentActivity: [
    {
      id: 'a1',
      type: 'MISSION_COMPLETED',
      title: 'Completou "Visite o Museu"',
      date: new Date('2023-10-24'),
      pointsEarned: 100
    },
    {
      id: 'a2',
      type: 'ISSUE_CREATED',
      title: 'Reportou "Falta de Luz"',
      date: new Date('2023-10-22'),
      pointsEarned: 50
    },
    {
      id: 'a3',
      type: 'REWARD_REDEEMED',
      title: 'Resgatou Desconto Padaria',
      date: new Date('2023-10-20'),
      pointsEarned: -500
    }
  ]
};

// FULLY POPULATED ISSUES TO SHOW ALL 8 CATEGORIES
export const INITIAL_ISSUES: Issue[] = [
  // 1. INFRAESTRUTURA
  {
    id: 'i1',
    title: 'Buraco na Avenida Principal',
    description: 'Cratera aberta na faixa da direita causando risco de acidentes. Já vi dois carros furarem o pneu aqui.',
    category: IssueCategory.INFRAESTRUTURA,
    status: IssueStatus.ANALISE,
    votes: 45,
    location: { x: 30, y: 40, label: 'Centro' },
    authorId: 'u2',
    authorName: 'João da Silva',
    authorAvatar: 'https://ui-avatars.com/api/?name=Joao+Silva&background=random',
    isAnonymous: false,
    createdAt: new Date('2023-10-25'),
    attachments: [
        { id: 'a1', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60', name: 'Buraco.jpg' }
    ],
    supportedBy: ['u1', 'u5', 'u6'],
    flaggedBy: [],
    moderationStatus: 'APPROVED',
    comments: [
      {
        id: 'c1',
        userId: 'u5',
        userName: 'Carlos Silva',
        userAvatar: 'https://ui-avatars.com/api/?name=Carlos+Silva&background=random',
        text: 'Realmente muito perigoso, passo aqui todo dia.',
        createdAt: new Date('2023-10-25T14:00:00')
      },
      {
        id: 'c2',
        userId: 'admin',
        userName: 'Prefeitura Municipal',
        userAvatar: '',
        text: 'Olá! A equipe de obras já foi notificada e fará a vistoria em 24h.',
        createdAt: new Date('2023-10-26T09:00:00'),
        isOfficial: true
      }
    ]
  },
  // 2. SEGURANÇA
  {
    id: 'i2',
    title: 'Falta de Iluminação na Praça',
    description: 'Postes queimados há 2 semanas, local muito escuro. Inseguro para transitar a noite.',
    category: IssueCategory.SEGURANCA,
    status: IssueStatus.REGISTRADA,
    votes: 12,
    location: { x: 60, y: 70, label: 'Jd. Flores' },
    authorId: 'u3',
    authorName: 'Maria Helena',
    authorAvatar: 'https://ui-avatars.com/api/?name=Maria+Helena&background=random',
    isAnonymous: true, // Example of anonymous report
    createdAt: new Date('2023-10-26'),
    attachments: [
       { id: 'a2', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1555677284-6a6f971638e0?w=500&auto=format&fit=crop&q=60', name: 'Escuro.jpg' }
    ],
    supportedBy: [],
    flaggedBy: [],
    moderationStatus: 'APPROVED',
    comments: []
  },
  // 3. MEIO AMBIENTE
  {
    id: 'i3',
    title: 'Lixo acumulado na calçada',
    description: 'Coleta não passou na terça-feira e o lixo está espalhado.',
    category: IssueCategory.MEIO_AMBIENTE,
    status: IssueStatus.RESOLVIDA,
    votes: 89,
    location: { x: 20, y: 20, label: 'Vila Nova' },
    authorId: 'u4',
    authorName: 'Pedro Santos',
    authorAvatar: 'https://ui-avatars.com/api/?name=Pedro+Santos&background=random',
    isAnonymous: false,
    createdAt: new Date('2023-10-20'),
    attachments: [
        { id: 'a3', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=60', name: 'Lixo.jpg' }
    ],
    supportedBy: ['u2'],
    flaggedBy: [],
    moderationStatus: 'APPROVED',
    comments: [
       {
        id: 'c3',
        userId: 'u4',
        userName: 'Maria Oliveira',
        userAvatar: 'https://ui-avatars.com/api/?name=Maria+Oliveira&background=random',
        text: 'Resolvido hoje cedo! Obrigado.',
        createdAt: new Date('2023-10-22T10:00:00')
      }
    ]
  },
  // 4. SAÚDE
  {
    id: 'i4',
    title: 'Posto de Saúde sem Médico',
    description: 'A UBS do bairro está sem pediatra há 3 semanas. Muitas crianças sem atendimento.',
    category: IssueCategory.SAUDE,
    status: IssueStatus.REGISTRADA,
    votes: 112,
    location: { x: 55, y: 30, label: 'Centro' },
    authorId: 'u6',
    authorName: 'Ana Clara',
    authorAvatar: 'https://ui-avatars.com/api/?name=Ana+Clara&background=random',
    isAnonymous: false,
    createdAt: new Date('2023-10-27'),
    attachments: [],
    supportedBy: ['u1', 'u2', 'u3'],
    flaggedBy: [],
    moderationStatus: 'APPROVED',
    comments: []
  },
  // 5. EDUCAÇÃO
  {
    id: 'i5',
    title: 'Goteira na Sala de Aula',
    description: 'A escola municipal está com infiltrações graves no teto da sala do 3º ano.',
    category: IssueCategory.EDUCACAO,
    status: IssueStatus.EXECUCAO,
    votes: 75,
    location: { x: 40, y: 60, label: 'Jd. Escolar' },
    authorId: 'u7',
    authorName: 'Prof. Ricardo',
    authorAvatar: 'https://ui-avatars.com/api/?name=Ricardo&background=random',
    isAnonymous: false,
    createdAt: new Date('2023-10-24'),
    attachments: [
        { id: 'a4', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1584697966970-cd1c92a926f6?w=500&auto=format&fit=crop&q=60', name: 'Infiltracao.jpg' }
    ],
    supportedBy: ['u4'],
    flaggedBy: [],
    moderationStatus: 'APPROVED',
    comments: [
      {
        id: 'c5',
        userId: 'admin',
        userName: 'Secretaria de Educação',
        userAvatar: '',
        text: 'A equipe de manutenção já está no local realizando os reparos no telhado.',
        createdAt: new Date('2023-10-28T08:00:00'),
        isOfficial: true
      }
    ]
  },
  // 6. MOBILIDADE
  {
    id: 'i6',
    title: 'Ponto de Ônibus Quebrado',
    description: 'O abrigo do ponto de ônibus caiu após a tempestade, sem proteção contra chuva.',
    category: IssueCategory.MOBILIDADE,
    status: IssueStatus.REGISTRADA,
    votes: 34,
    location: { x: 25, y: 80, label: 'Zona Norte' },
    authorId: 'u8',
    authorName: 'Marcos Souza',
    authorAvatar: 'https://ui-avatars.com/api/?name=Marcos&background=random',
    isAnonymous: false,
    createdAt: new Date('2023-10-28'),
    attachments: [],
    supportedBy: [],
    flaggedBy: [],
    moderationStatus: 'APPROVED',
    comments: []
  },
  // 7. CULTURA
  {
    id: 'i7',
    title: 'Biblioteca Fechada no Fim de Semana',
    description: 'Gostaríamos que a biblioteca do parque abrisse aos domingos para leitura.',
    category: IssueCategory.CULTURA,
    status: IssueStatus.ANALISE,
    votes: 60,
    location: { x: 80, y: 20, label: 'Parque Central' },
    authorId: 'u1',
    authorName: 'Ana Souza',
    authorAvatar: 'https://ui-avatars.com/api/?name=Ana+Souza&background=059669&color=fff',
    isAnonymous: false,
    createdAt: new Date('2023-10-25'),
    attachments: [],
    supportedBy: ['u2', 'u3', 'u4'],
    flaggedBy: [],
    moderationStatus: 'APPROVED',
    comments: []
  },
  // 8. ASSISTÊNCIA SOCIAL
  {
    id: 'i8',
    title: 'Pessoas em Situação de Rua no Viaduto',
    description: 'Grupo de famílias precisando de acolhimento e cobertores no viaduto da entrada.',
    category: IssueCategory.ASSISTENCIA_SOCIAL,
    status: IssueStatus.REGISTRADA,
    votes: 98,
    location: { x: 10, y: 50, label: 'Entrada da Cidade' },
    authorId: 'u9',
    authorName: 'Juliana Paes',
    authorAvatar: 'https://ui-avatars.com/api/?name=Juliana&background=random',
    isAnonymous: true,
    createdAt: new Date('2023-10-29'),
    attachments: [],
    supportedBy: ['u1', 'u5'],
    flaggedBy: [],
    moderationStatus: 'APPROVED',
    comments: []
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Participe da Audiência Pública',
    description: 'Compareça à câmara municipal para debater o plano diretor.',
    points: 500,
    type: 'PUBLIC',
    completed: false,
    expiry: new Date('2023-11-01'),
  },
  {
    id: 'm2',
    title: 'Mutirão de Limpeza do Parque',
    description: 'Ajude a limpar o parque da cidade neste sábado.',
    points: 300,
    type: 'COMMUNITY',
    completed: false,
  },
  {
    id: 'm3',
    title: 'Visite o Museu Municipal',
    description: 'Conheça a nova exposição histórica.',
    points: 100,
    type: 'PUBLIC',
    completed: true,
  },
];

export const REWARDS: Reward[] = [
  {
    id: 'r1',
    title: '20% de Desconto na Padaria Central',
    cost: 500,
    partner: 'Padaria Central',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&q=80&w=300', // Bakery
  },
  {
    id: 'r2',
    title: 'Ingresso Grátis para o Teatro',
    cost: 1000,
    partner: 'Secretaria de Cultura',
    image: 'https://images.unsplash.com/photo-1507676184212-d03816a97f06?auto=format&fit=crop&q=80&w=300', // Theater
  },
  {
    id: 'r3',
    title: 'Vale Muda de Árvore Nativa',
    cost: 200,
    partner: 'Horto Florestal',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=300', // Tree
  }
];