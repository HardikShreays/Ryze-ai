/**
 * Backend API server.
 * Agent pipeline (planner, generator, explainer, validator) runs here.
 */

import express from "express";
import cors from "cors";
import { runPlanner } from "./agent/planner.js";
import { runGenerator } from "./agent/generator.js";
import { runExplainer } from "./agent/explainer.js";
import { validatePlan } from "./agent/validator.js";

const app = express();
app.use(cors());
app.use(express.json());

function sanitizeIntent(input: string): string {
  return String(input)
    .slice(0, 2000)
    .replace(/<[^>]*>/g, "")
    .replace(/\{[\s\S]*\}/g, "")
    .trim();
}

app.post("/api/generate", async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
      return;
    }

    const intent = sanitizeIntent(req.body?.intent ?? "");
    const previousPlan = req.body?.previousPlan;

    if (!intent) {
      res.status(400).json({ error: "intent is required" });
      return;
    }

    const { plan } = await runPlanner(
      { userIntent: intent, previousPlan },
      apiKey
    );

    const validation = validatePlan(plan);
    if (!validation.valid) {
      res.status(422).json({
        error: "Validation failed",
        validationErrors: validation.errors,
      });
      return;
    }

    const { code } = await runGenerator({ plan: validation.plan }, apiKey);

    const { explanation } = await runExplainer(
      { plan: validation.plan, previousPlan },
      apiKey
    );

    res.json({
      plan: validation.plan,
      code,
      explanation,
    });
  } catch (err) {
    console.error("Generate error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
