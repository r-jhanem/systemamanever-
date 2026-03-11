import { GoogleGenAI } from "@google/genai";

// This service is prepared for scaling the app functionalities
// For now, simple calls are handled in the component for demonstration of the specific UI request.

const apiKey = process.env.API_KEY || '';

export const getAIClient = () => {
  if (!apiKey) {
    console.warn("API Key is missing for Gemini Service");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateHealthAdvice = async (query: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: You are a helpful medical AI assistant for the 'Ever' health app. 
      User Query: ${query}
      Instruction: Provide a safe, general medical informational response in Arabic. Include a disclaimer to see a doctor.`,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
