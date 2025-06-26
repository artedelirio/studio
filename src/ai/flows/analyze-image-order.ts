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
      'The order rating of the room in the image, on a scale of 1 to 5, with decimals allowed.'
    ),
  isValid: z
    .boolean()
    .describe(
      'Whether the photo is valid and contains enough information to assess order.'
    ),
  reason: z
    .string()
    .optional()
    .describe('The detailed reason/explanation of the rating or invalid photo.'),
});
export type AnalyzeImageOrderOutput = z.infer<typeof AnalyzeImageOrderOutputSchema>;

export async function analyzeImageOrder(input: AnalyzeImageOrderInput): Promise<AnalyzeImageOrderOutput> {
  return analyzeImageOrderFlow(input);
}

const analyzeImageOrderPrompt = ai.definePrompt({
  name: 'analyzeImageOrderPrompt',
  input: {schema: AnalyzeImageOrderInputSchema},
  output: {schema: AnalyzeImageOrderOutputSchema},
  prompt: `You are an AI assistant designed to evaluate the level of order in a photo of a room.

You will receive a photo of a room and provide a rating between 1 and 5 (with decimals) indicating the perceived level of order.

- 1 indicates a very disordered room.
- 5 indicates a very orderly room.

If the photo does not clearly show a room or the room is not clearly visible, set isValid to false and provide a reason.

Photo: {{media url=photoDataUri}}

Please provide your rating and explanation.`,
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
