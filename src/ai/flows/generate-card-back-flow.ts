
'use server';
/**
 * @fileOverview An AI flow for generating custom card backs.
 *
 * - generateCardBack - A function that handles the card back image generation.
 * - GenerateCardBackInput - The input type for the generateCardBack function.
 * - GenerateCardBackOutput - The return type for the generateCardBack function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCardBackInputSchema = z.object({
  prompt: z.string().describe('The user-provided prompt for the card back design. e.g., "a golden dragon emblem"'),
});
export type GenerateCardBackInput = z.infer<typeof GenerateCardBackInputSchema>;

const GenerateCardBackOutputSchema = z.object({
    content: z.string().describe("The generated image for the card back, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateCardBackOutput = z.infer<typeof GenerateCardBackOutputSchema>;


export async function generateCardBack(input: GenerateCardBackInput): Promise<GenerateCardBackOutput> {
  return generateCardBackFlow(input);
}

const generateCardBackFlow = ai.defineFlow(
  {
    name: 'generateCardBackFlow',
    inputSchema: GenerateCardBackInputSchema,
    outputSchema: GenerateCardBackOutputSchema,
  },
  async ({ prompt }) => {
    console.log(`Generating card back for prompt: ${prompt}`);
    
    const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A vibrant, detailed, centered, sticker-style icon of ${prompt}, on a clean seamless background pattern, for a memory card game back. The main icon should be prominent. Square aspect ratio.`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE',
              },
            ],
        },
      });

    const { media } = response;

    if (!media?.url) {
        console.error('Image generation failed. Full response:', JSON.stringify(response, null, 2));
        throw new Error(`Could not generate card back image. Reason: ${response.finishReason ?? 'Unknown'}. ${response.finishReasonMessage ?? ''}`);
    }

    console.log('Successfully generated card back image.');

    return { content: media.url };
  }
);
