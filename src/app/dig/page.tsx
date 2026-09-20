import { AnalyzeForm } from "@/components/AnalyzeForm";

export const metadata = {
  title: "Demand dig · Opportunity Kit",
  description: "Cluster buyer pains from comments with verbatim evidence quotes.",
};

export default function DigPage() {
  return (
    <AnalyzeForm
      mode="dig"
      heading="Demand dig"
      lead="Hear demand from comments. Evidence must be substrings of your paste; paraphrases are labeled."
      placeholder="Paste a stack of comments or Q&A (40+ characters)…"
    />
  );
}
