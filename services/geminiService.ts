import { GoogleGenAI, Type } from "@google/genai";
import type { ShoeSizeResult } from '../types';

const systemInstruction = `You are an expert podiatrist and shoe fitting specialist. Your task is to analyze an image of a human foot placed next to a standard credit card for scale and determine the foot's length and corresponding shoe size. A standard credit card is 85.6mm long.
Analyze the image to determine the foot length in millimeters by comparing it to the credit card.
Then, convert the length to inches (1 inch = 25.4mm).
Finally, using standard Brannock device conversions, calculate the US Men, US Women, EU, and UK shoe sizes.
You MUST return the result ONLY as a valid JSON object. Do not include any other text, explanations, or markdown formatting.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    length_mm: { type: Type.NUMBER, description: "Foot length in millimeters." },
    length_in: { type: Type.NUMBER, description: "Foot length in inches." },
    size_us_men: { type: Type.STRING, description: "US Men's shoe size." },
    size_us_women: { type: Type.STRING, description: "US Women's shoe size." },
    size_eu: { type: Type.STRING, description: "European shoe size." },
    size_uk: { type: Type.STRING, description: "United Kingdom shoe size." },
  },
  required: ["length_mm", "length_in", "size_us_men", "size_us_women", "size_eu", "size_uk"]
};


export const analyzeFootImage = async (imageBase64: string, apiKey: string): Promise<ShoeSizeResult> => {
  if (!apiKey) {
    throw new Error("API key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const prompt = "Please analyze the provided image of a foot next to a credit card and return the measurements and shoe sizes in the specified JSON format.";

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: imageBase64,
                    },
                },
                { text: prompt },
            ]
        },
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    const textResponse = response.text.trim();
    
    if (!textResponse) {
      throw new Error("Received an empty response from the AI model.");
    }

    // The response should be valid JSON because of responseSchema
    const result: ShoeSizeResult = JSON.parse(textResponse);

    // Basic validation
    if (typeof result.length_mm !== 'number' || typeof result.size_us_men !== 'string') {
        throw new Error("AI response is not in the expected format.");
    }

    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the AI's response. The format was invalid.");
    }
    throw new Error("Could not get a valid measurement from the AI. Please try again with a clearer picture.");
  }
};
