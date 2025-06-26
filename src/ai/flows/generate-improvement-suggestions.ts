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
    .describe("Un elenco di suggerimenti per migliorare il punteggio di ordine."),
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
  prompt: `Sei un assistente AI progettato per fornire agli utenti suggerimenti su come migliorare l'ordine di uno spazio in una foto.

Analizzerai la foto e il punteggio di ordine attuale, quindi fornirai un elenco di suggerimenti pratici per migliorare il punteggio.

Considera fattori come il disordine, l'organizzazione e l'estetica generale. Tutti i suggerimenti devono essere in italiano.

Foto: {{media url=photoDataUri}}
Punteggio attuale: {{currentScore}}

Suggerimenti:`,
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
