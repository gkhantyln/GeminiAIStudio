import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64Data: string) => {
  const match = base64Data.match(/^data:(image\/(?:jpeg|png|webp));base64,(.*)$/);
  if (!match) {
    throw new Error('Invalid base64 image data string.');
  }
  const mimeType = match[1];
  const data = match[2];
  
  return {
    inlineData: {
      mimeType,
      data,
    },
  };
};

export const swapFaces = async (sourceImageBase64: string, targetImageBase64: string): Promise<string | null> => {
  try {
    const sourcePart = fileToGenerativePart(sourceImageBase64);
    const targetPart = fileToGenerativePart(targetImageBase64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          sourcePart,
          targetPart,
          {
            text: `**Critical Task: Photorealistic Face Swap**

            **Source Image:** The first image.
            **Target Face:** The face from the second image.
            
            **Objective:** Perform a flawless, high-resolution face swap. Extract the face from the Target Face image and seamlessly integrate it onto the person in the Source Image.
            
            **Mandatory Quality Requirements:**
            1.  **Color & Tone Harmony:** The skin tone of the swapped face MUST be perfectly color-corrected to match the ambient lighting, color grading, and overall atmosphere of the Source Image. Eliminate any color discrepancies for a natural look.
            2.  **Sharpness & Clarity:** The final output must be sharp, clear, and high-resolution. The swapped facial features must match the focus and depth of field of the source photo. Do not produce a blurry or low-quality result.
            3.  **Seamless Lighting Integration:** Preserve the original lighting, shadows, and highlights from the Source Image. Realistically apply these lighting conditions to the contours of the newly swapped face to ensure it doesn't look flat or artificial.
            4.  **Perfect Integration:** The integration must be undetectable. Pay meticulous attention to the edges, blending them naturally with the source's hairline, jawline, and neck.
            
            **Constraint:** Do NOT alter the background, clothing, hair, or body of the person in the Source Image. The final image must look like a single, unaltered, professional photograph.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    return null;

  } catch (error) {
    console.error("Error swapping faces:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};