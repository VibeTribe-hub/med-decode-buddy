'use server';
/**
 * @fileOverview Extracts medication information from a prescription using AI.
 *
 * - extractMedicationFromPrescription - A function that extracts medication details from a prescription.
 * - ExtractMedicationFromPrescriptionInput - The input type for the extractMedicationFromPrescription function.
 * - ExtractMedicationFromPrescriptionOutput - The return type for the extractMedicationFromPrescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractMedicationFromPrescriptionInputSchema = z.object({
  prescriptionDataUri: z
    .string()
    .describe(
      'A prescription document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type ExtractMedicationFromPrescriptionInput = z.infer<
  typeof ExtractMedicationFromPrescriptionInputSchema
>;

const ExtractMedicationFromPrescriptionOutputSchema = z.object({
  medications: z.array(
    z.object({
      name: z.string().describe('The name of the medication.'),
      dosage: z.string().describe('The dosage of the medication.'),
      frequency: z.string().describe('The frequency of the medication.'),
    })
  ).describe('A list of medications extracted from the prescription.')
});
export type ExtractMedicationFromPrescriptionOutput = z.infer<
  typeof ExtractMedicationFromPrescriptionOutputSchema
>;

export async function extractMedicationFromPrescription(
  input: ExtractMedicationFromPrescriptionInput
): Promise<ExtractMedicationFromPrescriptionOutput> {
  return extractMedicationFromPrescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractMedicationFromPrescriptionPrompt',
  input: {schema: ExtractMedicationFromPrescriptionInputSchema},
  output: {schema: ExtractMedicationFromPrescriptionOutputSchema},
  prompt: `You are an expert pharmacist. Extract the medication names, dosages, and frequency from the following prescription:

  Prescription: {{media url=prescriptionDataUri}}
  
  Return the information in JSON format.
  `,
});

const extractMedicationFromPrescriptionFlow = ai.defineFlow(
  {
    name: 'extractMedicationFromPrescriptionFlow',
    inputSchema: ExtractMedicationFromPrescriptionInputSchema,
    outputSchema: ExtractMedicationFromPrescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
