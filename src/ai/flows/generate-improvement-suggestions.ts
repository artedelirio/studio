'use server';

/**
 * @fileOverview AI-powered suggestions for improving the orderliness of a photo.
 *
 * - generateImprovementSuggestions - A function that generates suggestions to improve the photo's order score.
 * - GenerateImprovementSuggestionsInput - The input type for the generateImprovementSuggestions function.
 * - GenerateImprovementSuggestionsOutput - The return type for the generateImprovementSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImprovementSuggestionsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the space, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  currentScore: z
    .number()
    .describe('The current orderliness score of the photo (1-5).'),
});
export type GenerateImprovementSuggestionsInput = z.infer<
  typeof GenerateImprovementSuggestionsInputSchema
>;

const GenerateImprovementSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions to improve the orderliness score.'),
});
export type GenerateImprovementSuggestionsOutput = z.infer<
  typeof GenerateImprovementSuggestionsOutputSchema
>;

export async function generateImprovementSuggestions(
  input: GenerateImprovementSuggestionsInput
): Promise<GenerateImprovementSuggestionsOutput> {
  return generateImprovementSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImprovementSuggestionsPrompt',
  input: {schema: GenerateImprovementSuggestionsInputSchema},
  output: {schema: GenerateImprovementSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide users with suggestions on how to improve the orderliness of a space in a photo.

You will analyze the photo and the current orderliness score, then provide a list of actionable suggestions to improve the score.

Consider factors such as clutter, organization, and overall aesthetics.

Photo: {{media url=photoDataUri}}
Current Score: {{currentScore}}

Suggestions:`,
});

const generateImprovementSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateImprovementSuggestionsFlow',
    inputSchema: GenerateImprovementSuggestionsInputSchema,
    outputSchema: GenerateImprovementSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
