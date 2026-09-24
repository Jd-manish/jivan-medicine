import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ?? process.env.NETLIFY_DB_URL ?? "";

if (!connectionString) {
  console.warn("DATABASE_URL environment variable is not set.");
}

export const db = drizzle(connectionString, { schema });
