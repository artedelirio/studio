'use server';

/**
 * @fileOverview This file defines a Genkit flow to detect if a photo is invalid for analysis.
 *
 * @remarks
 * This flow takes a photo (as a data URI) and returns whether the photo is valid for analysis.
 * - detectInvalidPhoto - A function that wraps the detectInvalidPhotoFlow.
 * - DetectInvalidPhotoInput - The input type for the detectInvalidPhoto function.
 * - DetectInvalidPhotoOutput - The return type for the detectInvalidPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectInvalidPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to be analyzed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type DetectInvalidPhotoInput = z.infer<typeof DetectInvalidPhotoInputSchema>;

const DetectInvalidPhotoOutputSchema = z.object({
  isValid: z.boolean().describe("Indica se la foto è valida per l'analisi."),
  reason: z
    .string()
    .optional()
    .describe('La ragione per cui la foto non è valida, se applicabile.'),
});
export type DetectInvalidPhotoOutput = z.infer<typeof DetectInvalidPhotoOutputSchema>;

export async function detectInvalidPhoto(input: DetectInvalidPhotoInput): Promise<DetectInvalidPhotoOutput> {
  return detectInvalidPhotoFlow(input);
}

const detectInvalidPhotoPrompt = ai.definePrompt({
  name: 'detectInvalidPhotoPrompt',
  input: {schema: DetectInvalidPhotoInputSchema},
  output: {schema: DetectInvalidPhotoOutputSchema},
  prompt: `Sei un assistente AI che determina se una data foto è valida per l'analisi.

  Una foto è considerata non valida se non mostra chiaramente una stanza, o se la foto è sfocata, troppo scura, o altrimenti non idonea per determinare il livello di ordine nella stanza.

  Analizza la seguente foto e determina se è valida per l'analisi:

  Foto: {{media url=photoDataUri}}

  Rispondi con un oggetto JSON che ha un campo booleano "isValid". Se la foto non è valida, spiega perché nel campo "reason". Tutte le tue risposte, inclusa la motivazione, devono essere in italiano.
  `,
});

const detectInvalidPhotoFlow = ai.defineFlow(
  {
    name: 'detectInvalidPhotoFlow',
    inputSchema: DetectInvalidPhotoInputSchema,
    outputSchema: DetectInvalidPhotoOutputSchema,
  },
  async input => {
    const {output} = await detectInvalidPhotoPrompt(input);
    return output!;
  }
);
