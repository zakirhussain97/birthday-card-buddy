
import { GoogleGenAI } from "@google/genai";
import { BirthdayData } from "../types";

export const generateBirthdayMessage = async (data: BirthdayData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Write a funny, witty, and slightly roasty (but friendly) birthday card message for the following person:
    Name: ${data.name}
    Age: ${data.age}
    Hobby: ${data.hobby}
    
    The message should:
    1. Reference their age in a humorous way (e.g., being "classic" or "antique").
    2. Incorporate their hobby into a pun or a funny observation.
    3. Be about 2-4 sentences long.
    4. Feel personalized and warm, yet genuinely funny.
    
    Avoid generic "Happy Birthday" messages. Make it unique!
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.9,
        topP: 0.95,
      }
    });

    if (!response.text) {
      throw new Error("Failed to generate a message. Please try again.");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
