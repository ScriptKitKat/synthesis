"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function ResearchSession() {
  const { id } = useParams();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const poll = setInterval(async () => {
      const res = await fetch(`/api/research/${id}`);
      const data = await res.json();
      setSession(data);
      if (data.status === "complete" || data.status === "failed") {
        clearInterval(poll);
      }
    }, 5000);

    fetch(`/api/research/${id}`)
      .then((r) => r.json())
      .then(setSession);

    return () => clearInterval(poll);
  }, [id]);

  if (!session) return <div className="p-12 text-center text-scout-muted">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <a href="/dashboard" className="text-scout-muted text-sm hover:text-scout-accent mb-4 inline-block">
        ← Back to Dashboard
      </a>
      <h1 className="text-3xl font-bold mb-8">{session.topic}</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-scout-surface border border-scout-border rounded-xl p-4">
          <div className="text-sm text-scout-muted">Budget</div>
          <div className="text-xl font-mono font-bold">${session.budget?.toFixed(2)}</div>
        </div>
        <div className="bg-scout-surface border border-scout-border rounded-xl p-4">
          <div className="text-sm text-scout-muted">Spent</div>
          <div className="text-xl font-mono font-bold text-scout-accent">
            {session.spent ? `$${session.spent.toFixed(3)}` : "—"}
          </div>
        </div>
        <div className="bg-scout-surface border border-scout-border rounded-xl p-4">
          <div className="text-sm text-scout-muted">Status</div>
          <div className={`text-xl font-mono font-bold ${
            session.status === "complete" ? "text-scout-accent" :
            session.status === "running" ? "text-blue-400" : "text-yellow-400"
          }`}>
            {session.status.toUpperCase()}
          </div>
        </div>
      </div>

      {session.status === "running" && (
        <div className="bg-scout-surface border border-scout-border rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4 animate-pulse">🔍</div>
          <h3 className="text-xl font-bold mb-2">Research in Progress</h3>
          <p className="text-scout-muted">The agent is searching, scraping, and analyzing.</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 bg-scout-accent rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-2 h-2 bg-scout-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-scout-accent rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
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