import { NextRequest, NextResponse } from "next/server";

const LOCUS_API = process.env.LOCUS_API_BASE ?? "https://beta-api.paywithlocus.com/api";
const LOCUS_KEY = process.env.LOCUS_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { topic, amount } = await req.json();

    if (!topic || !amount) {
      return NextResponse.json({ success: false, error: "Missing topic or amount" }, { status: 400 });
    }

    const res = await fetch(`${LOCUS_API}/checkout/sessions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOCUS_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount.toFixed(2),
        description: `Signal Scout Research Briefing: ${topic}`,
        metadata: {
          topic,
          budget_usdc: amount.toFixed(2),
          agent: "Signal Scout",
          powered_by: "Locus",
        },
        receiptConfig: {
          enabled: true,
          fields: {
            creditorName: "Signal Scout",
            lineItems: [{ description: `Research Briefing: ${topic}`, amount: amount.toFixed(2) }],
          },
        },
      }),
    });

    const data = await res.json();

    if (!data.success && !data.id) {
      return NextResponse.json({ success: false, error: "Failed to create session" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sessionId: data.data?.id ?? data.id,
      checkoutUrl: data.data?.checkoutUrl ?? data.checkoutUrl,
      amount,
      topic,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
