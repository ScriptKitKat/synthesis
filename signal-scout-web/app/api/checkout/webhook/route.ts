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
          await fetch(`${process.env.OPENCLAW_HOOK_URL}/hooks/agent`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENCLAW_HOOK_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `New paid research request.\n\nTopic: "${session.topic}"\nBudget: $${session.budget}\nSession ID: ${session.id}\n\nRun your research workflow. When complete, POST results to ${process.env.NEXT_PUBLIC_APP_URL}/api/research/complete with the session ID.`,
              name: "WebApp",
              deliver: true,
              channel: "discord",
            }),
          });
          console.log(`Triggered agent for research ${researchId}`);
        } catch (hookErr) {
          console.error("Failed to trigger agent:", hookErr);
        }
      }
    }
