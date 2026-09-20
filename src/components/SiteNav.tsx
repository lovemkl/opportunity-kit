import Link from "next/link";
import styles from "./nav.module.css";

export function SiteNav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.brand}>
        Opportunity Kit
      </Link>
      <div className={styles.links}>
        <Link href="/card">Card</Link>
        <Link href="/dig">Dig</Link>
      </div>
    </nav>
  );
}
