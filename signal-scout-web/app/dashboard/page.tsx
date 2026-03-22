import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const sessions = await prisma.research.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Research Dashboard</h1>
          <p className="text-scout-muted mt-1">
            All research sessions and their results
          </p>
        </div>
        <Link
          href="/research/new"
          className="bg-scout-accent text-scout-bg px-6 py-2.5 rounded-xl font-medium hover:brightness-110 transition-all"
        >
          + New Research
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Total Sessions",
            value: sessions.length,
            icon: "📊",
          },
          {
            label: "Completed",
            value: sessions.filter((s) => s.status === "complete").length,
            icon: "✅",
          },
          {
            label: "Total Spent",
            value: `$${sessions
              .reduce((sum, s) => sum + (s.spent || 0), 0)
              .toFixed(3)}`,
            icon: "💰",
          },
          {
            label: "Avg Cost",
            value: sessions.length
              ? `$${(
                  sessions.reduce((sum, s) => sum + (s.spent || 0), 0) /
                  sessions.filter((s) => s.spent).length
                ).toFixed(3)}`
              : "$0",
            icon: "📈",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-scout-surface border border-scout-border rounded-xl p-4"
          >
            <div className="text-sm text-scout-muted mb-1">
              {stat.icon} {stat.label}
            </div>
            <div className="text-2xl font-bold font-mono">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <div className="bg-scout-surface border border-scout-border rounded-2xl p-16 text-center">
          <div className="text-4xl mb-4">📡</div>
          <h3 className="text-xl font-bold mb-2">No research yet</h3>
          <p className="text-scout-muted mb-6">
            Start your first research session to see results here.
          </p>
          <Link
            href="/research/new"
            className="bg-scout-accent text-scout-bg px-6 py-2.5 rounded-xl font-medium"
          >
            Start Research
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/research/${session.id}`}
              className="block bg-scout-surface border border-scout-border rounded-xl p-5 hover:border-scout-accent/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {session.status === "complete"
                      ? "✅"
                      : session.status === "running"
                        ? "⏳"
                        : session.status === "failed"
                          ? "❌"
                          : "🕐"}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg">{session.topic}</h3>
                    <p className="text-scout-muted text-sm font-mono">
                      {new Date(session.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="text-sm text-scout-muted">Budget</div>
                    <div className="font-mono font-bold">
                      ${session.budget.toFixed(2)}
                    </div>
                  </div>
                  {session.spent !== null && (
                    <div>
                      <div className="text-sm text-scout-muted">Spent</div>
                      <div className="font-mono font-bold text-scout-accent">
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
