import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateListingDescription = async (
  title: string,
  category: string,
  condition: string,
  type: string
): Promise<string> => {
  try {
    const prompt = `
      You are a helpful assistant for a student marketplace app called "CampusTrade Unilag".
      Write a short, catchy, and appealing description (max 50 words) for a product listing with the following details:
      - Item Name: ${title}
      - Category: ${category}
      - Condition: ${condition}
      - Listing Type: ${type} (Buy, Swap, or Rent)

      The tone should be friendly, student-to-student, and trustworthy.
      Do not include quotes around the output.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate description. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Check your connection or API key.";
  }
};
