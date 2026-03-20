#!/usr/bin/env bash
# locus-crypto-data.sh — Fetch live crypto data via Alpha Vantage through Locus (pay-per-call)
# Usage:
#   ./locus-crypto-data.sh price <SYMBOL>       — Realtime exchange rate (e.g. SOL, BTC, ETH)
#   ./locus-crypto-data.sh sentiment <TOPIC>    — News sentiment (e.g. "blockchain,financial_markets")
#   ./locus-crypto-data.sh daily <SYMBOL>       — Daily OHLCV price history
#
# Each call costs ~$0.008 USDC from the Locus wallet (Alpha Vantage via Locus wrapped API).
# This is the "deepest" Locus integration — paying a real data provider per call, autonomously.

set -euo pipefail

MODE="${1:-}"
ARG="${2:-}"

if [ -z "$MODE" ] || [ -z "$ARG" ]; then
  echo "Usage: $0 <price|sentiment|daily> <symbol_or_topic>" >&2
  exit 1
fi

API_KEY="${LOCUS_API_KEY:-$(jq -r '.apiKey' ~/.config/locus/credentials.json 2>/dev/null)}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: No Locus API key found." >&2
  exit 1
fi

case "$MODE" in
  price)
    # Realtime crypto exchange rate — ~$0.008
    curl -s -X POST "https://beta-api.paywithlocus.com/api/wrapped/alphavantage/crypto-exchange-rate" \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"from_currency\": $(echo "$ARG" | jq -Rs .), \"to_currency\": \"USD\"}"
    ;;

  sentiment)
    # News sentiment for crypto topics — ~$0.008
    # ARG can be tickers like "CRYPTO:SOL" or topics like "blockchain,financial_markets"
    curl -s -X POST "https://beta-api.paywithlocus.com/api/wrapped/alphavantage/news-sentiment" \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"topics\": $(echo "$ARG" | jq -Rs .), \"sort\": \"LATEST\", \"limit\": 10}"
    ;;

  daily)
    # Daily OHLCV price history for a crypto — ~$0.008
    curl -s -X POST "https://beta-api.paywithlocus.com/api/wrapped/alphavantage/digital-currency-daily" \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"symbol\": $(echo "$ARG" | jq -Rs .), \"market\": \"USD\"}"
    ;;

  *)
    echo "ERROR: Unknown mode '$MODE'. Use: price | sentiment | daily" >&2
    exit 1
    ;;
esac
