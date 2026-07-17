import fs from "node:fs";
import { databaseEnvPath } from "./context.mjs";

function parseEnvLine(line) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmed.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (!key) {
    return null;
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

function loadDatabaseEnvFile() {
  if (!fs.existsSync(databaseEnvPath)) {
    return {};
  }

  const values = {};
  const fileContents = fs.readFileSync(databaseEnvPath, "utf8");

  for (const line of fileContents.split(/\r?\n/)) {
    const entry = parseEnvLine(line);

    if (entry) {
      const [key, value] = entry;
      values[key] = value;
    }
  }

  return values;
}

export function buildDatabaseEnv() {
  const env = {
    ...loadDatabaseEnvFile(),
    ...process.env,
  };

  const legacyAliases = {
    SUPABASE_ACCESS_TOKEN: "SUPABASE_ONESBRYNE_ACCESS_TOKEN",
    SUPABASE_DB_PASSWORD: "SUPABASE_ONESBRYNE_DB_PASSWORD",
    SUPABASE_DB_URL: "SUPABASE_ONESBRYNE_DB_URL",
    SUPABASE_LEGACY_SERVICE_ROLE_KEY:
      "SUPABASE_ONESBRYNE_LEGACY_SERVICE_ROLE_KEY",
    SUPABASE_PROJECT_REF: "SUPABASE_ONESBRYNE_PROJECT_REF",
    SUPABASE_PROJECT_URL: "SUPABASE_ONESBRYNE_PROJECT_URL",
    SUPABASE_PUBLISHABLE_KEY: "SUPABASE_ONESBRYNE_PUBLISHABLE_KEY",
    SUPABASE_SECRET_KEY: "SUPABASE_ONESBRYNE_SECRET_KEY",
  };

  for (const [canonicalName, legacyName] of Object.entries(legacyAliases)) {
    if (!env[canonicalName] && env[legacyName]) {
      env[canonicalName] = env[legacyName];
    }
  }

  return env;
}
