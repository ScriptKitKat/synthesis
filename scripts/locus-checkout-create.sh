#!/usr/bin/env bash
# locus-checkout-create.sh — Create a Locus checkout session to accept USDC payment for a research briefing
# Usage: ./locus-checkout-create.sh "<topic>" <amount_usdc>
#
# Signal Scout creates a checkout session so a human can pay USDC to fund a research session.
# Once paid, Signal Scout runs the research and delivers the briefing.
# This closes the loop: Signal Scout both EARNS (via Locus Checkout) and SPENDS (via Locus wallet).

set -euo pipefail

TOPIC="${1:-}"
AMOUNT="${2:-0.50}"

if [ -z "$TOPIC" ]; then
  echo "Usage: $0 \"<research topic>\" [amount_usdc]" >&2
  echo "Example: $0 \"Solana DeFi\" 0.50" >&2
  exit 1
fi

API_KEY="${LOCUS_API_KEY:-$(jq -r '.apiKey' ~/.config/locus/credentials.json 2>/dev/null)}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: No Locus API key found." >&2
  exit 1
fi

DESCRIPTION="Signal Scout Research Briefing: $TOPIC"

RESPONSE=$(curl -s -X POST "https://beta-api.paywithlocus.com/api/checkout/sessions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": \"$AMOUNT\",
    \"description\": $(echo "$DESCRIPTION" | jq -Rs .),
    \"metadata\": {
      \"topic\": $(echo "$TOPIC" | jq -Rs .),
      \"budget_usdc\": \"$AMOUNT\",
      \"agent\": \"Signal Scout\",
      \"powered_by\": \"Locus\"
    },
    \"receiptConfig\": {
      \"enabled\": true,
      \"fields\": {
        \"creditorName\": \"Signal Scout\",
        \"supportEmail\": \"priscilla.ye@gmail.com\",
        \"lineItems\": [
          {\"description\": $(echo "Research Briefing: $TOPIC" | jq -Rs .), \"amount\": \"$AMOUNT\"}
        ]
      }
    }
  }")

echo "$RESPONSE" | jq .

SESSION_ID=$(echo "$RESPONSE" | jq -r '.data.id // empty')
CHECKOUT_URL=$(echo "$RESPONSE" | jq -r '.data.checkoutUrl // empty')

if [ -n "$SESSION_ID" ]; then
  echo ""
  echo "✅ Checkout session created!"
  echo "   Session ID:   $SESSION_ID"
  echo "   Amount:       $AMOUNT USDC"
  echo "   Topic:        $TOPIC"
  echo "   Payment URL:  $CHECKOUT_URL"
  echo ""
  echo "Share the payment URL with your customer. Once paid, run:"
  echo "   ./locus-checkout-poll.sh \"$SESSION_ID\""
fi
