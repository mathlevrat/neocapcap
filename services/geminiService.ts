import { GoogleGenAI } from "@google/genai";

// IMPORTANT: Pour le déploiement sur Netlify, `process.env.API_KEY` n'est pas disponible côté client.
// Remplacez la valeur ci-dessous par votre propre clé API Gemini.
// AVERTISSEMENT: N'exposez jamais votre clé API dans une application de production publique.
const API_KEY = process.env.API_KEY || "VOTRE_API_KEY_GEMINI_ICI";

if (API_KEY === "VOTRE_API_KEY_GEMINI_ICI") {
  console.warn("Veuillez remplacer 'VOTRE_API_KEY_GEMINI_ICI' par votre véritable clé API Gemini dans le fichier services/geminiService.ts");
  // Optional: You could also throw an error to stop the app from running without a key
  // throw new Error("Clé API Gemini manquante. Veuillez configurer la clé dans services/geminiService.ts");
}

// Initialize the client with the API key
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates an image design for a cap based on user prompt using Gemini 2.5 Flash Image.
 */
export const generateCapDesign = async (userPrompt: string): Promise<string> => {
  try {
    // Enhance prompt to ensure it looks good on a cap (patch style/sticker style)
    const enhancedPrompt = `Design a high-quality, futuristic graphic vector art suitable for a baseball cap patch. 
    Style: Cyberpunk, sleek, vibrant colors against a solid black background for easy masking. 
    Subject: ${userPrompt}. 
    Ensure the design is centered and contained.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        // Using a square aspect ratio is best for cap front panels
        // Note: imageConfig might not be strictly typed in all versions yet, but this matches guidance
        // For 2.5 flash image, we rely on the model default or prompt instruction mostly, 
        // but we can pass config if supported.
      },
    });

    // Iterate through parts to find the image
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Construct the data URL
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("Aucune image générée dans la réponse.");

  } catch (error) {
    console.error("Erreur lors de la génération:", error);
    // Check for common API key errors
    if (error.message.includes('API key not valid')) {
       throw new Error("La clé API n'est pas valide. Veuillez vérifier votre clé dans services/geminiService.ts.");
    }
    throw error;
  }
};