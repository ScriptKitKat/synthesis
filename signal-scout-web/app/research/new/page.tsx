"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SUGGESTED_TOPICS = [
  "Solana DeFi",
  "AI Agent Tokens",
  "Ethereum L2 Updates",
  "Bitcoin ETF Flows",
  "RWA Tokenization",
  "Base Ecosystem",
];

export default function NewResearch() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [budget, setBudget] = useState(0.1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), budget }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        // Redirect to Locus checkout
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback: go to session page
        router.push(`/research/${data.id}`);
      }
    } catch (err) {
      setError("Failed to submit research request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">New Research</h1>
      <p className="text-scout-muted mb-10">
        Choose a topic and budget. The agent will search, scrape, and analyze —
        paying for each data source in USDC.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Topic */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Research Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Solana DeFi latest developments"
            className="w-full bg-scout-surface border border-scout-border rounded-xl px-4 py-3 text-scout-text placeholder:text-scout-muted/50 focus:outline-none focus:border-scout-accent/50 transition-colors font-mono"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTED_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className="text-xs px-3 py-1.5 rounded-lg border border-scout-border text-scout-muted hover:border-scout-accent/30 hover:text-scout-accent transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Budget (USDC)
          </label>
          <div className="bg-scout-surface border border-scout-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl font-mono font-bold text-scout-accent">
                ${budget.toFixed(2)}
              </span>
              <span className="text-sm text-scout-muted font-mono">
                ~{Math.floor(budget / 0.01)} API calls
              </span>
            </div>
            <input
              type="range"
              min={0.05}
              max={2.0}
              step={0.05}
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              className="w-full accent-scout-accent"
            />
            <div className="flex justify-between text-xs text-scout-muted mt-2 font-mono">
              <span>$0.05</span>
              <span>$1.00</span>
              <span>$2.00</span>
            </div>
          </div>
          <div className="mt-3 text-sm text-scout-muted">
            💡 Each search costs ~$0.01. Each page scrape costs ~$0.01. The
            agent will optimize within your budget.
          </div>
        </div>

        {/* Budget breakdown estimate */}
        <div className="bg-scout-surface border border-scout-border rounded-xl p-5">
          <h3 className="text-sm font-medium mb-3">Estimated Breakdown</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-scout-muted">Searches (Exa)</span>
              <span>
                ~{Math.min(3, Math.floor(budget / 0.03))} queries × $0.01
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-scout-muted">Scrapes (Firecrawl)</span>
              <span>
                ~{Math.floor((budget * 0.7) / 0.01)} pages × $0.01
              </span>
            </div>
            <div className="flex justify-between border-t border-scout-border pt-2 font-bold">
              <span>Max spend</span>
              <span className="text-scout-accent">${budget.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full bg-scout-accent text-scout-bg py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all glow-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Submitting...
            </span>
          ) : (
            `Start Research — $${budget.toFixed(2)} USDC`
          )}
        </button>
      </form>
    </div>
  );
}
