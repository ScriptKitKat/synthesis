export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Hero */}
      <section className="py-24 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-scout-accent/30 bg-scout-accent-dim">
          <span className="text-scout-accent text-sm font-mono font-medium">
            Powered by Locus · USDC on Base
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
          Crypto Research
          <br />
          <span className="text-scout-accent glow-text">That Pays for Itself</span>
        </h1>
        <p className="text-xl text-scout-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          An autonomous AI agent that searches, scrapes, and analyzes crypto
          news — paying for every data source in USDC. Set a topic. Set a
          budget. Get intelligence.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/research/new"
            className="bg-scout-accent text-scout-bg px-8 py-3.5 rounded-xl font-bold text-lg hover:brightness-110 transition-all glow-accent"
          >
            Start Research →
          </a>
          <a
            href="/dashboard"
            className="border border-scout-border text-scout-text px-8 py-3.5 rounded-xl font-medium text-lg hover:bg-scout-surface transition-all"
          >
            View Dashboard
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-scout-border">
        <h2 className="text-3xl font-bold text-center mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Choose Topic",
              desc: "Tell the agent what to research — any crypto topic, protocol, or trend.",
              icon: "🎯",
            },
            {
              step: "02",
              title: "Set Budget",
              desc: "Define how much USDC the agent can spend on data sources.",
              icon: "💰",
            },
            {
              step: "03",
              title: "Agent Researches",
              desc: "The agent searches, scrapes, and analyzes — paying for each API call.",
              icon: "🔍",
            },
            {
              step: "04",
              title: "Get Briefing",
              desc: "Receive a structured intelligence report with full cost transparency.",
              icon: "📡",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-scout-surface border border-scout-border rounded-2xl p-6 hover:border-scout-accent/30 transition-colors"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <div className="text-scout-accent font-mono text-xs mb-2">
                STEP {item.step}
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-scout-muted text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust layers */}
      <section className="py-16 border-t border-scout-border">
        <h2 className="text-3xl font-bold text-center mb-4">
          Three-Layer Audit Trail
        </h2>
        <p className="text-scout-muted text-center mb-16 max-w-xl mx-auto">
          Every decision the agent makes is verifiable — on-chain and off.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Locus Payments",
              desc: "Every API call is a real USDC transaction on Base. View the full spending history.",
              tag: "PAYMENTS",
            },
            {
              title: "Status Network Ledger",
              desc: "Each briefing is fingerprinted and logged on-chain — gasless, free, immutable.",
              tag: "RECEIPTS",
            },
            {
              title: "ERC-8004 Identity",
              desc: "Verified on-chain agent identity with portable reputation history.",
              tag: "IDENTITY",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-scout-surface border border-scout-border rounded-2xl p-6"
            >
              <span className="text-scout-accent font-mono text-xs font-medium px-2 py-1 bg-scout-accent-dim rounded">
                {item.tag}
              </span>
              <h3 className="font-bold text-lg mt-4 mb-2">{item.title}</h3>
              <p className="text-scout-muted text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-scout-border text-center text-scout-muted text-sm">
        <p>
          Built for{" "}
          <a
            href="https://synthesis.md"
            className="text-scout-accent hover:underline"
          >
            The Synthesis Hackathon
          </a>{" "}
          · Powered by{" "}
          <a
            href="https://paywithlocus.com"
            className="text-scout-accent hover:underline"
          >
            Locus
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/your-repo"
            className="text-scout-accent hover:underline"
          >
            Open Source
          </a>
        </p>
      </footer>
    </div>
  );
}
