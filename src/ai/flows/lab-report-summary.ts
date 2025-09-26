'use server';
/**
 * @fileOverview Analyzes a lab report and provides a simple summary and structured key findings.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod'; // It's often better to use 'zod' directly

const LabReportSummaryInputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      'A lab report document, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
});
export type LabReportSummaryInput = z.infer<typeof LabReportSummaryInputSchema>;

// MODIFIED: The output now includes a structured list of key findings
const LabReportSummaryOutputSchema = z.object({
  summary: z.string().describe("A brief, overall summary of the report in plain English."),
  keyFindings: z.array(
    z.object({
      term: z.string().describe("The medical term being analyzed."),
      explanation: z.string().describe("A simple, plain-English explanation of the term and its result."),
      status: z.enum(["Normal", "High", "Low", "Abnormal", "Borderline"]),
    })
  ),
});
export type LabReportSummaryOutput = z.infer<typeof LabReportSummaryOutputSchema>;

export async function labReportSummary(input: LabReportSummaryInput): Promise<LabReportSummaryOutput> {
  return labReportSummaryFlow(input);
}

// MODIFIED: The prompt is now much more detailed to get better results
const prompt = ai.definePrompt({
  name: 'labReportSummaryPrompt',
  input: { schema: LabReportSummaryInputSchema },
  output: { schema: LabReportSummaryOutputSchema },
  prompt: `
    You are a friendly medical expert who explains complex lab results in simple, plain English for patients.
    Analyze the provided lab report.

    Your response must have two parts:
    1. A brief 'summary' of the overall results.
    2. A list of 'keyFindings' for important medical terms.

    For each key finding, you MUST provide:
    - 'term': The medical term (e.g., "MCHC").
    - 'status': The result status ('Normal', 'High', 'Low', 'Abnormal', 'Borderline').
    - 'explanation': A simple explanation of what the term means and what the result implies.

    **CRITICAL RULE:** The 'explanation' MUST be in plain English and avoid jargon.
    - BAD Explanation: "MCHC is slightly elevated."
    - GOOD Explanation: "Mean Corpuscular Hemoglobin Concentration (MCHC) measures the average concentration of hemoglobin in your red blood cells. Your level is slightly elevated, which is worth discussing with your doctor as it can sometimes relate to certain types of anemia."

    Lab Report: {{media url=reportDataUri}}
  `,
});

const labReportSummaryFlow = ai.defineFlow(
  {
    name: 'labReportSummaryFlow',
    inputSchema: LabReportSummaryInputSchema,
    outputSchema: LabReportSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
