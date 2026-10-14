import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDbEnv } from "@/lib/env";
import * as schema from "./schema";

let client: NodePgDatabase<typeof schema> | undefined;

// Created on first use so importing this module needs no DATABASE_URL (builds, tests).
export function getDb(): NodePgDatabase<typeof schema> {
  client ??= drizzle(new Pool({ connectionString: getDbEnv().DATABASE_URL }), { schema });
  return client;
}
