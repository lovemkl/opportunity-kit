import { NextRequest, NextResponse } from "next/server";
import { runAnalyze } from "@/lib/analyze";
import { checkIpLimit } from "@/lib/rate-limit";
import type { AnalyzeMode } from "@/lib/types";

export const runtime = "nodejs";

const MIN_LEN = 40;

function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  let body: { mode?: string; text?: string; hint?: string };
  try {
    body = (await req.json()) as { mode?: string; text?: string; hint?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const mode = body.mode;
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const hint = typeof body.hint === "string" ? body.hint.trim() : undefined;

  if (mode !== "card" && mode !== "dig") {
    return NextResponse.json(
      { error: "mode must be 'card' or 'dig'" },
      { status: 400 },
    );
  }
  if (text.length < MIN_LEN) {
    return NextResponse.json(
      { error: `text too short (min ${MIN_LEN} chars)` },
      { status: 400 },
    );
  }

  const limit = checkIpLimit(clientIp(req));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Daily limit reached (demo: 5/IP)", retryAfter: limit.retryAfter },
      { status: 429 },
    );
  }

  try {
    const { status, payload } = await runAnalyze({
      mode: mode as AnalyzeMode,
      text,
      hint,
    });
    return NextResponse.json(payload, { status });
  } catch (err) {
    console.error("analyze failed", err);
    return NextResponse.json({ error: "Analyze failed" }, { status: 500 });
  }
}
