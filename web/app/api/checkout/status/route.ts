import { NextRequest, NextResponse } from "next/server";

const LOCUS_API = process.env.LOCUS_API_BASE ?? "https://beta-api.paywithlocus.com/api";
const LOCUS_KEY = process.env.LOCUS_API_KEY!;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  try {
    const res = await fetch(`${LOCUS_API}/checkout/sessions/${sessionId}`, {
      headers: { "Authorization": `Bearer ${LOCUS_KEY}` },
    });

    const data = await res.json();
    const session = data.data ?? data;

    return NextResponse.json({
      status: session.status,
      paidAt: session.paidAt,
      paymentTxHash: session.paymentTxHash,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
  }
}
