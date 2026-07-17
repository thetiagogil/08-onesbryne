#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { databaseDir, resolveSupabaseBin } from "./context.mjs";
import { buildDatabaseEnv } from "./env.mjs";

const bucketName = "piece-images";
const imageWidth = 900;
const imageHeight = 1200;
const maxImageBytes = 3 * 1024 * 1024;
const catalogPath = path.join(
  databaseDir,
  "seeds",
  "demo",
  "catalog_pieces.json",
);
const assetDir = path.join(databaseDir, "seeds", "demo", "assets", "pieces");

function requiredEnv(env, key) {
  const value = env[key];

  if (!value) {
    throw new Error(
      `Missing ${key} in .env.database or the process environment.`,
    );
  }

  return value;
}

function sqlValue(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "number") {
    return String(value);
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlUuidArray(ids) {
  return `ARRAY[${ids.map((id) => `${sqlValue(id)}::uuid`).join(", ")}]`;
}

function assertStoragePath(storagePath) {
  if (!/^pieces\/[a-f0-9-]{36}\/ob-\d{3}\.webp$/.test(storagePath)) {
    throw new Error(`Unsafe storage path: ${storagePath}`);
  }
}

function readCatalog() {
  const records = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

  if (!Array.isArray(records) || records.length === 0) {
    throw new Error(`${catalogPath} must contain at least one record.`);
  }

  return records.map((record) => {
    const assetPath = path.join(assetDir, record.assetFile);

    if (!/^ob-\d{3}\.webp$/.test(record.assetFile)) {
      throw new Error(`Unexpected asset file name: ${record.assetFile}`);
    }

    if (!fs.existsSync(assetPath)) {
      throw new Error(`Missing demo image asset: ${assetPath}`);
    }

    const byteSize = fs.statSync(assetPath).size;

    if (byteSize <= 0 || byteSize > maxImageBytes) {
      throw new Error(
        `Demo image ${record.assetFile} is outside the allowed byte size.`,
      );
    }

    const storagePath = `pieces/${record.id}/${record.assetFile}`;
    assertStoragePath(storagePath);

    return {
      ...record,
      assetPath,
      byteSize,
      storagePath,
    };
  });
}

function getProjectUrl(env) {
  const projectUrl = env.SUPABASE_PROJECT_URL;

  if (projectUrl) {
    return projectUrl.replace(/\/$/, "");
  }

  const projectRef = requiredEnv(env, "SUPABASE_PROJECT_REF");
  return `https://${projectRef}.supabase.co`;
}

function getStorageApiKey(env) {
  return env.SUPABASE_LEGACY_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
}

function getStorageHeaders(apiKey) {
  const headers = {
    apikey: apiKey,
    "cache-control": "3600",
    "content-type": "image/webp",
    "x-upsert": "true",
  };

  if (!apiKey.startsWith("sb_secret_")) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

async function uploadImages(projectUrl, apiKey, records) {
  const headers = getStorageHeaders(apiKey);

  for (const record of records) {
    const uploadUrl = `${projectUrl}/storage/v1/object/${bucketName}/${record.storagePath}`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers,
      body: fs.readFileSync(record.assetPath),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Failed to upload ${record.assetFile}: ${response.status} ${body}`,
      );
    }

    console.log(`Uploaded ${bucketName}/${record.storagePath}`);
  }
}

function buildSeedSql(records) {
  const pieceRows = records
    .map(
      (record) => `(
        ${sqlValue(record.id)}::uuid,
        ${sqlValue(record.codeNumber)},
        ${sqlValue(record.name)},
        ${sqlValue(record.brand)},
        ${sqlValue(record.categorySlug)},
        ${sqlValue(record.sizeLabel)},
        ${sqlValue(record.conditionLabel)},
        ${sqlValue(record.priceCents)},
        ${sqlValue(record.description)},
        ${sqlValue(record.status)},
        ${sqlValue(record.publishedAt)}::timestamptz,
        ${sqlValue(record.soldAt)}::timestamptz
      )`,
    )
    .join(",\n");

  const imageRows = records
    .map(
      (record) => `(
        ${sqlValue(record.imageId)}::uuid,
        ${sqlValue(record.id)}::uuid,
        ${sqlValue(bucketName)},
        ${sqlValue(record.storagePath)},
        ${sqlValue(record.altText)},
        0,
        ${imageWidth},
        ${imageHeight},
        ${record.byteSize},
        'image/webp'
      )`,
    )
    .join(",\n");

  const pieceIds = sqlUuidArray(records.map((record) => record.id));

  return `
BEGIN;

INSERT INTO public.pieces (
  id,
  code_number,
  name,
  brand,
  category_slug,
  size_label,
  condition_label,
  price_cents,
  description,
  status,
  published_at,
  sold_at
)
VALUES
${pieceRows}
ON CONFLICT (id)
DO UPDATE SET
  code_number = EXCLUDED.code_number,
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  category_slug = EXCLUDED.category_slug,
  size_label = EXCLUDED.size_label,
  condition_label = EXCLUDED.condition_label,
  price_cents = EXCLUDED.price_cents,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  sold_at = EXCLUDED.sold_at,
  updated_at = now();

SELECT setval(
  'public.pieces_code_number_seq',
  GREATEST((SELECT COALESCE(MAX(code_number), 1) FROM public.pieces), 1),
  true
);

INSERT INTO public.piece_images (
  id,
  piece_id,
  storage_bucket,
  storage_path,
  alt_text,
  position,
  width,
  height,
  byte_size,
  mime_type
)
VALUES
${imageRows}
ON CONFLICT (storage_path)
DO UPDATE SET
  piece_id = EXCLUDED.piece_id,
  storage_bucket = EXCLUDED.storage_bucket,
  alt_text = EXCLUDED.alt_text,
  position = EXCLUDED.position,
  width = EXCLUDED.width,
  height = EXCLUDED.height,
  byte_size = EXCLUDED.byte_size,
  mime_type = EXCLUDED.mime_type,
  updated_at = now();

COMMIT;

SELECT
  (SELECT count(*) FROM public.pieces WHERE id = ANY(${pieceIds})) AS demo_pieces,
  (SELECT count(*) FROM public.piece_images WHERE piece_id = ANY(${pieceIds})) AS demo_piece_images;
`;
}

function runSql(sql, env) {
  const tempDir = path.join(databaseDir, "supabase", ".temp");
  fs.mkdirSync(tempDir, { recursive: true });

  const sqlPath = path.join(tempDir, "seed-onesbryne-demo-catalog.sql");
  fs.writeFileSync(sqlPath, sql);

  const result = spawnSync(
    resolveSupabaseBin(),
    ["db", "query", "--linked", "--file", sqlPath],
    {
      cwd: databaseDir,
      env,
      encoding: "utf8",
      shell: false,
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    throw new Error(`Supabase SQL seed failed with exit code ${result.status}`);
  }
}

async function main() {
  const env = buildDatabaseEnv();
  const projectUrl = getProjectUrl(env);
  const storageApiKey = getStorageApiKey(env);

  if (!storageApiKey) {
    throw new Error(
      "Missing SUPABASE_LEGACY_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY in .env.database or the process environment.",
    );
  }

  const records = readCatalog();

  console.log(`Seeding ${records.length} Onesbryne demo catalog pieces.`);
  await uploadImages(projectUrl, storageApiKey, records);
  runSql(buildSeedSql(records), env);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
