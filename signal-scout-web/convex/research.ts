import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("research").order("desc").take(100);
  },
});

export const get = query({
  args: { id: v.id("research") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: { topic: v.string(), budget: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("research", {
      topic: args.topic,
      budget: args.budget,
      status: "running",
      createdAt: Date.now(),
    });
  },
});

export const complete = mutation({
  args: {
    id: v.id("research"),
    briefing: v.string(),
    spent: v.optional(v.number()),
    txHash: v.optional(v.string()),
    chainTxHash: v.optional(v.string()),
    sources: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "complete",
      briefing: args.briefing,
      spent: args.spent,
      txHash: args.txHash,
      chainTxHash: args.chainTxHash,
      sources: args.sources,
      completedAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("research"),
    status: v.string(),
    txHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      ...(args.txHash !== undefined ? { txHash: args.txHash } : {}),
    });
  },
});
