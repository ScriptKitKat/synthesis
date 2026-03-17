# Signal Scout 🔍

> Your autonomous crypto research analyst — powered by AI and real USDC payments.

**Hackathon:** The Synthesis · **Track:** Best use of Locus · **Theme:** Agents that Pay

---

## What It Does

Give Signal Scout a crypto topic (like "Solana DeFi" or "AI tokens") and a USDC budget. It will:

1. **Search** the web using Exa semantic search — paying per call
2. **Scrape** the most relevant articles via Firecrawl — paying per page
3. **Analyze** and synthesize key signals, risks, and catalysts
4. **Deliver** a structured intelligence briefing
5. **Log** every decision for full transparency

All API calls are paid automatically from Signal Scout's Locus wallet in real USDC on Base. The agent tracks its own spending and stops when the budget runs out.

## Why It's Interesting

Most AI research tools hide their costs. Signal Scout makes them visible and real. Every search query and scraped article has a price tag, and the agent has to decide if it's worth paying. That constraint produces smarter, more focused research.

## Project Structure

```
signal-scout/
├── skill/
│   └── SKILL.md               # Agent instructions
├── scripts/
│   ├── locus-balance.sh        # Check wallet balance
│   ├── locus-search.sh         # Search via Exa (through Locus)
│   ├── locus-scrape.sh         # Scrape via Firecrawl (through Locus)
│   └── locus-transactions.sh   # Transaction history
├── data/
│   ├── budget.json             # Session spend tracking
│   └── source-scores.json      # Source quality history
├── logs/
│   └── agent_log.json          # Full decision audit log
├── status-network/             # Side quest — on-chain report verification
│   ├── SimpleStorage.sol
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
# "Research 'AI tokens Q1 2026' with a $0.50 budget"
```

## Tech Stack

- **Payments:** [Locus](https://paywithlocus.com) — USDC on Base
- **Search:** Exa (via Locus wrapped API)
- **Scraping:** Firecrawl (via Locus wrapped API)
- **Analysis:** Claude (native)
- **On-chain verification:** Base + Solidity

## Agent Identity

- **Name:** Signal Scout (alias: Cleo)
- **Wallet:** `0x063d6623e61de8e02ddb0ea75c26ae2282b98fa9`
- **Chain:** Base
- **Default budget:** $0.50 USDC per session

---

Built at The Synthesis hackathon 🏗️
