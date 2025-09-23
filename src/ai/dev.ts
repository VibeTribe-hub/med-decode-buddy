import { config } from 'dotenv';
config();

import '@/ai/flows/lab-report-summary.ts';
import '@/ai/flows/food-medication-interaction-check.ts';
import '@/ai/flows/extract-medication-from-prescription.ts';