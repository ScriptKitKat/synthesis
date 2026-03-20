#!/usr/bin/env bash
# locus-grok-xsearch.sh — Crypto Twitter/X sentiment via Grok with live X search
# Usage: ./locus-grok-xsearch.sh "<topic>"
#
# Grok searches live X (Twitter) posts and synthesizes crypto sentiment.
# Uniquely captures real-time social signals that news APIs miss.
# Cost: ~$0.01–$0.50 per call (dynamic, grok-4 required)

set -euo pipefail

TOPIC="${1:-}"

if [ -z "$TOPIC" ]; then
  echo "Usage: $0 \"<crypto topic>\"" >&2
  echo "Example: $0 \"Solana DeFi\"" >&2
  exit 1
fi

API_KEY="${LOCUS_API_KEY:-$(jq -r '.apiKey' ~/.config/locus/credentials.json 2>/dev/null)}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: No Locus API key found." >&2
  exit 1
fi

curl -s -X POST "https://beta-api.paywithlocus.com/api/wrapped/grok/x-search" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"grok-4-0709\",
    \"messages\": [
      {
        \"role\": \"system\",
        \"content\": \"You are a crypto market analyst specializing in social sentiment. Analyze recent X (Twitter) posts about the given topic. Summarize: (1) overall sentiment (bullish/bearish/neutral), (2) top 3-5 specific signals or narratives being discussed, (3) any notable accounts or influencers driving conversation, (4) red flags or FUD. Be concise and data-focused.\"
      },
      {
        \"role\": \"user\",
        \"content\": $(echo "What is the current X/Twitter sentiment and narrative around $TOPIC? What are crypto Twitter influencers saying right now?" | jq -Rs .)
      }
    ],
    \"max_tokens\": 512
  }"
