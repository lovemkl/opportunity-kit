# Opportunity Kit

One Next.js app, two doors:

| Path | Purpose |
|------|---------|
| `/card` | Opportunity card — is it worth building? |
| `/dig` | Demand dig — cluster pains from comments |

Both call **`POST /api/analyze`**.

## Rules
- `pains[].evidence` must be a contiguous substring of the pasted text; otherwise `sourceLabel` becomes `Model paraphrase · not verbatim`.
- Never invent sales / UV / conversion numbers.
- No payments.
- Without `OPENAI_API_KEY`, API returns **503** `{ "demo": true, "result": … }` with `verdict: "sample"`.

## Local run

```bash
npm install
cp .env.example .env.local   # optional: set OPENAI_API_KEY
npm run dev
```

Open http://localhost:3000/card or `/dig`.

```bash
npm run build && npm start
```

## Env
| Var | Required | Notes |
|-----|----------|-------|
| `OPENAI_API_KEY` | for live LLM | missing → demo 503 |
| `OPENAI_BASE_URL` | no | default `https://api.openai.com/v1` |
| `OPENAI_MODEL` | no | default `gpt-4o-mini` |

Day-1 rate limit: **5 requests / IP / day** (in-memory stub).
