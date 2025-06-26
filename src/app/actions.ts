'use server';

import { analyzeImageOrder } from '@/ai/flows/analyze-image-order';
import { detectInvalidPhoto } from '@/ai/flows/detect-invalid-photo';
import { generateImprovementSuggestions } from '@/ai/flows/generate-improvement-suggestions';

export async function analyzePhoto(photoDataUri: string) {
  if (!photoDataUri) {
    throw new Error('Nessuna foto fornita.');
  }

  try {
    const invalidCheck = await detectInvalidPhoto({ photoDataUri });
    if (!invalidCheck.isValid) {
      throw new Error(
        invalidCheck.reason ||
          "Foto non valida. Fornisci un'immagine chiara di una stanza."
      );
    }

    const orderAnalysis = await analyzeImageOrder({ photoDataUri });
    if (!orderAnalysis.isValid) {
      throw new Error(
        orderAnalysis.reason || 'Impossibile analizzare la foto. Per favore, provane un\'altra.'
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
      throw new Error(`Analisi IA fallita: ${e.message}`);
    }
    throw new Error('Si è verificato un errore sconosciuto durante l\'analisi IA.');
  }
}
