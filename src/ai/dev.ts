import { config } from 'dotenv';
config();

import '@/ai/flows/detect-invalid-photo.ts';
import '@/ai/flows/analyze-image-order.ts';
import '@/ai/flows/generate-improvement-suggestions.ts';