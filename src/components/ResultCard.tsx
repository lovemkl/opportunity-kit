import type { AnalyzeResult } from "@/lib/types";
import styles from "./kit.module.css";

export function ResultCard({ result }: { result: AnalyzeResult }) {
  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <p className={styles.eyebrow}>
          {result.mode === "card" ? "Opportunity card" : "Demand dig"} ·{" "}
          <strong>{result.verdict.toUpperCase()}</strong>
        </p>
        <h2 className={styles.cardTitle}>{result.title}</h2>
        <p className={styles.muted}>Audience: {result.audience}</p>
      </header>

      <section className={styles.section}>
        <h3>Pains</h3>
        <ul className={styles.painList}>
          {result.pains.map((p, i) => (
            <li key={i} className={styles.painItem}>
              <p className={styles.claim}>{p.claim}</p>
              <blockquote className={styles.evidence}>“{p.evidence}”</blockquote>
              <p className={styles.source}>{p.sourceLabel}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3>Next steps</h3>
        <ol>
          {result.nextSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      <p className={styles.disclaimer}>{result.disclaimer}</p>
    </article>
  );
}
