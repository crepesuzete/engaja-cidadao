import { supabase } from '../supabaseClient';
import { Issue, IssueCategory, IssueStatus } from '../types';

// Se o Supabase estiver configurado, usamos ele. Se não, usamos LocalStorage (Modo Demo)
const isLive = !!supabase;

// Helper para converter linha do Banco de Dados para o objeto Issue do App
export const parseIssueFromDB = (row: any): Issue => ({
  id: row.id,
  title: row.title,
  description: row.description,
  category: row.category as IssueCategory,
  status: row.status as IssueStatus,
  votes: row.votes,
  location: row.location || { label: 'Local Desconhecido' },
  authorId: row.author_id,
  authorName: row.author_name || 'Anônimo',
  authorAvatar: row.author_avatar,
  isAnonymous: row.is_anonymous,
  createdAt: new Date(row.created_at),
  attachments: row.attachments || [],
  aiAnalysis: row.ai_analysis,
  comments: row.comments || [],
  supportedBy: row.supported_by || [],
  flaggedBy: row.flagged_by || [],
  moderationStatus: row.moderation_status || 'APPROVED'
});

export const dataService = {
  
  // --- BUSCAR ISSUES ---
  async getIssues(): Promise<Issue[]> {
    if (!isLive) {
       const stored = localStorage.getItem('ec_issues');
       return stored ? JSON.parse(stored) : [];
    }
    
    // Busca simples na tabela 'issues' criada pelo SQL
    const { data, error } = await supabase!
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar issues:", error);
      return [];
    }

    return data.map(parseIssueFromDB);
  },

  // --- CRIAR ISSUE ---
  async createIssue(issue: Issue) {
    if (!isLive) return;

    // Converter do App para o Banco
    const { error } = await supabase!.from('issues').insert({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      category: issue.category,
      status: issue.status,
      votes: issue.votes,
      location: issue.location, // Envia o objeto JSON inteiro
      author_id: issue.authorId,
      author_name: issue.authorName,
      author_avatar: issue.authorAvatar,
      is_anonymous: issue.isAnonymous,
      attachments: issue.attachments,
      ai_analysis: issue.aiAnalysis,
      comments: issue.comments,
      supported_by: issue.supportedBy,
      flagged_by: issue.flaggedBy,
      moderation_status: issue.moderationStatus,
      created_at: issue.createdAt.toISOString()
    });

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      throw error;
    }
  },

  // --- ATUALIZAR ISSUE ---
  async updateIssue(issue: Issue) {
    if (!isLive) return;

    // Atualiza campos dinâmicos
    const { error } = await supabase!
      .from('issues')
      .update({
        title: issue.title,
        description: issue.description,
        category: issue.category,
        status: issue.status,
        votes: issue.votes,
        location: issue.location,
        attachments: issue.attachments,
        comments: issue.comments,
        supported_by: issue.supportedBy,
        flagged_by: issue.flaggedBy,
        moderation_status: issue.moderationStatus
        // Não atualizamos author_id ou created_at para integridade
      })
      .eq('id', issue.id);

    if (error) {
      console.error("Erro ao atualizar issue:", error);
    }
  },

  // --- DELETAR ISSUE ---
  async deleteIssue(id: string) {
    if (!isLive) return;
    
    const { error } = await supabase!
      .from('issues')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erro ao deletar issue:", error);
    }
  },

  // --- REALTIME: ESCUTAR MUDANÇAS ---
  subscribeToIssues(onChange: (payload: any) => void) {
    if (!isLive) return null;

    return supabase!
      .channel('public:issues')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'issues' }, 
        (payload) => onChange(payload)
      )
      .subscribe();
  }
};