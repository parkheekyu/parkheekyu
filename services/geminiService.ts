
import { GoogleGenAI, Type } from "@google/genai";
import { KnowledgeAnalysis, RecommendedIdea } from "../types";

// Fix: Updated analyzeKnowledgeProfit to initialize GoogleGenAI per-call and use direct process.env.API_KEY as per guidelines
export const analyzeKnowledgeProfit = async (skill: string): Promise<KnowledgeAnalysis | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `사용자의 기술/지식: "${skill}". 
      이 지식을 전자책으로 만들었을 때의 시장 가치를 분석해줘.
      다음 항목들을 포함해서 한국어 JSON으로 응답해줘:
      1. demandScore (시장 수요 점수 0-100)
      2. estimatedPrice (권장 판매가 예: 29,000원)
      3. competitionLevel (경쟁 정도: 매우 높음, 높음, 보통, 낮음)
      4. nicheStrategy (틈새 시장 공략 전략 1문장)
      5. suggestedTitle (가장 매력적인 전자책 제목)
      6. potentialEarnings (예상 월 수익 범위)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            demandScore: { type: Type.NUMBER },
            estimatedPrice: { type: Type.STRING },
            competitionLevel: { type: Type.STRING },
            nicheStrategy: { type: Type.STRING },
            suggestedTitle: { type: Type.STRING },
            potentialEarnings: { type: Type.STRING }
          },
          required: ["demandScore", "estimatedPrice", "competitionLevel", "nicheStrategy", "suggestedTitle", "potentialEarnings"]
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Knowledge Analysis failed:", error);
    return null;
  }
};

// Fix: Added getAIRecommendations export to fix the missing member error in AIRecommendation component
export const getAIRecommendations = async (topic: string): Promise<RecommendedIdea[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `사용자의 관심 분야: "${topic}". 
      이 분야에서 수익화가 가능한 전자책 아이디어 3가지를 제안해줘.
      각 아이디어는 제목, 상세 설명, 선정 이유, 권장 판매가를 포함해야 해.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              reason: { type: Type.STRING },
              price: { type: Type.STRING }
            },
            required: ["title", "description", "reason", "price"]
          }
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("AI Recommendation failed:", error);
    return [];
  }
};
