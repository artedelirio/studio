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
  isValid: z.boolean().describe('Whether the photo is valid for analysis.'),
  reason: z
    .string()
    .optional()
    .describe('The reason why the photo is invalid, if applicable.'),
});
export type DetectInvalidPhotoOutput = z.infer<typeof DetectInvalidPhotoOutputSchema>;

export async function detectInvalidPhoto(input: DetectInvalidPhotoInput): Promise<DetectInvalidPhotoOutput> {
  return detectInvalidPhotoFlow(input);
}

const detectInvalidPhotoPrompt = ai.definePrompt({
  name: 'detectInvalidPhotoPrompt',
  input: {schema: DetectInvalidPhotoInputSchema},
  output: {schema: DetectInvalidPhotoOutputSchema},
  prompt: `You are an AI assistant that determines if a given photo is valid for analysis.

  A photo is considered invalid if it does not clearly show a room, or if the photo is blurry, 
  too dark, or otherwise unsuitable for determining the level of order in the room.

  Analyze the following photo and determine if it is valid for analysis:

  Photo: {{media url=photoDataUri}}

  Respond with a JSON object that has an \"isValid\" boolean field.  If the photo is not valid, explain why in the \"reason\" field.
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
