'use server';
/**
 * @fileOverview An AI flow for generating card sets for the memory game.
 *
 * - generateCards - A function that handles the card generation process.
 * - GenerateCardsInput - The input type for the generateCards function.
 * - GenerateCardsOutput - The return type for the generateCards function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCardsInputSchema = z.object({
  theme: z.string().describe('The user-provided theme for the card set. e.g., "dinosaurs"'),
  numPairs: z.number().int().positive().describe('The number of unique card pairs to generate.'),
});
export type GenerateCardsInput = z.infer<typeof GenerateCardsInputSchema>;

const CardSchema = z.object({
    type: z.string().describe('The name of the concept on the card, e.g., "T-Rex".'),
    content: z.string().describe("The generated image for the card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:image/png;base64,<encoded_data>'."),
    image: z.literal(true),
    hint: z.string().describe('A hint for the AI to generate the image, typically the same as the type.')
});

const GenerateCardsOutputSchema = z.array(CardSchema);
export type GenerateCardsOutput = z.infer<typeof GenerateCardsOutputSchema>;


export async function generateCards(input: GenerateCardsInput): Promise<GenerateCardsOutput> {
  return generateCardsFlow(input);
}

const conceptsPrompt = ai.definePrompt({
  name: 'generateCardConceptsPrompt',
  input: { schema: GenerateCardsInputSchema },
  output: { schema: z.object({ concepts: z.array(z.string().describe('A single, unique, one or two-word concept related to the theme.')) }) },
  prompt: `You are a creative assistant for a memory card game.
Based on the theme '{{{theme}}}', generate exactly {{{numPairs}}} unique but related concepts.
Each concept should be a concise, one or two-word name.
Do not repeat concepts.
`,
});

const generateCardsFlow = ai.defineFlow(
  {
    name: 'generateCardsFlow',
    inputSchema: GenerateCardsInputSchema,
    outputSchema: GenerateCardsOutputSchema,
  },
  async ({ theme, numPairs }) => {
    console.log(`Generating ${numPairs} card concepts for theme: ${theme}`);
    
    const { output: conceptsResult } = await conceptsPrompt({ theme, numPairs });
    if (!conceptsResult?.concepts || conceptsResult.concepts.length === 0) {
      throw new Error('Could not generate card concepts.');
    }
    
    console.log(`Generated concepts: ${conceptsResult.concepts.join(', ')}`);

    const imagePromises = conceptsResult.concepts.map(concept =>
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A vibrant, fun, sticker-style icon of ${concept}, on a clean white background, for a memory card game.`,
        config: { responseModalities: ['TEXT', 'IMAGE'] },
      }).then(response => ({
          type: concept,
          content: response.media.url,
          image: true as const,
          hint: concept.replace(/\s+/g, ' '),
      }))
    );

    const generatedCards = await Promise.all(imagePromises);
    console.log('Successfully generated images for all concepts.');

    return generatedCards;
  }
);