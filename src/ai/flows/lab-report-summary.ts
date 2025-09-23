'use server';

/**
 * @fileOverview AI flow for summarizing lab reports into plain language.
 *
 * - labReportSummary - A function that takes lab report data and returns a summary.
 * - LabReportSummaryInput - The input type for the labReportSummary function.
 * - LabReportSummaryOutput - The return type for the labReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LabReportSummaryInputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      "The lab report as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type LabReportSummaryInput = z.infer<typeof LabReportSummaryInputSchema>;

const LabReportSummaryOutputSchema = z.object({
  summary: z.string().describe('A plain language summary of the lab report.'),
});
export type LabReportSummaryOutput = z.infer<typeof LabReportSummaryOutputSchema>;

export async function labReportSummary(input: LabReportSummaryInput): Promise<LabReportSummaryOutput> {
  return labReportSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'labReportSummaryPrompt',
  input: {schema: LabReportSummaryInputSchema},
  output: {schema: LabReportSummaryOutputSchema},
  prompt: `You are a medical expert skilled at summarizing lab reports for patients.

  Please provide a concise and easy-to-understand summary of the following lab report. Focus on the key findings and their implications for the patient's health.

  Lab Report:
  {{media url=reportDataUri}}`,
});

const labReportSummaryFlow = ai.defineFlow(
  {
    name: 'labReportSummaryFlow',
    inputSchema: LabReportSummaryInputSchema,
    outputSchema: LabReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
