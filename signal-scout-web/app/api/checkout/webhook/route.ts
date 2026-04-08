import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import crypto from "crypto";

// POST /api/checkout/webhook — Locus sends payment confirmation here
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // Verify Locus webhook signature (X-Signature-256 header per Locus docs)
    const webhookSecret = process.env.LOCUS_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers.get("x-signature-256");
      if (!signature) {
        return Response.json({ error: "Missing signature" }, { status: 401 });
      }
      const expectedSig =
        "sha256=" +
        crypto
          .createHmac("sha256", webhookSecret)
          .update(rawBody)
          .digest("hex");
      if (
        !crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSig)
        )
      ) {
        return Response.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = body.event || req.headers.get("x-webhook-event");

    // Handle checkout.session.paid
    if (event === "checkout.session.paid") {
      const sessionData = body.data ?? body;
      const researchId = sessionData.metadata?.researchId;
      const txHash = sessionData.paymentTxHash;

      if (researchId) {

                // ... after verifying payment and updating status to "running":
        const session = await prisma.research.update({
          where: { id: researchId },
          data: {
            status: "running",
            txHash: txHash || null,
          },
        });

        console.log(`Research ${researchId} → running. TX: ${txHash}`);

        // Trigger the OpenClaw agent to start research
        try {
          await fetch(process.env.DISCORD_WEBHOOK_URL!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: [
                `📡 **RESEARCH REQUEST**`,
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
          console.log(`Triggered agent for research ${researchId}`);

          // api/checkout/webhook/route.ts
        } catch (hookErr) {
          console.error("Failed to trigger agent:", hookErr);
        }
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
