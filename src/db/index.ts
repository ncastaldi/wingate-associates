import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getEnv } from "@/lib/env";
import * as schema from "./schema";

let client: NodePgDatabase<typeof schema> | undefined;

// Created on first use so importing this module needs no DATABASE_URL (builds, tests).
export function getDb(): NodePgDatabase<typeof schema> {
  client ??= drizzle(new Pool({ connectionString: getEnv().DATABASE_URL }), { schema });
  return client;
}
