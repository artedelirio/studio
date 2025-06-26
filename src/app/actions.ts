'use server';

import { analyzeImageOrder } from '@/ai/flows/analyze-image-order';
import { detectInvalidPhoto } from '@/ai/flows/detect-invalid-photo';
import { generateImprovementSuggestions } from '@/ai/flows/generate-improvement-suggestions';

export async function analyzePhoto(photoDataUri: string) {
  if (!photoDataUri) {
    throw new Error('No photo provided.');
  }

  try {
    const invalidCheck = await detectInvalidPhoto({ photoDataUri });
    if (!invalidCheck.isValid) {
      throw new Error(
        invalidCheck.reason ||
          'Invalid photo provided. Please provide a clear image of a room.'
      );
    }

    const orderAnalysis = await analyzeImageOrder({ photoDataUri });
    if (!orderAnalysis.isValid) {
      throw new Error(
        orderAnalysis.reason || 'Could not analyze photo. Please try another one.'
      );
    }

    const suggestionsResult = await generateImprovementSuggestions({
      photoDataUri,
      currentScore: orderAnalysis.orderRating,
    });

    return {
      score: orderAnalysis.orderRating,
      reason: orderAnalysis.reason,
      suggestions: suggestionsResult.suggestions,
    };
  } catch (e) {
    if (e instanceof Error) {
      // Prepend a user-friendly message to the error from the AI flow.
      throw new Error(`AI analysis failed: ${e.message}`);
    }
    throw new Error('An unknown error occurred during AI analysis.');
  }
}
