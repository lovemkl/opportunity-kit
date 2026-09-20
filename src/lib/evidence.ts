import type { Pain } from "./types";

const PARAPHRASE = "Model paraphrase · not verbatim";

/** Ensure each pain.evidence is a substring of input; otherwise flag sourceLabel. */
export function enforceEvidence(text: string, pains: Pain[]): Pain[] {
  return pains.map((p) => {
    const evidence = (p.evidence || "").trim();
    if (!evidence) {
      return {
        ...p,
        evidence: "",
        sourceLabel: PARAPHRASE,
      };
    }
    if (text.includes(evidence)) {
      return {
        ...p,
        evidence,
        sourceLabel: p.sourceLabel?.trim() || "Input excerpt",
      };
    }
    return {
      ...p,
      evidence,
      sourceLabel: PARAPHRASE,
    };
  });
}
