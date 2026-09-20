import { demoResult } from "./demo";
import { enforceEvidence } from "./evidence";
import type { AnalyzeBody, AnalyzeResult, Verdict } from "./types";

const SYSTEM = `You are Opportunity Kit, a careful product-research assistant.
Return ONLY valid JSON matching this schema:
{
  "mode": "card"|"dig",
  "title": string,
  "audience": string,
  "pains": [{"claim": string, "evidence": string, "sourceLabel": string}],
  "verdict": "go"|"hold"|"kill"|"sample",
  "nextSteps": string[],
  "disclaimer": string
}
Rules:
- Every pains[].evidence MUST be a verbatim contiguous substring copied from the user TEXT. If you cannot quote, put a short paraphrase in evidence and set sourceLabel to exactly "Model paraphrase · not verbatim".
- Never invent sales, UV, conversion rates, revenue, or rankings.
- mode "card": decide if worth building (go/hold/kill). mode "dig": cluster demands; hold means keep probing.
- disclaimer must say what is inferred vs quoted.
- English only.`;

function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function baseUrl() {
  return (
    process.env.OPENAI_BASE_URL?.trim() ||
    process.env.OPENAI_API_BASE?.trim() ||
    "https://api.openai.com/v1"
  );
}

function model() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

export async function runAnalyze(
  body: AnalyzeBody,
): Promise<{ status: 200 | 503; payload: AnalyzeResult | { demo: true; result: AnalyzeResult } }> {
  if (!hasOpenAIKey()) {
    const result = demoResult(body.mode, body.text);
    return { status: 503, payload: { demo: true, result } };
  }

  const user = [
    `mode: ${body.mode}`,
    body.hint ? `hint: ${body.hint}` : null,
    "TEXT:",
    body.text,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch(`${baseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!.trim()}`,
    },
    body: JSON.stringify({
      model: model(),
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const result = demoResult(body.mode, body.text);
    result.disclaimer =
      `LLM call failed (${res.status}). Falling back to demo sample. ` +
      result.disclaimer;
    return { status: 503, payload: { demo: true, result } };
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = data.choices?.[0]?.message?.content ?? "{}";
  let parsed: Partial<AnalyzeResult>;
  try {
    parsed = JSON.parse(raw) as Partial<AnalyzeResult>;
  } catch {
    const result = demoResult(body.mode, body.text);
    result.disclaimer = "LLM returned non-JSON. Demo sample used. " + result.disclaimer;
    return { status: 503, payload: { demo: true, result } };
  }

  const verdicts: Verdict[] = ["go", "hold", "kill", "sample"];
  const verdict = verdicts.includes(parsed.verdict as Verdict)
    ? (parsed.verdict as Verdict)
    : "hold";

  const result: AnalyzeResult = {
    mode: body.mode,
    title: String(parsed.title || "Untitled opportunity"),
    audience: String(parsed.audience || "Unspecified audience"),
    pains: enforceEvidence(
      body.text,
      Array.isArray(parsed.pains) ? parsed.pains : [],
    ),
    verdict,
    nextSteps: Array.isArray(parsed.nextSteps)
      ? parsed.nextSteps.map(String).slice(0, 8)
      : [],
    disclaimer: String(
      parsed.disclaimer ||
        "Quoted evidence is taken from your paste; other lines may be model inference. No invented sales/UV.",
    ),
  };

  if (!result.pains.length) {
    result.pains = [
      {
        claim: "No pain points extracted — paste richer reviews.",
        evidence: body.text.slice(0, 80),
        sourceLabel: body.text.slice(0, 80)
          ? "Input excerpt"
          : "Model paraphrase · not verbatim",
      },
    ];
    if (!body.text.includes(result.pains[0].evidence)) {
      result.pains[0].sourceLabel = "Model paraphrase · not verbatim";
    }
  }

  return { status: 200, payload: result };
}
