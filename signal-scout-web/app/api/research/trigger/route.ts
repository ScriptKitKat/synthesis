import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { NextRequest } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const { id, topic, budget } = await req.json();

  await convex.mutation(api.research.updateStatus, {
    id: id as Id<"research">,
    status: "running",
  });

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
        `node ~/scripts/post-to-web.js "${id}" "BRIEFING_TEXT" SPENT_AMOUNT`,
      ].join("\n"),
    }),
  });

  return Response.json({ triggered: true });
}