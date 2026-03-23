import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Locus sends payment confirmation
  if (body.status === "PAID" && body.metadata?.researchId) {
    await prisma.research.update({
      where: { id: body.metadata.researchId },
      data: {
        status: "running",
        txHash: body.paymentTxHash || null,
      },
    });

    // TODO: Notify the OpenClaw agent to start research
    // For now, you'll trigger this manually or via a polling mechanism
  }

  return Response.json({ received: true });
}
