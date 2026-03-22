export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-end pb-20 pt-32">
        {/* Lime gradient overlay */}
        <div className="absolute inset-0 hero-gradient pointer-events-none" />

        {/* Abstract hero visual — radar/signal graphic */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-60">
          <svg viewBox="0 0 600 400" fill="none" className="w-full h-full">
            <circle cx="300" cy="200" r="150" stroke="#c8ff00" strokeWidth="1" opacity="0.2" />
            <circle cx="300" cy="200" r="100" stroke="#c8ff00" strokeWidth="1" opacity="0.3" />
            <circle cx="300" cy="200" r="50" stroke="#c8ff00" strokeWidth="1.5" opacity="0.5" />
            <circle cx="300" cy="200" r="8" fill="#c8ff00" opacity="0.8" />
            <line x1="300" y1="200" x2="420" y2="120" stroke="#c8ff00" strokeWidth="2" opacity="0.6" />
            <circle cx="420" cy="120" r="4" fill="#c8ff00" />
            <line x1="300" y1="200" x2="200" y2="100" stroke="#c8ff00" strokeWidth="1" opacity="0.3" />
            <circle cx="200" cy="100" r="3" fill="#c8ff00" opacity="0.5" />
            <line x1="300" y1="200" x2="380" y2="280" stroke="#c8ff00" strokeWidth="1" opacity="0.3" />
            <circle cx="380" cy="280" r="3" fill="#c8ff00" opacity="0.5" />
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6">
            Research With
            <br />
            <span className="text-scout-accent display-heading">Meaning</span>
          </h1>
          <p className="text-lg md:text-xl text-scout-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Signal Scout is your AI-driven research agent that searches, analyzes,
            and reports — paying for every data source in USDC, so you get
            intelligence with full cost transparency.
          </p>

          {/* Chat-style input prompt */}
          <div className="max-w-xl mx-auto bg-scout-surface/80 backdrop-blur border border-scout-border rounded-2xl p-4 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-scout-accent animate-pulse" />
              <span className="text-scout-muted text-sm flex-1 text-left">
                What crypto topic are you researching today?
              </span>
              <a
                href="/research/new"
                className="bg-scout-accent text-scout-bg px-4 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all shrink-0"
              >
                Research →
              </a>
            </div>
          </div>

          {/* Partner / integration logos */}
          <div className="flex items-center justify-center gap-8 md:gap-12 opacity-40">
            <span className="font-mono text-xs tracking-widest uppercase">Locus</span>
            <span className="font-mono text-xs tracking-widest uppercase">Base</span>
            <span className="font-mono text-xs tracking-widest uppercase">USDC</span>
            <span className="font-mono text-xs tracking-widest uppercase">Exa</span>
            <span className="font-mono text-xs tracking-widest uppercase">Firecrawl</span>
            <span className="font-mono text-xs tracking-widest uppercase hidden md:block">Status</span>
          </div>
        </div>
      </section>

      {/* ═══════════════ INTRO TEXT ═══════════════ */}
      <section className="py-24 px-6">
        <p className="text-center text-xl md:text-2xl text-scout-muted max-w-3xl mx-auto leading-relaxed">
          Signal Scout combines the precision of autonomous research with the
          transparency of on-chain payments — helping you discover insights,
          track spending, and verify every source.
        </p>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-16 px-6 flex flex-col items-center">
        {/* Flowing connector lines */}
        <div className="my-12 flow-line">
          <svg width="300" height="120" viewBox="0 0 300 120" fill="none" className="mx-auto">
            <path
              d="M30 60 Q80 10 150 60 Q220 110 270 60"
              stroke="#c8ff00"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="30" cy="60" r="5" fill="#c8ff00" />
            <circle cx="150" cy="60" r="5" fill="#c8ff00" />
            <circle cx="270" cy="60" r="5" fill="#c8ff00" />
          </svg>
        </div>

        {/* Large stat display */}
        <div className="text-center">
          <p className="font-mono text-5xl md:text-7xl font-black tracking-tight mb-6">
            40:28:02
          </p>
          <p className="text-scout-muted text-sm font-mono mb-8">Agent Runtime</p>
          <div className="flex items-center justify-center gap-12 md:gap-20">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">220</p>
              <p className="text-scout-muted text-xs font-mono mt-1">Sources Scraped</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">10.58</p>
              <p className="text-scout-muted text-xs font-mono mt-1">USDC Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">108</p>
              <p className="text-scout-muted text-xs font-mono mt-1">Reports Generated</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="section-label block text-center mb-4">Why Signal Scout</span>
          <h2 className="text-4xl md:text-6xl font-black text-center leading-tight mb-4">
            Research That
            <br />
            <span className="text-scout-accent display-heading">Understands</span> You
          </h2>
          <p className="text-scout-muted text-center max-w-2xl mx-auto mb-16">
            Signal Scout is your AI-driven research agent that finds alpha, tracks trends,
            and delivers intelligence — every decision verifiable on-chain.
          </p>

          {/* 3 Feature cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: "AI That Listens",
                desc: "Tell the agent what matters. It tailors research to your exact focus areas.",
                gradient: "from-scout-accent/20 to-transparent",
              },
              {
                title: "Transparent Spending",
                desc: "Every API call is a real USDC transaction on Base. No hidden costs.",
                gradient: "from-blue-500/20 to-transparent",
              },
              {
                title: "Verifiable Reports",
                desc: "Each briefing is fingerprinted on-chain — immutable proof of every finding.",
                gradient: "from-purple-500/20 to-transparent",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative bg-scout-surface rounded-3xl overflow-hidden border border-scout-border hover:border-scout-accent/30 transition-all"
              >
                {/* Card image area */}
                <div className={`h-48 bg-gradient-to-b ${item.gradient} flex items-center justify-center`}>
                  <div className="w-16 h-16 rounded-2xl bg-scout-accent/10 border border-scout-accent/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-scout-accent" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-scout-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DATA VISUALIZATION / RHYTHM ═══════════════ */}
      <section id="how-it-works" className="py-24 px-6 bg-scout-surface/50">
        <div className="max-w-5xl mx-auto">
          <span className="section-label block text-center mb-4">Live Experience</span>
          <h2 className="text-4xl md:text-6xl font-black text-center leading-tight mb-4">
            Your All-In-One
            <br />
            <span className="display-heading text-scout-accent">Intelligence</span>
          </h2>
          <p className="text-scout-muted text-center max-w-2xl mx-auto mb-16">
            Real-time monitoring, cost tracking, and report generation — seamlessly guided by Signal Scout.
          </p>

          {/* Dashboard-style data panels */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-scout-bg rounded-2xl border border-scout-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-scout-muted">SOURCES</span>
                <div className="w-2 h-2 rounded-full bg-scout-accent" />
              </div>
              <p className="text-4xl font-black">220</p>
            </div>
            <div className="bg-scout-bg rounded-2xl border border-scout-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-scout-muted">BUDGET USED</span>
                <div className="w-2 h-2 rounded-full bg-scout-accent" />
              </div>
              <p className="text-4xl font-black text-scout-accent">$2.40</p>
            </div>
            <div className="bg-scout-bg rounded-2xl border border-scout-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-scout-muted">REPORTS</span>
                <div className="w-2 h-2 rounded-full bg-scout-accent" />
              </div>
              <p className="text-4xl font-black">40</p>
            </div>
          </div>

          {/* Bar chart visualization */}
          <div className="bg-scout-bg rounded-2xl border border-scout-border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-scout-muted">RESEARCH ACTIVITY</span>
              <span className="text-xs font-mono text-scout-muted">LAST 30 DAYS</span>
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {[30, 50, 20, 70, 85, 40, 60, 90, 45, 75, 35, 95, 55, 80, 25, 65, 50, 88, 42, 72, 38, 92, 58, 78, 33, 85, 48, 68, 52, 96].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all"
                  style={{
                    height: `${h}%`,
                    backgroundColor: h > 70 ? '#c8ff00' : '#c8ff0050',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Secondary metric */}
          <div className="bg-scout-bg rounded-2xl border border-scout-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-scout-accent" />
                <span className="text-xs font-mono text-scout-muted">AGENT UPTIME</span>
              </div>
              <span className="text-3xl font-black">81.80<span className="text-scout-muted text-lg">%</span></span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[60, 80, 70, 90, 85, 75, 95, 88, 82, 91, 78, 86, 92, 84, 89, 93, 87, 81, 94, 90, 83, 88, 91, 85, 79, 96, 87, 82, 90, 88, 93, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-scout-accent"
                  style={{ height: `${h}%`, opacity: 0.6 + (h / 100) * 0.4 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-label block mb-4">Get Started</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-8">
            Your Next Best
            <br />
            Alpha <span className="display-heading text-scout-accent">Starts</span> Here
          </h2>
          <a
            href="/research/new"
            className="inline-flex items-center gap-2 bg-scout-accent text-scout-bg px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all glow-accent"
          >
            Start Research
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1l7 7-7 7M1 8h14" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </a>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-scout-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="#c8ff00" strokeWidth="2" />
                  <circle cx="16" cy="16" r="6" fill="#c8ff00" />
                </svg>
                <span className="font-bold text-lg">
                  Signal<span className="text-scout-accent">Scout</span>
                </span>
              </div>
              <p className="text-scout-muted text-sm max-w-xs">
                The AI-driven crypto research agent with transparent, on-chain payments.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-3 gap-12 text-sm">
              <div>
                <p className="font-bold mb-3">Product</p>
                <div className="space-y-2 text-scout-muted">
                  <a href="/research/new" className="block hover:text-scout-text transition-colors">New Research</a>
                  <a href="/dashboard" className="block hover:text-scout-text transition-colors">Dashboard</a>
                  <a href="/#features" className="block hover:text-scout-text transition-colors">Features</a>
                </div>
              </div>
              <div>
                <p className="font-bold mb-3">Tech</p>
                <div className="space-y-2 text-scout-muted">
                  <a href="https://paywithlocus.com" className="block hover:text-scout-text transition-colors">Locus</a>
                  <a href="#" className="block hover:text-scout-text transition-colors">Base Chain</a>
                  <a href="#" className="block hover:text-scout-text transition-colors">USDC</a>
                </div>
              </div>
              <div>
                <p className="font-bold mb-3">More</p>
                <div className="space-y-2 text-scout-muted">
                  <a href="https://synthesis.md" className="block hover:text-scout-text transition-colors">Hackathon</a>
                  <a href="#" className="block hover:text-scout-text transition-colors">GitHub</a>
                  <a href="#" className="block hover:text-scout-text transition-colors">Docs</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative accent swoosh */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <path
              d="M20 180 Q60 40 180 20 Q140 80 160 180 Q100 120 20 180Z"
              fill="#c8ff00"
            />
          </svg>
        </div>
      </footer>
    </div>
  );
}
