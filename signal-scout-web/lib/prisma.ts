import { randomUUID } from "crypto";

type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
};

type Research = {
  id: string;
  userId: string;
  topic: string;
  budget: number;
  status: string;
  briefing: string | null;
  spent: number | null;
  sources: string | null;
  txHash: string | null;
  chainTxHash: string | null;
  createdAt: Date;
  completedAt: Date | null;
};

const users: User[] = [];
const researches: Research[] = [];

function sortBy<T>(arr: T[], key: keyof T, dir: "asc" | "desc"): T[] {
  return [...arr].sort((a, b) => {
    const av = a[key] as unknown as number;
    const bv = b[key] as unknown as number;
    return dir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
  });
}

export const prisma = {
  research: {
    findMany({ orderBy, include }: { orderBy?: Record<string, "asc" | "desc">; include?: { user?: boolean } } = {}) {
      let results = [...researches];
      if (orderBy) {
        const [key, dir] = Object.entries(orderBy)[0] as [keyof Research, "asc" | "desc"];
        results = sortBy(results, key, dir);
      }
      if (include?.user) {
        return results.map((r) => ({ ...r, user: users.find((u) => u.id === r.userId) ?? null }));
      }
      return results;
    },

    create({ data }: { data: {
      topic: string;
      budget: number;
      status?: string;
      userId?: string;
      user?: { connectOrCreate: { where: { email: string }; create: { email: string; name?: string } } };
    } }) {
      let userId = data.userId ?? "";
      if (data.user?.connectOrCreate) {
        const { where, create } = data.user.connectOrCreate;
        let user = users.find((u) => u.email === where.email);
        if (!user) {
          user = { id: randomUUID(), email: create.email, name: create.name ?? null, createdAt: new Date() };
          users.push(user);
        }
        userId = user.id;
      }
      const record: Research = {
        id: randomUUID(),
        userId,
        topic: data.topic,
        budget: data.budget,
        status: data.status ?? "pending",
        briefing: null,
        spent: null,
        sources: null,
        txHash: null,
        chainTxHash: null,
        createdAt: new Date(),
        completedAt: null,
      };
      researches.push(record);
      return record;
    },

    findUnique({ where }: { where: { id: string } }) {
      return researches.find((r) => r.id === where.id) ?? null;
    },

    update({ where, data }: { where: { id: string }; data: Partial<Research> }) {
      const idx = researches.findIndex((r) => r.id === where.id);
      if (idx === -1) throw new Error(`Research ${where.id} not found`);
      researches[idx] = { ...researches[idx], ...data };
      return researches[idx];
    },
  },
};
