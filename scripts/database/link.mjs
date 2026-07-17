#!/usr/bin/env node

import { spawn } from "node:child_process";
import { databaseDir, resolveSupabaseBin } from "./context.mjs";
import { buildDatabaseEnv } from "./env.mjs";

const env = buildDatabaseEnv();
const projectRef = env.SUPABASE_ONESBRYNE_PROJECT_REF;
const supabaseBin = resolveSupabaseBin();

if (!projectRef) {
  console.error(
    "Missing SUPABASE_ONESBRYNE_PROJECT_REF in .env.database or the process environment.",
  );
  process.exit(1);
}

const child = spawn(supabaseBin, ["link", "--project-ref", projectRef], {
  cwd: databaseDir,
  env,
  stdio: "inherit",
  shell:
    process.platform === "win32" && supabaseBin.toLowerCase().endsWith(".cmd"),
});

child.on("error", (error) => {
  if (error.code === "ENOENT") {
    console.error(
      "Supabase CLI was not found. Run `npm install` in this repo first.",
    );
    process.exit(127);
  }

  console.error(error.message);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Supabase CLI exited from signal ${signal}.`);
    process.exit(1);
  }

  process.exit(code ?? 0);
});
