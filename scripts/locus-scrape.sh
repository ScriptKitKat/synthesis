#!/usr/bin/env bash
# locus-scrape.sh — Scrape a full webpage via Firecrawl through Locus wrapped API
# Usage: ./locus-scrape.sh "<url>"

set -euo pipefail

URL="${1:-}"

if [ -z "$URL" ]; then
  echo "Usage: $0 \"<url>\"" >&2
  exit 1
fi

API_KEY="${LOCUS_API_KEY:-$(jq -r '.apiKey' ~/.config/locus/credentials.json 2>/dev/null)}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: No Locus API key found." >&2
  exit 1
fi

curl -s -X POST "https://beta-api.paywithlocus.com/api/wrapped/firecrawl/scrape" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": $(echo "$URL" | jq -Rs .),
    \"formats\": [\"markdown\"],
    \"onlyMainContent\": true
  }"
