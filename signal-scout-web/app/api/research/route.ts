import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// GET /api/research — list all sessions
export async function GET() {
  const sessions = await prisma.research.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(sessions);
}

// runs a research session with the POST handler
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topic, budget } = body;

  // Create research session in DB (status: pending)
  const session = await prisma.research.create({
    data: {
      topic,
      budget: parseFloat(budget),
      status: "pending",
      user: {
        connectOrCreate: {
          where: { email: "demo@signalscout.xyz" },
          create: { email: "demo@signalscout.xyz", name: "Demo User" },
        },
      },
    },
  });

  // Create Locus checkout session
  const checkoutRes = await fetch(
    "https://beta-api.paywithlocus.com/api/checkout/sessions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LOCUS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: parseFloat(budget),
        description: `Signal Scout Research: ${topic}`,
        metadata: { researchId: session.id },
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/webhook`,
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
