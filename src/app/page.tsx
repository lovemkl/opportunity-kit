import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Opportunity Kit</h1>
      <p className={styles.lead}>
        One codebase, two doors — same <code>/api/analyze</code> engine. English UI.
        No payments. Evidence must come from your paste.
      </p>
      <div className={styles.grid}>
        <Link className={styles.tile} href="/card">
          <strong>/card</strong>
          <span>Should I build this? Go / hold / kill.</span>
        </Link>
        <Link className={styles.tile} href="/dig">
          <strong>/dig</strong>
          <span>What are buyers asking for? Cluster pains.</span>
        </Link>
      </div>
    </main>
  );
}
