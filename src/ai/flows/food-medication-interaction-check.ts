'use server';
/**
 * @fileOverview Checks for potential interactions between medications and foods.
 *
 * - foodMedicationInteractionCheck - A function that checks for interactions.
 * - FoodMedicationInteractionCheckInput - The input type for the function.
 * - FoodMedicationInteractionCheckOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FoodMedicationInteractionCheckInputSchema = z.object({
  medications: z.array(z.string()).describe('A list of medications the user is taking.'),
  foods: z.array(z.string()).describe('A list of foods the user is consuming.'),
});
export type FoodMedicationInteractionCheckInput = z.infer<typeof FoodMedicationInteractionCheckInputSchema>;

const FoodMedicationInteractionCheckOutputSchema = z.object({
  interactions: z.array(z.string()).describe('A list of potential interactions between the medications and foods.'),
});
export type FoodMedicationInteractionCheckOutput = z.infer<typeof FoodMedicationInteractionCheckOutputSchema>;

export async function foodMedicationInteractionCheck(input: FoodMedicationInteractionCheckInput): Promise<FoodMedicationInteractionCheckOutput> {
  return foodMedicationInteractionCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'foodMedicationInteractionCheckPrompt',
  input: {schema: FoodMedicationInteractionCheckInputSchema},
  output: {schema: FoodMedicationInteractionCheckOutputSchema},
  prompt: `You are a pharmacist expert, skilled at identifying food and medication interactions.

  Based on the provided list of medications and foods, identify any potential interactions.

  Medications:
  {{#each medications}}- {{{this}}}
  {{/each}}

  Foods:
  {{#each foods}}- {{{this}}}
  {{/each}}

  List any potential interactions clearly and concisely.
  `,
});

const foodMedicationInteractionCheckFlow = ai.defineFlow(
  {
    name: 'foodMedicationInteractionCheckFlow',
    inputSchema: FoodMedicationInteractionCheckInputSchema,
    outputSchema: FoodMedicationInteractionCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
