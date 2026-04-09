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

  await fetch(`https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
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