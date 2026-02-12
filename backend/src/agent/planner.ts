/**
 * PLANNER AGENT
 * Input: User intent, optional previous plan
 * Output: Structured JSON plan ONLY (no JSX)
 *
 * Uses OpenRouter API (OpenAI-compatible).
 */

import { OpenAI } from "openai";

const ALLOWED_COMPONENTS = [
  "Button",
  "Card",
  "Input",
  "Table",
  "Modal",
  "Sidebar",
  "Navbar",
  "Chart",
];

const PLANNER_SYSTEM = `You are a UI planner. Output ONLY valid JSON. No markdown, no code blocks, no explanation.

Allowed components: ${ALLOWED_COMPONENTS.join(", ")}
Allowed layouts: sidebar-main, centered, full-width

Output format:
{
  "layout": "sidebar-main" | "centered" | "full-width",
  "components": [
    {
      "type": "<ComponentName>",
      "props": { ... },
      "children": [ ... ] // optional, for Card etc.
    }
  ]
}

Rules:
- Use ONLY allowed components. No inline styles. No custom CSS. No style props.
- Props must match component schemas:
  - Button: variant ("primary"|"secondary"), label, onClick?
  - Card: title?, description?, children?
  - Input: label?, placeholder?, value?, type?, disabled?
  - Table: columns [{key, header}], rows [{...}]
  - Modal: title, open, onClose?
  - Sidebar: title?, items [{label, id?}], children?
  - Navbar: title, subtitle?
  - Chart: dataKey ("mockRevenue"|"mockUsers"|"mockOrders"|"mockTraffic"), title?
- No unknown fields. No className. No style.`;

export type PlannerInput = {
  userIntent: string;
  previousPlan?: unknown;
};

export type PlannerOutput = {
  plan: unknown;
  raw: string;
};

function createOpenRouterClient(apiKey: string) {
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

export async function runPlanner(
  input: PlannerInput,
  apiKey: string
): Promise<PlannerOutput> {
  const openai = createOpenRouterClient(apiKey);

  const userContent = input.previousPlan
    ? `PREVIOUS PLAN (modify this, do not full rewrite unless asked):\n${JSON.stringify(input.previousPlan)}\n\nUSER REQUEST: ${input.userIntent}`
    : `USER REQUEST: ${input.userIntent}`;

  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: PLANNER_SYSTEM },
      { role: "user", content: userContent },
    ],
    temperature: 0.2,
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  const stripped = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  let plan: unknown;
  try {
    plan = JSON.parse(stripped);
  } catch {
    plan = { layout: "centered", components: [] };
  }

  return { plan, raw };
}
