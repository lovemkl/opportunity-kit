import { AnalyzeForm } from "@/components/AnalyzeForm";

export const metadata = {
  title: "Opportunity card · Opportunity Kit",
  description: "Decide if a product idea is worth building from pasted reviews.",
};

export default function CardPage() {
  return (
    <AnalyzeForm
      mode="card"
      heading="Opportunity card"
      lead="Paste listing copy or reviews. Get a go / hold / kill card with quoted evidence — no invented sales or UV."
      placeholder="Paste Amazon/App reviews or product description (40+ characters)…"
    />
  );
}
