import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

function StatusIcon({ status }: { status: string }) {
  if (status === "complete") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="#c8ff00" strokeWidth="1.5" />
        <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "running") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="animate-spin">
        <circle cx="9" cy="9" r="8" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="9" cy="9" r="3" fill="#3b82f6" opacity="0.6" />
      </svg>
    );
  }
  if (status === "failed") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="#ff4d6a" strokeWidth="1.5" />
        <path d="M6 6l6 6M12 6l-6 6" stroke="#ff4d6a" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="#ffb224" strokeWidth="1.5" />
      <circle cx="9" cy="9" r="3" fill="#ffb224" opacity="0.6" className="animate-pulse" />
    </svg>
  );
}

export default async function Dashboard() {
  const sessions = await prisma.research.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  const totalSpent = sessions.reduce((sum, s) => sum + (s.spent || 0), 0);
  const completedCount = sessions.filter((s) => s.status === "complete").length;
  const avgCost =
    sessions.filter((s) => s.spent).length > 0
      ? totalSpent / sessions.filter((s) => s.spent).length
      : 0;

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="border-b border-scout-border bg-scout-surface/30">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="section-label block mb-2">Overview</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Research
                <br />
                <span className="text-scout-accent display-heading">Dashboard</span>
              </h1>
            </div>
            <Link
              href="/research/new"
              className="bg-scout-accent text-scout-bg px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all glow-accent text-sm"
            >
              + New Research
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "TOTAL SESSIONS", value: sessions.length, accent: false },
            { label: "COMPLETED", value: completedCount, accent: true },
            { label: "TOTAL SPENT", value: `$${totalSpent.toFixed(3)}`, accent: true },
            { label: "AVG COST", value: `$${avgCost.toFixed(3)}`, accent: false },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-scout-bg rounded-2xl border border-scout-border p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-scout-muted">{stat.label}</span>
                <div className={`w-2 h-2 rounded-full ${stat.accent ? "bg-scout-accent" : "bg-scout-muted/40"}`} />
              </div>
              <p className={`text-3xl font-black font-mono ${stat.accent ? "text-scout-accent" : ""}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Sessions list */}
        {sessions.length === 0 ? (
          <div className="bg-scout-surface border border-scout-border rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-scout-accent/10 border border-scout-accent/20 flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="#c8ff00" strokeWidth="1.5" opacity="0.4" />
                <circle cx="16" cy="16" r="6" stroke="#c8ff00" strokeWidth="1.5" opacity="0.7" />
                <circle cx="16" cy="16" r="2.5" fill="#c8ff00" />
                <line x1="16" y1="4" x2="16" y2="8" stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="24" x2="16" y2="28" stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="4" y1="16" x2="8" y2="16" stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="24" y1="16" x2="28" y2="16" stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">No research yet</h3>
            <p className="text-scout-muted mb-8 text-sm">
              Start your first research session to see results here.
            </p>
            <Link
              href="/research/new"
              className="bg-scout-accent text-scout-bg px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all"
            >
              Start Research
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-mono text-scout-muted">SESSIONS</span>
              <div className="flex-1 h-px bg-scout-border" />
              <span className="text-xs font-mono text-scout-muted">{sessions.length} TOTAL</span>
            </div>
            <div className="space-y-2">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/research/${session.id}`}
                  className="group flex items-center justify-between bg-scout-surface border border-scout-border rounded-2xl p-5 hover:border-scout-accent/40 hover:bg-scout-surface/80 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">
                      <StatusIcon status={session.status} />
                    </div>
                    <div>
                      <h3 className="font-bold leading-tight group-hover:text-scout-accent transition-colors">
                        {session.topic}
                      </h3>
                      <p className="text-scout-muted text-xs font-mono mt-0.5">
                        {new Date(session.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right shrink-0">
                    <div className="hidden md:block">
                      <div className="text-xs font-mono text-scout-muted mb-0.5">BUDGET</div>
                      <div className="font-mono font-bold text-sm">${session.budget.toFixed(2)}</div>
                    </div>
                    {session.spent !== null && (
                      <div className="hidden md:block">
                        <div className="text-xs font-mono text-scout-muted mb-0.5">SPENT</div>
                        <div className="font-mono font-bold text-sm text-scout-accent">
                          ${session.spent?.toFixed(3)}
                        </div>
                      </div>
                    )}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                        session.status === "complete"
                          ? "bg-scout-accent/10 text-scout-accent"
                          : session.status === "running"
                            ? "bg-blue-500/10 text-blue-400"
                            : session.status === "failed"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {session.status.toUpperCase()}
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="text-scout-muted group-hover:text-scout-accent transition-colors shrink-0"
                    >
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
