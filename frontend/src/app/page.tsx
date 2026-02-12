"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { PreviewErrorBoundary } from "@/components/PreviewErrorBoundary";
import { api } from "@/lib/api";
import { renderPlan } from "@/lib/planRenderer";
import type { StructuredPlan, ValidationError } from "@/lib/types";

type VersionSnapshot = {
  id: string;
  plan: StructuredPlan;
  code: string;
  explanation: string;
  timestamp: number;
};

export default function Home() {
  const [intent, setIntent] = useState("");
  const [code, setCode] = useState("");
  const [plan, setPlan] = useState<StructuredPlan | null>(null);
  const [explanation, setExplanation] = useState("");
  const [history, setHistory] = useState<VersionSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[] | null>(null);

  const addToHistory = useCallback((p: StructuredPlan, c: string, exp: string) => {
    const v: VersionSnapshot = {
      id: `v${Date.now()}`,
      plan: p,
      code: c,
      explanation: exp,
      timestamp: Date.now(),
    };
    setHistory((prev) => [...prev, v]);
    return v;
  }, []);

  const runGenerate = useCallback(
    async (usePreviousPlan: boolean) => {
      if (!intent.trim()) return;
      setLoading(true);
      setError(null);
      setValidationErrors(null);

      try {
        const { data } = await api.post("/api/generate", {
          intent: intent.trim(),
          previousPlan: usePreviousPlan ? plan : undefined,
        });

        setPlan(data.plan);
        setCode(data.code);
        setExplanation(data.explanation);
        addToHistory(data.plan, data.code, data.explanation);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.data) {
          const data = e.response.data as { error?: string; validationErrors?: ValidationError[] };
          setError(data.error ?? "Request failed");
          setValidationErrors(data.validationErrors ?? null);
        } else {
          setError(e instanceof Error ? e.message : "Network error");
        }
      } finally {
        setLoading(false);
      }
    },
    [intent, plan, addToHistory]
  );

  const handleRollback = useCallback((v: VersionSnapshot) => {
    setPlan(v.plan);
    setCode(v.code);
    setExplanation(v.explanation);
    setError(null);
    setValidationErrors(null);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="border-b border-gray-200 bg-white px-4 py-2">
        <h1 className="text-lg font-semibold text-gray-900">
          Deterministic UI Generator
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col gap-2 overflow-auto p-3">
            <label className="text-sm font-medium text-gray-800">
              Describe your UI
            </label>
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g. A dashboard with a sidebar, navbar titled Dashboard, and a revenue chart card"
              className="min-h-24 resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={() => runGenerate(false)}
                disabled={loading || !intent.trim()}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </button>
              <button
                onClick={() => runGenerate(true)}
                disabled={loading || !intent.trim() || !plan}
                className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white disabled:bg-gray-400"
              >
                Regenerate
              </button>
            </div>
            {history.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-gray-800">Rollback</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {history.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => handleRollback(v)}
                      className="rounded bg-black px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-gray-800"
                    >
                      v{i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {explanation && (
            <div className="border-t border-gray-200 p-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Why
              </h3>
              <div className="mt-2 max-h-40 overflow-y-auto rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="text-sm leading-relaxed">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-800">
                        {children}
                      </strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-2 list-inside list-disc space-y-0.5 text-sm">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-700">{children}</li>
                    ),
                  }}
                >
                  {explanation}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col border-b border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-3 py-2">
              <h2 className="text-sm font-medium text-gray-700">Generated Code</h2>
            </div>
            <div className="flex-1 overflow-auto p-3">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Generate to see code"
                className="h-full w-full resize-none rounded border border-gray-200 bg-gray-50 p-3 font-mono text-xs text-gray-800"
                spellCheck={false}
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
            <div className="border-b border-gray-200 px-3 py-2">
              <h2 className="text-sm font-medium text-gray-700">Live Preview</h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {error}
                  {validationErrors && validationErrors.length > 0 && (
                    <ul className="mt-2 list-inside list-disc">
                      {validationErrors.map((e, i) => (
                        <li key={i}>
                          {e.path}: {e.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {plan && !error && (
                <PreviewErrorBoundary>
                  {renderPlan(plan)}
                </PreviewErrorBoundary>
              )}
              {!plan && !error && (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Enter a description and click Generate
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
