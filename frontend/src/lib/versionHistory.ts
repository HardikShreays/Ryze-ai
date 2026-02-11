import type { StructuredPlan } from "./types";

export type VersionSnapshot = {
  id: string;
  plan: StructuredPlan;
  code: string;
  explanation: string;
  timestamp: number;
};

const history: VersionSnapshot[] = [];
let nextId = 0;

export function pushVersion(snapshot: Omit<VersionSnapshot, "id" | "timestamp">): VersionSnapshot {
  const v: VersionSnapshot = {
    ...snapshot,
    id: `v${++nextId}`,
    timestamp: Date.now(),
  };
  history.push(v);
  return v;
}

export function getHistory(): VersionSnapshot[] {
  return [...history];
}

export function getVersion(id: string): VersionSnapshot | undefined {
  return history.find((v) => v.id === id);
}

export function getLatest(): VersionSnapshot | undefined {
  return history[history.length - 1];
}

export function rollback(id: string): VersionSnapshot | undefined {
  const idx = history.findIndex((v) => v.id === id);
  if (idx < 0) return undefined;
  const keep = history.slice(0, idx + 1);
  history.length = 0;
  history.push(...keep);
  return history[history.length - 1];
}

export function clearHistory(): void {
  history.length = 0;
  nextId = 0;
}
