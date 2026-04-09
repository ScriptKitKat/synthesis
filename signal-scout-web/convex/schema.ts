import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  research: defineTable({
    topic: v.string(),
    budget: v.number(),
    status: v.string(),
    briefing: v.optional(v.string()),
    spent: v.optional(v.number()),
    txHash: v.optional(v.string()),
    chainTxHash: v.optional(v.string()),
    sources: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  }),
});