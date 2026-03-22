import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// POST /api/research/complete — agent posts results here when done
export async function POST(req: NextRequest) {
  try {
    // Simple auth: check a shared secret
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.AGENT_WEBHOOK_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, briefing, spent, txHash, chainTxHash, sources } = body;

    if (!id || !briefing) {
      return Response.json(
        { error: "id and briefing are required" },
        { status: 400 }
      );
    }

    const session = await prisma.research.update({
      where: { id },
      data: {
        status: "complete",
        briefing,
        spent: spent ? parseFloat(spent) : null,
        txHash: txHash || null,
        chainTxHash: chainTxHash || null,
        sources: sources || null,
        completedAt: new Date(),
      },
    });

    return Response.json({ success: true, session });
  } catch (error) {
    console.error("Failed to complete research session:", error);
    return Response.json(
      { error: "Failed to update research session" },
      { status: 500 }
    );
  }
}
