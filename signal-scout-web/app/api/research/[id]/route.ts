import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = prisma.research.findUnique({ where: { id: params.id } });
  if (!session) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(session);
}