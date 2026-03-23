#!/usr/bin/env python3
"""
check-faithfulness.py — RAG faithfulness checker for Signal Scout reports

Usage:
  python3 scripts/check-faithfulness.py <report_file> <evidence_file>

Extracts factual claims from Key Signals and Risks sections, then verifies
each against the evidence via isolated LLM calls through the OpenClaw gateway's
OpenAI-compatible chat completions endpoint (temperature=0, stateless, no prior
context). Model routing is handled by OpenClaw — no provider config needed.

Outputs the annotated report to stdout and faithfulness metadata JSON to
stderr after the ---FAITHFULNESS_JSON--- marker.

Exit codes:
  0 = Faithful           (>= 70% verified) — ALLOW
  1 = Partially Faithful (50–69% verified) — WARN
  2 = Unfaithful         (< 50% verified)  — BLOCK
"""

import json
import re
import sys
import urllib.request
from pathlib import Path


def load_gateway_config():
    config_path = Path.home() / ".openclaw" / "openclaw.json"
    with open(config_path) as f:
        config = json.load(f)
    gw = config["gateway"]
    return {
        "port": gw.get("port", 18789),
        "token": gw["auth"]["token"],
    }


def check_claim(claim, evidence, gw):
    """Single stateless LLM call via the OpenClaw chat completions endpoint."""
    prompt = (
        f"Evidence:\n{evidence}\n\n"
        f"Claim:\n{claim}\n\n"
        "Is the Claim directly stated or clearly implied by the Evidence? "
        'Reply with JSON only: {"verdict": "YES"} or {"verdict": "NO"}'
    )
    payload = json.dumps({
        "model": "openclaw",
        "temperature": 0,
        "max_tokens": 10,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()

    req = urllib.request.Request(
        f"http://127.0.0.1:{gw['port']}/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {gw['token']}",
            "Content-Type": "application/json",
            "x-openclaw-agent-id": "main",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
        content = data["choices"][0]["message"]["content"].strip()
        # Strip markdown code fences if present
        content = re.sub(r"^```(?:json)?\s*|\s*```$", "", content).strip()
        return json.loads(content).get("verdict") == "YES"
    except Exception as e:
        print(f"  WARNING: LLM call failed ({e}), treating as UNVERIFIED", file=sys.stderr)
        return False


def extract_claims(report_text):
    claims = []
    in_section = False
    for line in report_text.splitlines():
        if re.match(r"^### (Key Signals|Risks)", line):
            in_section = True
            continue
        if re.match(r"^### ", line):
            in_section = False
        if in_section and line.startswith("- "):
            claim = line[2:].strip().replace(" [UNVERIFIED]", "")
            if claim:
                claims.append(claim)
    return claims


def annotate_report(report_text, unverified_set):
    lines = report_text.splitlines()
    result = []
    for line in lines:
        if line.startswith("- "):
            claim = line[2:].strip().replace(" [UNVERIFIED]", "")
            if claim in unverified_set:
                line = f"- {claim} [UNVERIFIED]"
        result.append(line)
    return "\n".join(result)


def add_faithfulness_header(report_text, verified, total, classification):
    pct = round(verified * 100 / total) if total > 0 else 100
    faith_line = (
        f"**Faithfulness:** {verified}/{total} claims verified "
        f"({pct}% grounded) — {classification}"
    )
    lines = report_text.splitlines()
    result = []
    for line in lines:
        result.append(line)
        if line.startswith("**Budget used:**"):
            result.append(faith_line)
    return "\n".join(result)


def main():
    if len(sys.argv) < 3:
        print(
            "Usage: python3 scripts/check-faithfulness.py <report_file> <evidence_file>",
            file=sys.stderr,
        )
        sys.exit(1)

    report_file = Path(sys.argv[1])
    evidence_file = Path(sys.argv[2])

    if not report_file.exists():
        print(f"ERROR: Report file not found: {report_file}", file=sys.stderr)
        sys.exit(1)
    if not evidence_file.exists():
        print(f"ERROR: Evidence file not found: {evidence_file}", file=sys.stderr)
        sys.exit(1)

    report_text = report_file.read_text()
    evidence_text = evidence_file.read_text()[:3000]

    gw = load_gateway_config()
    claims = extract_claims(report_text)

    if not claims:
        print("WARNING: No claims found in Key Signals or Risks sections.", file=sys.stderr)
        Path("/tmp/signal-scout-final.md").write_text(report_text)
        print(report_text)
        meta = {
            "verified": 0, "total": 0, "ratio": 1.0,
            "classification": "Faithful", "action": "ALLOW", "unverified_claims": [],
        }
        print("\n---FAITHFULNESS_JSON---", file=sys.stderr)
        print(json.dumps(meta, indent=2), file=sys.stderr)
        sys.exit(0)

    print(f"Checking {len(claims)} claims against evidence...", file=sys.stderr)

    verified_count = 0
    unverified_claims = []

    for i, claim in enumerate(claims, 1):
        print(f"  [{i}/{len(claims)}] {claim[:70]}", file=sys.stderr)
        if check_claim(claim, evidence_text, gw):
            verified_count += 1
            print("    -> VERIFIED", file=sys.stderr)
        else:
            unverified_claims.append(claim)
            print("    -> UNVERIFIED", file=sys.stderr)

    total = len(claims)
    ratio = verified_count / total if total > 0 else 1.0
    pct = round(ratio * 100)

    if pct >= 70:
        classification, action, exit_code = "Faithful", "ALLOW", 0
    elif pct >= 50:
        classification, action, exit_code = "Partially Faithful", "WARN", 1
    else:
        classification, action, exit_code = "Unfaithful", "BLOCK", 2

    annotated = annotate_report(report_text, set(unverified_claims))
    annotated = add_faithfulness_header(annotated, verified_count, total, classification)

    if action == "WARN":
        warning = (
            f"\n> **WARNING: Partially Faithful** — {verified_count}/{total} claims verified. "
            "Treat unverified claims with caution.\n"
        )
        annotated = annotated.replace(
            "## Signal Scout Report:",
            warning + "## Signal Scout Report:",
            1,
        )

    final_path = Path("/tmp/signal-scout-final.md")
    final_path.write_text(annotated)

    print(annotated)

    meta = {
        "verified": verified_count,
        "total": total,
        "ratio": round(ratio, 2),
        "classification": classification,
        "action": action,
        "unverified_claims": unverified_claims,
    }
    print("\n---FAITHFULNESS_JSON---", file=sys.stderr)
    print(json.dumps(meta, indent=2), file=sys.stderr)

    if action == "BLOCK":
        print(
            f"\nERROR: Report is UNFAITHFUL ({pct}% verified < 50%). "
            "Do not deliver. Re-run targeted research for the unverified claims.",
            file=sys.stderr,
        )

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
