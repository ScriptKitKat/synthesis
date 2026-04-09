import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { NextRequest } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Locus sends payment confirmation
  if (body.status === "PAID" && body.metadata?.researchId) {
    await convex.mutation(api.research.updateStatus, {
      id: body.metadata.researchId as Id<"research">,
      status: "running",
      txHash: body.paymentTxHash || undefined,
    });
  }

  return Response.json({ received: true });
}
