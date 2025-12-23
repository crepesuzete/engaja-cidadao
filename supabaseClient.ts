import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---

// 1. URL DO SEU PROJETO (Já detectada do seu print)
const SUPABASE_URL = 'https://pixtdusltmbuvkgcigcd.supabase.co'; 

// 2. SUA CHAVE DE API (ANON KEY)
// Configurada em 22/12/2025
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpeHRkdXNsdG1idXZrZ2NpZ2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MzA4MTEsImV4cCI6MjA4MjAwNjgxMX0.drtb0Df7X2Pl_0kHC_a187dce0MCyQfD94SqglpEMi4'; 

// Verifica se a chave foi configurada corretamente (básica validação de tamanho)
export const isSupabaseConnected = SUPABASE_KEY.length > 20;

// Inicializa o cliente apenas se a chave estiver presente
export const supabase = isSupabaseConnected 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

/**
 * Função utilitária para fazer upload de arquivos.
 * Retorna null se falhar ou se o Supabase não estiver configurado.
 */
export const uploadAttachment = async (file: File, path: string) => {
  if (!supabase) {
    console.warn("Upload pulado: Modo Demo (sem Supabase).");
    return null;
  }

  try {
    const { data, error } = await supabase.storage
        .from('issues')
        .upload(path, file);

    if (error) throw error;
    
    // Pegar URL pública
    const { data: { publicUrl } } = supabase.storage
        .from('issues')
        .getPublicUrl(path);
        
    return publicUrl;
  } catch (error) {
    console.error("Erro no upload:", error);
    return null; // Falha graciosa para não travar o app
  }
};