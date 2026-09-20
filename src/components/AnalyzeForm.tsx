"use client";

import { FormEvent, useState } from "react";
import type { AnalyzeMode, AnalyzeResult } from "@/lib/types";
import { ResultCard } from "./ResultCard";
import styles from "./kit.module.css";

type Props = {
  mode: AnalyzeMode;
  heading: string;
  lead: string;
  placeholder: string;
};

type ApiOk = AnalyzeResult;
type ApiDemo = { demo: true; result: AnalyzeResult };
type ApiErr = { error?: string };

export function AnalyzeForm({ mode, heading, lead, placeholder }: Props) {
  const [text, setText] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [demo, setDemo] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setDemo(false);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          text,
          ...(hint.trim() ? { hint: hint.trim() } : {}),
        }),
      });
      const data = (await res.json()) as ApiOk | ApiDemo | ApiErr;
      if (!res.ok && res.status !== 503) {
        setError(("error" in data && data.error) || `Request failed (${res.status})`);
        return;
      }
      if (res.status === 503 && data && "demo" in data && data.demo && "result" in data) {
        setDemo(true);
        setResult(data.result);
        return;
      }
      if ("title" in data && "pains" in data) {
        setResult(data as AnalyzeResult);
        return;
      }
      setError("Unexpected response");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>{heading}</h1>
      <p className={styles.lead}>{lead}</p>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.label}>
          Paste reviews / listing copy
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            rows={10}
            required
            minLength={40}
          />
        </label>
        <label className={styles.label}>
          Optional hint (category / ASIN / URL as text only)
          <input
            className={styles.input}
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="e.g. kitchen gadgets · B0XXXX"
          />
        </label>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Analyzing…" : mode === "card" ? "Build opportunity card" : "Dig demands"}
        </button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}
      {demo ? (
        <p className={styles.banner}>Demo sample — OPENAI_API_KEY missing or LLM unavailable (HTTP 503).</p>
      ) : null}
      {result ? <ResultCard result={result} /> : null}
    </div>
  );
}
