'use server';

import { analyzeImageOrder } from '@/ai/flows/analyze-image-order';
import { detectInvalidPhoto } from '@/ai/flows/detect-invalid-photo';
import { generateImprovementSuggestions } from '@/ai/flows/generate-improvement-suggestions';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

async function saveScore(score: number) {
  if (!db) {
    console.warn('Firestore is not configured. Skipping score saving.');
    return;
  }
  try {
    // The app doesn't have users, so we'll use a randomly generated name.
    // In a real app, you'd get the authenticated user's ID and name.
    const userName = `User-${Math.random().toString(36).substring(2, 7)}`;
    await addDoc(collection(db, 'leaderboard'), {
      name: userName,
      score: score,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error writing document to Firestore: ', error);
    // We won't re-throw the error, as saving the score is not on the critical path
    // for the user analyzing their photo.
  }
}

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

    // Save the score after a successful analysis
    if (orderAnalysis.orderRating) {
      await saveScore(orderAnalysis.orderRating);
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
