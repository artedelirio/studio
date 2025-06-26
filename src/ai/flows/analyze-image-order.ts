// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview AI flow for analyzing the level of order in an image and providing a rating between 1 and 5.
 *
 * - analyzeImageOrder - A function that analyzes the image order and returns a rating.
 * - AnalyzeImageOrderInput - The input type for the analyzeImageOrder function.
 * - AnalyzeImageOrderOutput - The return type for the analyzeImageOrder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageOrderInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a room, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageOrderInput = z.infer<typeof AnalyzeImageOrderInputSchema>;

const AnalyzeImageOrderOutputSchema = z.object({
  orderRating: z
    .number()
    .min(1)
    .max(5)
    .describe(
      "La valutazione dell'ordine della stanza nell'immagine, su una scala da 1 a 5, con decimali consentiti."
    ),
  isValid: z
    .boolean()
    .describe(
      "Indica se la foto è valida e contiene informazioni sufficienti per valutare l'ordine."
    ),
  reason: z
    .string()
    .optional()
    .describe('La ragione/spiegazione dettagliata della valutazione o della foto non valida.'),
});
export type AnalyzeImageOrderOutput = z.infer<typeof AnalyzeImageOrderOutputSchema>;

export async function analyzeImageOrder(input: AnalyzeImageOrderInput): Promise<AnalyzeImageOrderOutput> {
  return analyzeImageOrderFlow(input);
}

const analyzeImageOrderPrompt = ai.definePrompt({
  name: 'analyzeImageOrderPrompt',
  input: {schema: AnalyzeImageOrderInputSchema},
  output: {schema: AnalyzeImageOrderOutputSchema},
  prompt: `Sei un assistente AI progettato per valutare il livello di ordine in una foto di una stanza.

Riceverai una foto di una stanza e fornirai una valutazione tra 1 e 5 (con decimali) che indica il livello di ordine percepito.

- 1 indica una stanza molto disordinata.
- 5 indica una stanza molto ordinata.

Se la foto non mostra chiaramente una stanza o la stanza non è ben visibile, imposta isValid su false e fornisci una motivazione.

Foto: {{media url=photoDataUri}}

Fornisci la tua valutazione e spiegazione in italiano.`,
});

const analyzeImageOrderFlow = ai.defineFlow(
  {
    name: 'analyzeImageOrderFlow',
    inputSchema: AnalyzeImageOrderInputSchema,
    outputSchema: AnalyzeImageOrderOutputSchema,
  },
  async input => {
    const {output} = await analyzeImageOrderPrompt(input);
    return output!;
  }
);
