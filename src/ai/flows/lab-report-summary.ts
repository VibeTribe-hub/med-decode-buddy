'use server';
/**
 * @fileOverview Analyzes a lab report and provides a simple summary and structured key findings.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const LabReportSummaryInputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      'A lab report document, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
});
export type LabReportSummaryInput = z.infer<typeof LabReportSummaryInputSchema>;

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

// MODIFIED: Final prompt with explicit instructions for the main summary
const prompt = ai.definePrompt({
  name: 'labReportSummaryPrompt',
  input: { schema: LabReportSummaryInputSchema },
  output: { schema: LabReportSummaryOutputSchema },
  prompt: `
    You are a friendly medical expert who explains complex lab results in simple, plain English for patients.
    Analyze the provided lab report.

    **CRITICAL RULE: Both the 'summary' and the 'explanation' for each finding MUST be in plain English and avoid jargon.**

    - BAD SUMMARY: "Your AST and LDL levels are elevated."
    - GOOD SUMMARY: "Your results show that some of your liver enzyme (AST) and 'bad' cholesterol (LDL) levels are higher than normal. We recommend discussing these with your doctor."

    Your response must have two parts:
    1. A brief 'summary' of the overall results, written in simple terms.
    2. A list of 'keyFindings' for important medical terms, each with a plain-English 'explanation'.

    For each key finding, you MUST provide:
    - 'term': The medical term (e.g., "MCHC").
    - 'status': The result status ('Normal', 'High', 'Low', 'Abnormal', 'Borderline').
    - 'explanation': A simple explanation of what the term means and what the result implies.

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
