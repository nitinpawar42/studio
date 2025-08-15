// src/ai/flows/personalized-recommendations.ts
'use server';

/**
 * @fileOverview A personalized product recommendation AI agent.
 *
 * - personalizedRecommendations - A function that handles the product recommendation process.
 * - PersonalizedRecommendationsInput - The input type for the personalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the personalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  browsingHistory: z
    .string()
    .describe('The user browsing history, as a string of product names.'),
  spiritualInterests: z
    .string()
    .describe('The spiritual interests of the user, as a string.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('The personalized product recommendations for the user.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function personalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert in Hindu spiritual items and can provide personalized product recommendations based on a user's browsing history and spiritual interests.

  Based on the following browsing history: {{{browsingHistory}}}
  And the following spiritual interests: {{{spiritualInterests}}}

  Provide personalized product recommendations that the user might be interested in.`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
