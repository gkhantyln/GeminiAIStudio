import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const imageModel = 'gemini-2.5-flash-image-preview';

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

const callGemini = async (parts: any[]): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: imageModel,
      contents: { parts },
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
    console.error("Error communicating with Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}

export const swapFaces = async (sourceImageBase64: string, targetImageBase64: string): Promise<string | null> => {
  const sourcePart = fileToGenerativePart(sourceImageBase64);
  const targetPart = fileToGenerativePart(targetImageBase64);
  const textPart = {
    text: `**Critical Task: Photorealistic Face Swap**
    **Source Image:** The first image.
    **Target Face:** The face from the second image.
    **Objective:** Perform a flawless, high-resolution face swap. Extract the face from the Target Face image and seamlessly integrate it onto the person in the Source Image.
    **Mandatory Quality Requirements:**
    1.  **Color & Tone Harmony:** The skin tone of the swapped face MUST be perfectly color-corrected to match the ambient lighting, color grading, and overall atmosphere of the Source Image. Eliminate any color discrepancies for a natural look.
    2.  **Seamless Lighting Integration:** Preserve the original lighting, shadows, and highlights from the Source Image. Realistically apply these lighting conditions to the contours of the newly swapped face.
    3.  **Perfect Integration:** The integration must be undetectable. Pay meticulous attention to the edges, blending them naturally with the source's hairline, jawline, and neck.
    **Constraint:** Do NOT alter the background, clothing, hair, or body of the person in the Source Image. The final image must look like a single, unaltered, professional photograph.`,
  };
  return callGemini([sourcePart, targetPart, textPart]);
};

export const virtualTryOn = async (personImageBase64: string, itemImageBase64: string): Promise<string | null> => {
    const personPart = fileToGenerativePart(personImageBase64);
    const itemPart = fileToGenerativePart(itemImageBase64);
    const textPart = {
        text: `**Task: Virtual Item Try-On.**
        You will be given two images. Image 1 is a person (the model). Image 2 is an item (e.g., jewelry, glasses, a hat).
        Your goal is to realistically place the item from Image 2 onto the person in Image 1.
        **Key requirements:**
        1. Seamlessly integrate the item.
        2. Match the lighting, shadows, and perspective of the original photo.
        3. Ensure the scale and position of the item are natural and correct for the model.
        4. Do not alter the model's face, body, or the background. Only add the item.`
    };
    return callGemini([personPart, itemPart, textPart]);
};

export const enhanceImage = async (imageBase64: string): Promise<string | null> => {
    const imagePart = fileToGenerativePart(imageBase64);
    const textPart = {
        text: `**Task: Professional Photo Enhancement.**
        Act as a professional photo retoucher. Enhance the following image by increasing its resolution, improving sharpness and detail, correcting colors for vibrancy and balance, and reducing any noise or artifacts.
        The final result should be a crisp, clear, and high-quality version of the original, without altering the subjects or composition.`
    };
    return callGemini([imagePart, textPart]);
};

export const colorizeImage = async (imageBase64: string): Promise<string | null> => {
    const imagePart = fileToGenerativePart(imageBase64);
    const textPart = {
        text: `**Task: Historical Photo Colorization.**
        You are an expert in historical photo colorization. Colorize the provided black and white image.
        Apply realistic and context-appropriate colors to all elements, including skin tones, clothing, objects, and the environment.
        Strive for a natural, authentic look as if the photo was originally taken in color.`
    };
    return callGemini([imagePart, textPart]);
};

export const changeOutfit = async (personImageBase64: string, outfitDescription: string): Promise<string | null> => {
    const imagePart = fileToGenerativePart(personImageBase64);
    const textPart = {
        text: `**Task: AI Fashion Stylist.**
        Your task is to change the outfit of the person in the provided image based on the user's request.
        Do not change the person's face, hair, or the background.
        The new clothing must realistically conform to the person's body and pose, matching the original image's lighting and shadows.
        **User's request for the new outfit:** "${outfitDescription}"`
    };
    return callGemini([imagePart, textPart]);
};

export const transferOutfit = async (personImageBase64: string, outfitImageBase64: string, prompt: string): Promise<string | null> => {
    const personPart = fileToGenerativePart(personImageBase64);
    const outfitPart = fileToGenerativePart(outfitImageBase64);
    const textPart = {
        text: `**Critical Task: Photorealistic Outfit Transfer**

You are an expert digital tailor. Your job is to take an outfit from one image (Outfit Source) and perfectly fit it onto a person in another image (Model). The result must be completely seamless and photorealistic.

**Input Images:**
- **Image 1 (Model):** The person who will wear the new outfit.
- **Image 2 (Outfit Source):** The image containing the clothing to be transferred.

**Non-Negotiable Rules for a Perfect Result:**

1.  **Isolate & Adapt the Garment:**
    - First, identify and isolate the main article(s) of clothing from the 'Outfit Source' image.
    - Then, you MUST meticulously warp, reshape, and drape the isolated clothing to perfectly fit the 'Model's' exact body shape, posture, and pose. The clothing must follow the contours of their body, arms, and torso naturally.

2.  **Flawless Lighting & Shadow Integration:**
    - Analyze the lighting environment of the 'Model' image (light source direction, hardness, color).
    - You MUST re-render the lighting and shadows on the transferred outfit to perfectly match this environment. The shadows cast by the new clothing must be consistent with the original image's lighting.

3.  **Preserve Model & Background Integrity:**
    - The 'Model's' face, hair, skin, and body proportions MUST remain **absolutely unchanged**.
    - The background from the 'Model' image MUST also be perfectly preserved.

4.  **Incorporate User Instructions (If Provided):**
    - The user may provide specific instructions. You must follow them. For example, 'use only the jacket' or 'change the color to red'.
    - **User's specific instructions:** "${prompt || 'No additional instructions.'}"

**Final Output:** Produce a single, high-resolution image of the person from the 'Model' image wearing the new, perfectly fitted outfit. Do NOT output any text, commentary, or explanations. The final image should look like an authentic, unedited photograph.`
    };
    return callGemini([personPart, outfitPart, textPart]);
};


export const changeBackground = async (subjectImageBase64: string, backgroundImageBase64: string): Promise<string | null> => {
    const subjectPart = fileToGenerativePart(subjectImageBase64);
    const backgroundPart = fileToGenerativePart(backgroundImageBase64);
    const textPart = {
        text: `**Task: Background Replacement.**
        You will receive two images. Image 1 contains the primary subject. Image 2 is the new background.
        Your task is to flawlessly extract the subject from Image 1 and place them into Image 2.
        The final composite must be photorealistic. Match the color grading, lighting, and shadows of the subject to the new environment to ensure a seamless and believable integration.`
    };
    return callGemini([subjectPart, backgroundPart, textPart]);
};

export const customEdit = async (imageBase64: string, userPrompt: string): Promise<string | null> => {
    const imagePart = fileToGenerativePart(imageBase64);
    const textPart = {
        text: `**Task: AI Image Editor.**
        Your task is to modify the provided image according to the user's specific instructions.
        Adhere strictly to the user's prompt to perform the edit.
        Do not output any text, only the final edited image.
        **User's instructions:** "${userPrompt}"`
    };
    return callGemini([imagePart, textPart]);
};