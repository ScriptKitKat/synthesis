#!/usr/bin/env bash
# locus-balance.sh — Check Locus wallet USDC balance
# Usage: ./locus-balance.sh

set -euo pipefail

API_KEY="${LOCUS_API_KEY:-$(jq -r '.apiKey' ~/.config/locus/credentials.json 2>/dev/null)}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: No Locus API key found. Set LOCUS_API_KEY or store in ~/.config/locus/credentials.json" >&2
  exit 1
fi

curl -s "https://beta-api.paywithlocus.com/api/pay/balance" \
  -H "Authorization: Bearer $API_KEY"
