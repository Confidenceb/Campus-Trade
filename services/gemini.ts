
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
      You are a helpful assistant for a student marketplace app called "CampusTrade".
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

export const analyzeMessageSafety = async (message: string): Promise<{ isSafe: boolean; reason?: string }> => {
  try {
    const prompt = `
      You are a safety moderator for a student marketplace app. 
      Analyze the following message sent between a buyer and a seller.
      
      Message: "${message}"

      Your goal is to DETECT if the user is trying to:
      1. Take the transaction off-platform (e.g., "let's talk on WhatsApp", "call me", "DM me on Insta").
      2. Share personal contact details (phone numbers, email addresses, handles).
      3. Arrange a meeting without using the app's secure channels (though meeting on campus is allowed, trying to bypass the app flow is not).
      
      If the message contains any of these intents, return strict JSON: {"isSafe": false, "reason": "Reason for flagging"}
      If the message is safe, return strict JSON: {"isSafe": true}
      
      Do not include markdown formatting. Just the JSON string.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text?.trim();
    if (!text) return { isSafe: true };
    
    try {
      const result = JSON.parse(text);
      return result;
    } catch (e) {
      // Fallback if JSON parse fails, assume safe to avoid blocking legitimate users
      return { isSafe: true };
    }

  } catch (error) {
    console.error("Gemini Moderation Error:", error);
    // Fail open (allow message) if API fails, rely on regex in frontend
    return { isSafe: true };
  }
};
