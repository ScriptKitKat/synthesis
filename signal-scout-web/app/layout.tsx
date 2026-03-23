import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Scout — Autonomous Crypto Research Agent",
  description:
    "An AI agent that researches the crypto ecosystem on your behalf, paying for its own data sources in USDC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased min-h-screen bg-scout-bg text-scout-text">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-scout-bg/60 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#c8ff00" strokeWidth="2" />
                <circle cx="16" cy="16" r="6" fill="#c8ff00" />
                <line x1="16" y1="2" x2="16" y2="8" stroke="#c8ff00" strokeWidth="2" />
                <line x1="16" y1="24" x2="16" y2="30" stroke="#c8ff00" strokeWidth="2" />
                <line x1="2" y1="16" x2="8" y2="16" stroke="#c8ff00" strokeWidth="2" />
                <line x1="24" y1="16" x2="30" y2="16" stroke="#c8ff00" strokeWidth="2" />
              </svg>
              <span className="font-bold text-lg tracking-tight">
                Signal<span className="text-scout-accent">Scout</span>
              </span>
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm text-scout-muted">
              <a href="/#features" className="hover:text-scout-text transition-colors">Features</a>
              <a href="/#how-it-works" className="hover:text-scout-text transition-colors">How It Works</a>
              <a href="/dashboard" className="hover:text-scout-text transition-colors">Dashboard</a>
            </div>
            <a
              href="/research/new"
              className="bg-scout-accent text-scout-bg px-5 py-2 rounded-full font-bold text-sm hover:brightness-110 transition-all"
            >
              Start Research
            </a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
