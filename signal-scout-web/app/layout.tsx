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
        <nav className="border-b border-scout-border bg-scout-surface/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="text-2xl">📡</span>
              <span className="font-bold text-lg tracking-tight">
                Signal<span className="text-scout-accent">Scout</span>
              </span>
            </a>
            <div className="flex items-center gap-6">
              <a
                href="/dashboard"
                className="text-sm text-scout-muted hover:text-scout-text transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/research/new"
                className="text-sm bg-scout-accent text-scout-bg px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-all"
              >
                New Research
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
