import { GoogleGenAI, Type } from "@google/genai";
import { IssueCategory } from '../types';

// Initialize Gemini Client
// In a real production app, ensure this is handled securely via backend proxy if needed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface AnalysisResult {
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  constructiveFeedback: string;
  summary: string;
}

export const analyzeIssueReport = async (description: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing, returning mock analysis");
    return {
      category: IssueCategory.INFRAESTRUTURA,
      severity: 'MEDIUM',
      constructiveFeedback: "Descrição clara, obrigado por reportar.",
      summary: description
    };
  }

  try {
    const modelId = 'gemini-3-flash-preview';
    
    const prompt = `
      Analise o seguinte relato de um cidadão sobre um problema urbano: "${description}".
      
      Classifique-o em uma destas categorias: Infraestrutura, Saúde, Educação, Meio Ambiente, Segurança, Mobilidade, Cultura.
      Estime a severidade (LOW, MEDIUM, HIGH, CRITICAL).
      Gere um resumo curto de 5 palavras.
      Gere um feedback construtivo curto (max 1 frase) agradecendo e validando a utilidade do reporte.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
            summary: { type: Type.STRING },
            constructiveFeedback: { type: Type.STRING }
          },
          required: ['category', 'severity', 'summary', 'constructiveFeedback']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback
    return {
      category: IssueCategory.INFRAESTRUTURA,
      severity: 'MEDIUM',
      constructiveFeedback: "Obrigado por sua contribuição.",
      summary: description.slice(0, 30) + '...'
    };
  }
};