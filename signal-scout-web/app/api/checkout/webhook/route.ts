import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import crypto from "crypto";

// POST /api/checkout/webhook — Locus sends payment confirmation here
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // Verify Locus webhook signature if secret is configured
    const webhookSecret = process.env.LOCUS_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers.get("locus-signature");
      if (!signature) {
        return Response.json({ error: "Missing signature" }, { status: 401 });
      }
      const expectedSig = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");
      if (signature !== `sha256=${expectedSig}`) {
        return Response.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    // Handle checkout.session.paid event
    if (body.event === "checkout.session.paid" || body.status === "PAID") {
      const researchId = body.metadata?.researchId || body.data?.metadata?.researchId;
      const txHash = body.paymentTxHash || body.data?.paymentTxHash;

      if (researchId) {
        await prisma.research.update({
          where: { id: researchId },
          data: {
            status: "running",
            txHash: txHash || null,
          },
        });

        console.log(`Research session ${researchId} marked as running. TX: ${txHash}`);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
