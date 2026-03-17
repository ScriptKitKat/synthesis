#!/usr/bin/env bash
# locus-search.sh — Semantic search via Exa through Locus wrapped API
# Usage: ./locus-search.sh "<query>" [num_results]

set -euo pipefail

QUERY="${1:-}"
NUM_RESULTS="${2:-5}"

if [ -z "$QUERY" ]; then
  echo "Usage: $0 \"<search query>\" [num_results]" >&2
  exit 1
fi

API_KEY="${LOCUS_API_KEY:-$(jq -r '.apiKey' ~/.config/locus/credentials.json 2>/dev/null)}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: No Locus API key found." >&2
  exit 1
fi

curl -s -X POST "https://beta-api.paywithlocus.com/api/wrapped/exa/search" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": $(echo "$QUERY" | jq -Rs .),
    \"num_results\": $NUM_RESULTS,
    \"type\": \"neural\",
    \"use_autoprompt\": true
  }"
