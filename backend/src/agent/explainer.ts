/**
 * EXPLAINER AGENT
 * Input: Structured plan + optional previous plan
 * Output: Plain English explanation of layout, component choice, changes
 *
 * Uses OpenRouter API (OpenAI-compatible).
 */

import OpenAI from "openai";

const EXPLAINER_SYSTEM = `You explain UI design decisions in plain English. Be concise.

Include:
1. Layout choice and why it fits the request
2. Component selection rationale
3. If there was a previous plan: what changed and why`;

export type ExplainerInput = {
  plan: unknown;
  previousPlan?: unknown;
};

export type ExplainerOutput = {
  explanation: string;
};

function createOpenRouterClient(apiKey: string): OpenAI {
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

export async function runExplainer(
  input: ExplainerInput,
  apiKey: string
): Promise<ExplainerOutput> {
  const openai = createOpenRouterClient(apiKey);

  const userContent = input.previousPlan
    ? `Previous plan:\n${JSON.stringify(input.previousPlan)}\n\nNew plan:\n${JSON.stringify(input.plan)}\n\nExplain the design and what changed.`
    : `Plan:\n${JSON.stringify(input.plan)}\n\nExplain the layout and component choices.`;

  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: EXPLAINER_SYSTEM },
      { role: "user", content: userContent },
    ],
    temperature: 0.3,
  });

  const explanation = response.choices[0]?.message?.content ?? "No explanation available.";
  return { explanation };
}
