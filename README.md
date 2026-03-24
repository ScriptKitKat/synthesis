# Signal Scout 🔍

> Your autonomous crypto research analyst — powered by AI and real USDC payments.

**Hackathon:** The Synthesis · **Track:** Best use of Locus, Status Network, College.xyz · **Theme:** Agents that Pay

---

## What It Does

Give Signal Scout a crypto topic (like "Solana DeFi" or "AI tokens") and a USDC budget. It will:

1. **Accept payment** via Locus Checkout — the full economic loop starts here
2. **Fetch live market data** from Alpha Vantage (price, sentiment)
3. **Search** the web using Exa semantic search — paying per call
4. **Synthesize** with Perplexity Sonar — AI-grounded web research in one call
5. **Check X/Twitter sentiment** via Grok with live X search
6. **Scrape** the most relevant articles via Firecrawl — paying per page
7. **Verify** every claim with a RAG faithfulness checker before delivery
8. **Deliver** a structured intelligence briefing — only if ≥70% of claims are grounded
9. **Log** every session on-chain to Status Network for an immutable audit trail

All API calls are paid automatically from Signal Scout's Locus wallet in real USDC on Base. The agent tracks its own spending and stops when the budget runs out.

## Why It's Interesting

Most AI research tools hide their costs. Signal Scout makes them visible and real. Every search query, scraped article, and AI inference call has a price tag — and the agent decides if it's worth paying. That constraint produces smarter, more focused research.

Signal Scout also **verifies its own outputs** before delivering them. A RAG faithfulness checker cross-references every factual claim in the briefing against the raw evidence. If fewer than 70% of claims are grounded, the report is blocked and the agent re-researches.

## Project Structure

```
signal-scout/
├── SKILL.md                    # Agent instructions (research loop, faithfulness check, on-chain logging)
├── scripts/
│   ├── locus-balance.sh        # Check wallet balance
│   ├── locus-search.sh         # Search via Exa (through Locus)
│   ├── locus-scrape.sh         # Scrape via Firecrawl (through Locus)
│   ├── locus-transactions.sh   # Transaction history
│   ├── locus-crypto-data.sh    # Live prices + news sentiment via Alpha Vantage
│   ├── locus-perplexity.sh     # AI-synthesized research via Perplexity Sonar
│   ├── locus-grok-xsearch.sh   # Live X/Twitter sentiment via Grok
│   ├── locus-checkout-create.sh# Create Locus checkout session (accept USDC payment)
│   ├── locus-checkout-poll.sh  # Poll until session is paid
│   ├── check-faithfulness.py   # RAG faithfulness checker — verifies claims before delivery
│   ├── hash-briefing.js        # Generate consistent briefing fingerprint
│   └── log-to-chain.js         # Log briefing to Status Network (gasless)
├── signal-scout-web/           # Next.js web app with Locus Checkout integration
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── research/new/       # Research request form + embedded Locus Checkout
│   │   ├── research/[id]/      # Session page (status, briefing, on-chain links)
│   │   └── api/
│   │       ├── research/       # Create session + Locus checkout, post results
│   │       └── checkout/       # Webhook handler (payment confirmation)
│   └── prisma/schema.prisma    # SQLite DB: users, research sessions
├── data/
│   ├── budget.json             # Session spend tracking
│   └── source-scores.json      # Source quality history (avoid low-signal domains)
├── logs/
│   ├── agent_log.json          # Full decision audit log (with faithfulness metadata)
│   └── chain_log.json          # On-chain logging receipts
├── status-network/
│   ├── SimpleStorage.sol       # Solidity contract for on-chain report verification
│   └── README.md
├── agent.json                  # Agent identity manifest
└── README.md                   # You are here
```

## Quick Start

```bash
# 1. Set your API key
export LOCUS_API_KEY="your_key_here"

# 2. Check your balance
./scripts/locus-balance.sh

# 3. Run a research session (via your AI assistant)
# "Research 'Ethereum L2 updates' with a $0.05 budget"
```

## Web App

The `signal-scout-web/` directory is a Next.js app that provides a UI for requesting research sessions and paying via Locus Checkout.

**Flow:**
1. User visits `/research/new` → picks topic + budget
2. Clicks "Start Research" → app creates a Locus checkout session
3. **`<LocusCheckout>` component renders inline** — user pays with Locus Wallet, external wallet, or crypto
4. Payment confirmed → webhook fires → session marked `running`
5. Agent runs research, posts briefing to `/api/research/complete`
6. User sees briefing at `/research/[id]` with on-chain TX links

## RAG Faithfulness Check

Every briefing goes through `scripts/check-faithfulness.py` before delivery:

```bash
python3 scripts/check-faithfulness.py /tmp/draft.md /tmp/evidence.txt
```

- Extracts every factual claim from Key Signals and Risks sections
- Verifies each claim against the raw evidence via stateless LLM calls (temperature=0)
- **Exit 0** (≥70% verified) → ALLOW — deliver the report
- **Exit 1** (50–69%) → WARN — deliver with warning banner
- **Exit 2** (<50%) → BLOCK — re-research unverified claims, then re-run

Faithfulness metadata is logged to `agent_log.json` for every session.

**Latest result:** 12/12 claims verified (100% grounded) on Ethereum L2 report ✅

## On-Chain Logging

After every briefing, Signal Scout logs the session to Status Network (gasless):

```bash
HASH=$(node scripts/hash-briefing.js "Solana DeFi" 17)
node scripts/log-to-chain.js "Solana DeFi" "$HASH" 17
```

The transaction calldata encodes `signal-scout|topic|hash|cents` — no contract needed. Every session is permanently verifiable on-chain.

**Contract:** `0x7de86Ef7A78C4128a964c0defC39D05d740306f2` (Status Network testnet)
**Total sessions logged:** 5+

## Tech Stack

| Layer | Provider | Paid via |
|-------|----------|---------|
| Payments | [Locus](https://paywithlocus.com) | USDC on Base |
| Market data | Alpha Vantage | Locus wrapped API |
| AI research | Perplexity Sonar | Locus wrapped API |
| Social sentiment | Grok + X Search | Locus wrapped API |
| Web search | Exa | Locus wrapped API |
| Web scraping | Firecrawl | Locus wrapped API |
| Live prices | CoinGecko | Locus wrapped API |
| On-chain logging | Status Network | Gasless |
| Web app | Next.js + Prisma | — |
| Checkout UI | @withlocus/checkout-react | — |

## Agent Identity

- **Name:** Signal Scout (alias: Cleo)
- **Wallet:** `0x063d6623e61de8e02ddb0ea75c26ae2282b98fa9`
- **Chain:** Base
- **Default budget:** $0.50 USDC per session

---

Built at The Synthesis hackathon 🏗️
