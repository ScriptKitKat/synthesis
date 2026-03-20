#!/usr/bin/env bash
# locus-checkout-poll.sh — Poll a Locus checkout session until paid, then trigger research
# Usage: ./locus-checkout-poll.sh <session_id> [max_wait_seconds]
#
# Polls every 5 seconds until the session is PAID, EXPIRED, or CANCELLED.
# When paid, prints the transaction details and signals that research can begin.

set -euo pipefail

SESSION_ID="${1:-}"
MAX_WAIT="${2:-300}"   # default 5 minute timeout

if [ -z "$SESSION_ID" ]; then
  echo "Usage: $0 <session_id> [max_wait_seconds]" >&2
  exit 1
fi

API_KEY="${LOCUS_API_KEY:-$(jq -r '.apiKey' ~/.config/locus/credentials.json 2>/dev/null)}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: No Locus API key found." >&2
  exit 1
fi

echo "⏳ Polling checkout session $SESSION_ID (timeout: ${MAX_WAIT}s)..."
echo ""

ELAPSED=0
POLL_INTERVAL=5

while [ $ELAPSED -lt $MAX_WAIT ]; do
  RESPONSE=$(curl -s "https://beta-api.paywithlocus.com/api/checkout/sessions/$SESSION_ID" \
    -H "Authorization: Bearer $API_KEY")

  STATUS=$(echo "$RESPONSE" | jq -r '.data.status // "UNKNOWN"')
  AMOUNT=$(echo "$RESPONSE" | jq -r '.data.amount // "?"')
  DESCRIPTION=$(echo "$RESPONSE" | jq -r '.data.description // "?"')
  TOPIC=$(echo "$RESPONSE" | jq -r '.data.metadata.topic // "?"')

  case "$STATUS" in
    PAID)
      echo "✅ PAID! Session $SESSION_ID"
      echo "   Topic:   $TOPIC"
      echo "   Amount:  $AMOUNT USDC"
      echo ""
      echo "🔬 Payment confirmed — Signal Scout is authorized to begin research."
      echo "   Run: ./locus-search.sh \"$TOPIC\" to start the briefing."
      exit 0
      ;;
    EXPIRED)
      echo "❌ Session expired. Create a new checkout session."
      exit 1
      ;;
    CANCELLED)
      echo "❌ Session cancelled."
      exit 1
      ;;
    PENDING)
      echo "   [$ELAPSED s] Waiting for payment... (status: PENDING)"
      ;;
    *)
      echo "   [$ELAPSED s] Status: $STATUS"
      ;;
  esac

  sleep $POLL_INTERVAL
  ELAPSED=$((ELAPSED + POLL_INTERVAL))
done

echo "⏰ Timeout reached after ${MAX_WAIT}s. Session may still be pending."
exit 1
