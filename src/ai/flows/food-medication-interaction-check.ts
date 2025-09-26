'use server';
/**
 * @fileOverview Checks for potential interactions between medications and foods, including severity.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod'; // Make sure you are using 'zod', not 'genkit/zod' if an error occurs

// The input schema remains the same
const FoodMedicationInteractionCheckInputSchema = z.object({
  medications: z.array(z.string()).describe('A list of medications.'),
  foods: z.array(z.string()).describe('A list of foods.'),
});
export type FoodMedicationInteractionCheckInput = z.infer<typeof FoodMedicationInteractionCheckInputSchema>;

// =================================================================
// == MODIFIED SECTION: Update the output schema for severity     ==
// =================================================================
const FoodMedicationInteractionCheckOutputSchema = z.object({
  interactions: z.array(
    z.object({
      text: z.string().describe("A clear explanation of the interaction."),
      severity: z
        .enum(['High', 'Moderate', 'Low', 'Informational'])
        .describe("The severity level of the interaction."),
    })
  ).describe('A list of potential interactions, each with a text description and a severity level.'),
});
export type FoodMedicationInteractionCheckOutput = z.infer<typeof FoodMedicationInteractionCheckOutputSchema>;

export async function foodMedicationInteractionCheck(input: FoodMedicationInteractionCheckInput): Promise<FoodMedicationInteractionCheckOutput> {
  return foodMedicationInteractionCheckFlow(input);
}

// =================================================================
// == MODIFIED SECTION: Update the prompt with new instructions   ==
// =================================================================
const prompt = ai.definePrompt({
  name: 'foodMedicationInteractionCheckPrompt',
  input: { schema: FoodMedicationInteractionCheckInputSchema },
  output: { schema: FoodMedicationInteractionCheckOutputSchema },
  prompt: `You are a pharmacist expert. Analyze the potential interaction between the medication and food provided.

  In your response, provide a 'text' description of the interaction and a 'severity' level.
  The severity MUST be one of four options: 'High', 'Moderate', 'Low', or 'Informational'.

  - Use 'High' for dangerous interactions that should be avoided.
  - Use 'Moderate' for interactions that can cause significant side effects.
  - Use 'Low' for minor or uncommon interactions.
  - Use 'Informational' when there is no significant interaction, but there is useful context (e.g., milk slightly delaying absorption).

  If no interaction exists, return an empty list of interactions.

  Medication:
  {{#each medications}}- {{{this}}}
  {{/each}}

  Food:
  {{#each foods}}- {{{this}}}
  {{/each}}
  `,
});

const foodMedicationInteractionCheckFlow = ai.defineFlow(
  {
    name: 'foodMedicationInteractionCheckFlow',
    inputSchema: FoodMedicationInteractionCheckInputSchema,
    outputSchema: FoodMedicationInteractionCheckOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
