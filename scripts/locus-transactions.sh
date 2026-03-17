#!/usr/bin/env bash
# locus-transactions.sh — Fetch recent Locus transaction history
# Usage: ./locus-transactions.sh [limit] [status]

set -euo pipefail

LIMIT="${1:-20}"
STATUS="${2:-}"

API_KEY="${LOCUS_API_KEY:-$(jq -r '.apiKey' ~/.config/locus/credentials.json 2>/dev/null)}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: No Locus API key found." >&2
  exit 1
fi

QUERY="limit=$LIMIT"
if [ -n "$STATUS" ]; then
  QUERY="$QUERY&status=$STATUS"
fi

curl -s "https://beta-api.paywithlocus.com/api/pay/transactions?$QUERY" \
  -H "Authorization: Bearer $API_KEY"
