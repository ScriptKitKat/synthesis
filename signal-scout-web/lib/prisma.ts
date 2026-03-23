import Database from "better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const DB_PATH = "/tmp/dev.db";

function ensureSchema() {
  const db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id"        TEXT     NOT NULL PRIMARY KEY,
      "email"     TEXT     NOT NULL UNIQUE,
      "name"      TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS "Research" (
      "id"          TEXT     NOT NULL PRIMARY KEY,
      "userId"      TEXT     NOT NULL,
      "topic"       TEXT     NOT NULL,
      "budget"      REAL     NOT NULL,
      "status"      TEXT     NOT NULL DEFAULT 'pending',
      "briefing"    TEXT,
      "spent"       REAL,
      "sources"     TEXT,
      "txHash"      TEXT,
      "chainTxHash" TEXT,
      "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "completedAt" DATETIME,
      FOREIGN KEY ("userId") REFERENCES "User" ("id")
    );
  `);
  db.close();
}

ensureSchema();

const adapter = new PrismaBetterSqlite3({ url: DB_PATH });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
