import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export const dynamic = "force-dynamic";

export default async function ResearchSession({
  params,
}: {
  params: { id: string };
}) {
  const session = await prisma.research.findUnique({
    where: { id: params.id },
  });

  if (!session) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <a
          href="/dashboard"
          className="text-scout-muted text-sm hover:text-scout-accent transition-colors mb-4 inline-block"
        >
          ← Back to Dashboard
        </a>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{session.topic}</h1>
            <p className="text-scout-muted font-mono text-sm mt-1">
              {new Date(session.createdAt).toLocaleString()}
            </p>
          </div>
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-mono font-medium ${
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

      {/* Cost summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-scout-surface border border-scout-border rounded-xl p-4">
          <div className="text-sm text-scout-muted mb-1">Budget</div>
          <div className="text-xl font-mono font-bold">
            ${session.budget.toFixed(2)}
          </div>
        </div>
        <div className="bg-scout-surface border border-scout-border rounded-xl p-4">
          <div className="text-sm text-scout-muted mb-1">Spent</div>
          <div className="text-xl font-mono font-bold text-scout-accent">
            ${session.spent?.toFixed(3) || "—"}
          </div>
        </div>
        <div className="bg-scout-surface border border-scout-border rounded-xl p-4">
          <div className="text-sm text-scout-muted mb-1">Remaining</div>
          <div className="text-xl font-mono font-bold">
            {session.spent
              ? `$${(session.budget - session.spent).toFixed(3)}`
              : "—"}
          </div>
        </div>
      </div>

      {/* On-chain links */}
      {(session.txHash || session.chainTxHash) && (
        <div className="bg-scout-surface border border-scout-border rounded-xl p-4 mb-8 font-mono text-sm">
          <div className="text-scout-muted text-xs mb-2 uppercase tracking-wider">
            On-Chain Verification
          </div>
          {session.txHash && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-scout-accent">Locus TX:</span>
              <span className="text-scout-muted truncate">{session.txHash}</span>
            </div>
          )}
          {session.chainTxHash && (
            <div className="flex items-center gap-2">
              <span className="text-scout-accent">Status Network:</span>
              <a
                href={`https://sepoliascan.status.network/tx/${session.chainTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-scout-muted truncate hover:text-scout-accent transition-colors"
              >
                {session.chainTxHash}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Briefing */}
      {session.status === "running" && (
        <div className="bg-scout-surface border border-scout-border rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4 animate-pulse">🔍</div>
          <h3 className="text-xl font-bold mb-2">Research in Progress</h3>
          <p className="text-scout-muted">
            The agent is searching, scraping, and analyzing. This page will
            update when the briefing is ready.
          </p>
        </div>
      )}

      {session.status === "pending" && (
        <div className="bg-scout-surface border border-scout-border rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">🕐</div>
          <h3 className="text-xl font-bold mb-2">Awaiting Payment</h3>
          <p className="text-scout-muted">
            Complete the USDC payment to start the research.
          </p>
        </div>
      )}

      {session.briefing && (
        <div className="bg-scout-surface border border-scout-border rounded-2xl p-8">
          <div className="briefing-content">
            <ReactMarkdown>{session.briefing}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
