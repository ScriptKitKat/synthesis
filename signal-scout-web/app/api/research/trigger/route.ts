import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { id, topic, budget } = await req.json();

  await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: [
        `**RESEARCH REQUEST**`,
        ``,
        `**Session ID:** ${id}`,
        `**Topic:** "${topic}"`,
        `**Budget:** $${budget}`,
        ``,
        `Run your research workflow for this topic.`,
        `When complete, post results using:`,
        `node ~/signal-scout-scripts/post-to-web.js "${id}" "BRIEFING_TEXT" SPENT_AMOUNT`,
      ].join("\n"),
    }),
  });

  return Response.json({ triggered: true });
}