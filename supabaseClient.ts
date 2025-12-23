import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---
// ID do Projeto e Chave Pública
const SUPABASE_URL = 'https://pixtdusltmbuvkgcigcd.supabase.co'; 

// ATENÇÃO: Esta é uma chave de exemplo (PLACEHOLDER).
// Para o upload funcionar, você deve colocar SUA chave do projeto Supabase aqui.
const SUPABASE_KEY = 'sb_publishable_n5KKRFHtQOXtt6z1NZoNoA_ff-fZdUZ';

// Verificação de segurança: 
// Só ativa o Supabase se a chave existir E NÃO FOR a chave de exemplo padrão.
// Isso previne que o app "trave" tentando conectar com credenciais inválidas.
const isConfigured = 
  SUPABASE_KEY && 
  SUPABASE_KEY.length > 10 && 
  SUPABASE_KEY !== 'sb_publishable_n5KKRFHtQOXtt6z1NZoNoA_ff-fZdUZ';

// Se não estiver configurado corretamente, exporta null.
// O App entrará automaticamente em "Modo Demo" (salvando imagens apenas no navegador).
export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

/**
 * Função utilitária para fazer upload de arquivos.
 * Retorna null se falhar ou se o Supabase não estiver configurado.
 */
export const uploadAttachment = async (file: File, path: string) => {
  if (!supabase) {
    console.warn("Upload pulado: Supabase não configurado ou chave inválida. Salvando localmente.");
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