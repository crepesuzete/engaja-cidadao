import { supabase } from '../supabaseClient';
import { Issue, IssueCategory, IssueStatus } from '../types';

// Se o Supabase estiver configurado, usamos ele. Se não, usamos LocalStorage (Modo Demo)
const isLive = !!supabase;

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

    // Mapear do formato Banco de Dados (snake_case) para o App (camelCase)
    return data.map((row: any) => ({
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
    }));
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
  }
};