"use client";

import { useState } from "react";

const TOPICS = [
  "Solana DeFi",
  "AI tokens",
  "Stablecoins",
  "Bitcoin ETFs",
  "Ethereum L2s",
  "DePIN",
];

const BUDGETS = [
  { label: "$0.10", value: 0.1 },
  { label: "$0.25", value: 0.25 },
  { label: "$0.50", value: 0.5 },
  { label: "$1.00", value: 1.0 },
];

type Step = "idle" | "creating" | "awaiting_payment" | "paid" | "error";

interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
  amount: number;
  topic: string;
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [budget, setBudget] = useState(0.5);
  const [step, setStep] = useState<Step>("idle");
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [error, setError] = useState("");

  const finalTopic = topic === "custom" ? customTopic : topic;

  async function createCheckout() {
    if (!finalTopic) return;
    setStep("creating");
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: finalTopic, amount: budget }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create session");
      setSession(data);
      setStep("awaiting_payment");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("error");
    }
  }

  async function pollPayment() {
    if (!session) return;
    try {
      const res = await fetch(`/api/checkout/status?sessionId=${session.sessionId}`);
      const data = await res.json();
      if (data.status === "PAID") setStep("paid");
    } catch {
      // keep polling
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero */}
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-block bg-purple-900/40 border border-purple-700 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-6">
          Agents that Pay
        </div>
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
          Signal Scout
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-2">
          Your autonomous crypto research analyst. Pay in USDC, get a structured
          intelligence briefing — every API call funded from the agent's own wallet.
        </p>
        <p className="text-sm text-zinc-600">
          Powered by Locus · Alpha Vantage · Perplexity · Grok · Status Network
        </p>
      </div>

      {/* Form */}
      {step === "idle" && (
        <div className="max-w-lg mx-auto px-6 space-y-6">
          {/* Topic picker */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Research Topic
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    topic === t
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={() => setTopic("custom")}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all col-span-3 ${
                  topic === "custom"
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                Custom topic...
              </button>
            </div>
            {topic === "custom" && (
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Avalanche DeFi, RWA tokenization..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
              />
            )}
          </div>

          {/* Budget picker */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Research Budget (USDC)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BUDGETS.map((b) => (
                <button
                  key={b.value}
                  onClick={() => setBudget(b.value)}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                    budget === b.value
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={createCheckout}
            disabled={!finalTopic}
            className="w-full py-3.5 rounded-xl font-semibold text-base bg-gradient-to-r from-purple-600 to-emerald-600 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Request Briefing — {budget.toFixed(2)} USDC
          </button>

          <p className="text-center text-xs text-zinc-600">
            Payment via Locus Checkout · Funds research on Base · Results delivered in Discord
          </p>
        </div>
      )}

      {/* Creating */}
      {step === "creating" && (
        <div className="text-center py-12 text-zinc-400">
          <div className="text-2xl mb-2">⏳</div>
          Creating checkout session...
        </div>
      )}

      {/* Awaiting payment */}
      {step === "awaiting_payment" && session && (
        <div className="max-w-md mx-auto px-6 text-center space-y-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <div className="text-3xl mb-3">💳</div>
            <h2 className="text-xl font-semibold mb-1">Pay to Start Research</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Topic: <span className="text-white font-medium">{session.topic}</span>
              <br />
              Amount: <span className="text-emerald-400 font-semibold">${session.amount.toFixed(2)} USDC</span>
            </p>
            <a
              href={session.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-emerald-600 hover:opacity-90 transition-all mb-3"
            >
              Pay with Locus →
            </a>
            <button
              onClick={pollPayment}
              className="w-full py-2.5 rounded-xl text-sm border border-zinc-700 text-zinc-400 hover:border-zinc-500 transition-all"
            >
              I've paid — check status
            </button>
          </div>
          <p className="text-xs text-zinc-600">
            Session ID: {session.sessionId}
          </p>
        </div>
      )}

      {/* Paid */}
      {step === "paid" && session && (
        <div className="max-w-md mx-auto px-6 text-center space-y-4">
          <div className="bg-emerald-900/30 border border-emerald-700 rounded-2xl p-6">
            <div className="text-3xl mb-3">✅</div>
            <h2 className="text-xl font-semibold text-emerald-300 mb-2">Payment Confirmed!</h2>
            <p className="text-zinc-400 text-sm">
              Signal Scout is now running your research on{" "}
              <span className="text-white font-medium">{session.topic}</span>.
              Results will appear in Discord shortly.
            </p>
          </div>
          <button
            onClick={() => { setStep("idle"); setSession(null); setTopic(""); }}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Request another briefing
          </button>
        </div>
      )}

      {/* Error */}
      {step === "error" && (
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="bg-red-900/30 border border-red-700 rounded-2xl p-6">
            <div className="text-3xl mb-2">❌</div>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setStep("idle")}
            className="mt-4 text-sm text-zinc-500 hover:text-zinc-300"
          >
            ← Try again
          </button>
        </div>
      )}

      {/* How it works */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h3 className="text-center text-zinc-600 text-xs uppercase tracking-widest mb-8">
          How it works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "💳", title: "Pay in USDC", desc: "Locus Checkout accepts your payment on Base. No account needed." },
            { icon: "🤖", title: "Agent researches", desc: "Signal Scout pays Alpha Vantage, Perplexity, and Grok for live data — from its own wallet." },
            { icon: "⛓️", title: "Logged on-chain", desc: "Every session is logged to Status Network. Immutable audit trail, forever." },
          ].map((item) => (
            <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-zinc-700 text-xs border-t border-zinc-900">
        Built at{" "}
        <a href="https://synthesis.devfolio.co" className="text-purple-700 hover:text-purple-500">
          The Synthesis Hackathon
        </a>{" "}
        · Track: Best use of Locus ·{" "}
        <a href="https://github.com/ScriptKitKat/synthesis" className="text-purple-700 hover:text-purple-500">
          GitHub
        </a>
      </footer>
    </div>
  );
}
