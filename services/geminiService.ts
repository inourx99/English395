import { GoogleGenAI } from "@google/genai";
import { GradeLevel } from "../types";

// Initialize Gemini Client
// In a real app, ensure process.env.API_KEY is defined. 
// For this demo, we assume the environment is set up correctly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateProjectIdeas = async (grade: GradeLevel): Promise<string> => {
  if (!process.env.API_KEY) {
    return "الرجاء التأكد من إعداد مفتاح API الخاص بـ Gemini.";
  }

  const modelId = 'gemini-2.5-flash';
  const prompt = `
    اقترحي 3 أفكار مشاريع بسيطة وممتعة لمنهج اللغة الإنجليزية لطالبات الصف ${grade}.
    يجب أن تكون الأفكار تعليمية وسهلة التنفيذ.
    نسقي الإجابة كنقاط مختصرة باللغة العربية.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "لم أتمكن من توليد أفكار في الوقت الحالي.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.";
  }
};

export const generateEncouragement = async (studentName: string, points: number): Promise<string> => {
    if (!process.env.API_KEY) {
      return "أحسنتِ! واصلي التقدم.";
    }
  
    const modelId = 'gemini-2.5-flash';
    const prompt = `
      اكتب رسالة تشجيعية قصيرة جداً (سطر واحد) ومحفزة للطالبة "${studentName}"
      التي جمعت ${points} نقطة في مسابقة اللغة الإنجليزية.
      الهدف هو الوصول لـ 100 نقطة للفوز بآيباد.
      استخدمي إيموجي.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
      });
      return response.text || "أحسنتِ صنعاً! استمري.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "أحسنتِ صنعاً! استمري.";
    }
  };