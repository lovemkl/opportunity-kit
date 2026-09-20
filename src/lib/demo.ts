import type { AnalyzeResult } from "./types";

export function demoResult(mode: "card" | "dig", text: string): AnalyzeResult {
  const snippet =
    text.trim().slice(0, 120) ||
    "Sample review text missing — paste real comments for live analysis.";
  const evidence = text.includes(snippet.slice(0, 40))
    ? text.slice(0, Math.min(160, text.length))
    : snippet;

  return {
    mode,
    title:
      mode === "card"
        ? "Demo sample · Opportunity card"
        : "Demo sample · Demand dig",
    audience: "Early explorers testing Opportunity Kit without an API key",
    pains: [
      {
        claim:
          mode === "card"
            ? "Buyers report friction that might justify a lightweight tool."
            : "Comments hint at unmet workflow pain — treat as sample only.",
        evidence: evidence || "N/A",
        sourceLabel: evidence && text.includes(evidence)
          ? "Input excerpt"
          : "Model paraphrase · not verbatim",
      },
    ],
    verdict: "sample",
    nextSteps: [
      "Set OPENAI_API_KEY for live analysis",
      "Paste 5–20 real reviews or listing copy",
      "Re-run and check that evidence strings appear in your paste",
    ],
    disclaimer:
      "Demo sample — no LLM key configured. Do not treat verdicts or claims as market proof. No sales/UV figures invented.",
  };
}
