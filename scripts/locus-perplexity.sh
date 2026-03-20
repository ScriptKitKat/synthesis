#!/usr/bin/env bash
# locus-perplexity.sh — AI-synthesized research via Perplexity Sonar (real-time web search + analysis)
# Usage: ./locus-perplexity.sh "<research question>" [recency: hour|day|week|month]
#
# Perplexity searches the web AND synthesizes an answer with citations.
# This replaces the search→scrape→analyze loop with a single intelligent call.
# Cost: ~$0.005–$0.02 per call (model-dependent)

set -euo pipefail

QUERY="${1:-}"
RECENCY="${2:-week}"

if [ -z "$QUERY" ]; then
  echo "Usage: $0 \"<research question>\" [hour|day|week|month]" >&2
  echo "Example: $0 \"What are the latest Solana DeFi trends?\" day" >&2
  exit 1
fi

API_KEY="${LOCUS_API_KEY:-$(jq -r '.apiKey' ~/.config/locus/credentials.json 2>/dev/null)}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: No Locus API key found." >&2
  exit 1
fi

curl -s -X POST "https://beta-api.paywithlocus.com/api/wrapped/perplexity/chat" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"sonar\",
    \"messages\": [
      {
        \"role\": \"system\",
        \"content\": \"You are a crypto research analyst. Provide concise, fact-dense answers with specific data points, prices, and developments. Always cite sources. Focus on actionable signals.\"
      },
      {
        \"role\": \"user\",
        \"content\": $(echo "$QUERY" | jq -Rs .)
      }
    ],
    \"search_recency_filter\": \"$RECENCY\",
    \"return_related_questions\": false,
    \"max_tokens\": 1024
  }"
