// api/research/route.ts — FIXED

import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const sessions = await prisma.research.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(sessions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topic, budget } = body;

  if (!topic || !budget) {
    return Response.json({ error: "topic and budget required" }, { status: 400 });
  }

  const session = await prisma.research.create({
    data: {
      topic,
      budget: parseFloat(budget),
      status: "running",  // Start immediately
      user: {
        connectOrCreate: {
          where: { email: "demo@signalscout.xyz" },
          create: { email: "demo@signalscout.xyz", name: "Demo User" },
        },
      },
    },
  });

  // Trigger agent via Discord immediately
  await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: [
        `**RESEARCH REQUEST**`,
        ``,
        `**Session ID:** ${session.id}`,
        `**Topic:** "${session.topic}"`,
        `**Budget:** $${session.budget}`,
        ``,
        `Run your research workflow for this topic.`,
        `When complete, post results using:`,
        `node ~/signal-scout-scripts/post-to-web.js "${session.id}" "BRIEFING_TEXT" SPENT_AMOUNT`,
      ].join("\n"),
    }),
  });

  // Still create checkout for payment (but don't block on it)
  const checkoutRes = await fetch(
    "https://beta-api.paywithlocus.com/api/checkout/sessions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LOCUS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: budget.toString(),
        description: `Signal Scout Research: ${topic}`,
        metadata: { researchId: session.id },
      }),
    }
  );

  const checkout = await checkoutRes.json();

  return Response.json({
    id: session.id,
    checkoutSessionId: checkout.data?.id,
    checkoutUrl: checkout.data?.checkoutUrl,
  }, { status: 201 });
}