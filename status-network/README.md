# Status Network Side Quest

Signal Scout stores a hash of each completed research report on-chain via `SimpleStorage.sol`, deployed on Base.

## Why

Every report Signal Scout generates gets a keccak256 hash (or IPFS CID). That hash is written to the contract, creating an immutable, timestamped proof of:

- What topic was researched
- What the report contained
- When it was generated

This makes Signal Scout's outputs **verifiable and auditable** — not just by the human who paid for them, but by anyone.

## Contract

- **File:** `SimpleStorage.sol`
- **Network:** Base (mainnet or testnet)
- **Deployer:** Signal Scout's Locus wallet (`0x063d6623e61de8e02ddb0ea75c26ae2282b98fa9`)

## Deploy

```bash
# Using Foundry
forge create SimpleStorage.sol:SimpleStorage \
  --rpc-url https://mainnet.base.org \
  --private-key $OWNER_PRIVATE_KEY
```

## Usage

After generating a report, store its hash:

```bash
# Generate hash of report
HASH=$(echo -n "$REPORT_CONTENT" | sha256sum | awk '{print $1}')

# Store on-chain
cast send $CONTRACT_ADDRESS "storeReport(string,string)" \
  "Solana DeFi" "0x$HASH" \
  --rpc-url https://mainnet.base.org \
  --private-key $OWNER_PRIVATE_KEY
```

## Read Latest Report

```bash
cast call $CONTRACT_ADDRESS "getLatestReport()" \
  --rpc-url https://mainnet.base.org
```
