/**
 * GENERATOR AGENT
 * Input: Validated structured plan JSON
 * Output: React component composition using ONLY allowed components
 *
 * Uses OpenRouter API (OpenAI-compatible).
 */

import { OpenAI } from "openai";

const GENERATOR_SYSTEM = `You generate React/JSX code. Use ONLY these imports:
import { Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart } from "@/components/ui";

Rules:
- NO inline styles. NO style props. NO className props. NO Tailwind classes you invent.
- Pass only the props defined for each component.
- Output ONLY the JSX code for a single default-export function. No imports in output.
- For Modal: use open={true} for display in preview.
- For Chart: dataKey must be one of: mockRevenue, mockUsers, mockOrders, mockTraffic.
- Children go as React children, not in props.`;

export type GeneratorInput = {
  plan: unknown;
};

export type GeneratorOutput = {
  code: string;
};

function createOpenRouterClient(apiKey: string) {
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

export async function runGenerator(
  input: GeneratorInput,
  apiKey: string
): Promise<GeneratorOutput> {
  const openai = createOpenRouterClient(apiKey);

  const userContent = `Generate React component from this plan:\n${JSON.stringify(input.plan, null, 2)}`;

  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: GENERATOR_SYSTEM },
      { role: "user", content: userContent },
    ],
    temperature: 0.1,
  });

  let code = response.choices[0]?.message?.content ?? "";
  code = code.replace(/```jsx?\n?/g, "").replace(/```\n?/g, "").trim();
  if (!code.includes("export default")) {
    code = `export default function GeneratedUI() {\n  return (\n    ${code}\n  );\n}`;
  }

  return { code };
}
