export type AnalyzeMode = "card" | "dig";
export type Verdict = "go" | "hold" | "kill" | "sample";

export type Pain = {
  claim: string;
  evidence: string;
  sourceLabel: string;
};

export type AnalyzeResult = {
  mode: AnalyzeMode;
  title: string;
  audience: string;
  pains: Pain[];
  verdict: Verdict;
  nextSteps: string[];
  disclaimer: string;
};

export type AnalyzeBody = {
  mode: AnalyzeMode;
  text: string;
  hint?: string;
};
