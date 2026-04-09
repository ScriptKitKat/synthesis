import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextRequest } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  const sessions = await convex.query(api.research.list);
  return Response.json(sessions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topic, budget } = body;

  if (!topic || !budget) {
    return Response.json({ error: "topic and budget required" }, { status: 400 });
  }

  const id = await convex.mutation(api.research.create, {
    topic,
    budget: parseFloat(budget),
  });

  const checkoutRes = await fetch(
    "https://beta-api.paywithlocus.com/api/checkout/sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LOCUS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: budget.toString(),
        description: `Signal Scout Research: ${topic}`,
        metadata: { researchId: id },
      }),
    }
  );

  const checkout = await checkoutRes.json();

  return Response.json(
    {
      id,
      checkoutSessionId: checkout.data?.id,
      checkoutUrl: checkout.data?.checkoutUrl,
    },
    { status: 201 }
  );
}
