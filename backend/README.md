# Backend – Agent Pipeline

Express server that runs the deterministic UI generator agent pipeline using **OpenRouter**.

## Agent modules

- `src/agent/planner.ts` – JSON plan from user intent
- `src/agent/generator.ts` – React JSX from validated plan
- `src/agent/explainer.ts` – Plain English explanation
- `src/agent/validator.ts` – Plan schema validation

## Environment

```env
OPENROUTER_API_KEY=your_key
OPENROUTER_MODEL=openai/gpt-4o-mini   # optional, default
```

## Run

```bash
npm install
npm run dev   # http://localhost:3001
```

## API

`POST /api/generate`

```json
{
  "intent": "A dashboard with sidebar and revenue chart",
  "previousPlan": { ... }   // optional, for iterative edits
}
```
