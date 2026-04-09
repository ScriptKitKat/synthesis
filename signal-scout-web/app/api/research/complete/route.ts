import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { NextRequest } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
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

    await convex.mutation(api.research.complete, {
      id: id as Id<"research">,
      briefing,
      spent: spent ? parseFloat(spent) : undefined,
      txHash: txHash || undefined,
      chainTxHash: chainTxHash || undefined,
      sources: sources || undefined,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to complete research session:", error);
    return Response.json(
      { error: "Failed to update research session" },
      { status: 500 }
    );
  }
}
