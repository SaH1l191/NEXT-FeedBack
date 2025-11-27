// // db/index.ts
// import postgres from "postgres";
// import { drizzle } from "drizzle-orm/postgres-js";

// declare global {
//   // store client on global to reuse in dev/hot-reload
//   // eslint-disable-next-line no-var
//   var __pg: { sql?: ReturnType<typeof postgres>; db?: ReturnType<typeof drizzle> } | undefined;
// }

// const connectionString = process.env.DATABASE_URL!;
// if (!connectionString) throw new Error("Missing DATABASE_URL env var");

// if (!global.__pg) {
//   global.__pg = {};
// }

// if (!global.__pg.sql) {
//   // use small pool size for serverless
//   global.__pg.sql = postgres(connectionString, {
//     ssl: { rejectUnauthorized: false },
//     max: 2,             // adjust upwards for dedicated servers
//     idle_timeout: 10000 // use the newer option (timeout deprecated)
//   });
// }

// export const sql = global.__pg.sql!;
// export const db = global.__pg.db ?? (global.__pg.db = drizzle(sql));
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/drizzle";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
