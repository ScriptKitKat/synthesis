import path from "node:path";
import { defineConfig } from "prisma/config";

const dbUrl = `file:${path.resolve(__dirname, "prisma/dev.db")}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
});
