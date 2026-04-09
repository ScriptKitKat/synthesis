import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await convex.query(api.research.get, {
    id: params.id as Id<"research">,
  });
  if (!session) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(session);
}
