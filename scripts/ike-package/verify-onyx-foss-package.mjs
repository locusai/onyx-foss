#!/usr/bin/env node

import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs"
import os from "node:os"
import path from "node:path"

const PACKAGE_NAME = "@locusai/onyx-foss"
const REQUIRED_ROOTS = ["web/src", "web/lib/opal/src", "web/public"]
const BANNED_PATTERNS = [
  /^backend(?:\/|$)/u,
  /(^|\/)node_modules(?:\/|$)/u,
  /(^|\/)\.git(?:\/|$)/u,
  /(^|\/)\.cache(?:\/|$)/u,
  /^dist(?:\/|$)/u,
  /^build(?:\/|$)/u,
  /^\.onyx-package(?:\/|$)/u,
  /(^|\/)\.env(?:\.|$)/u,
  /(^|\/)(settings|secrets?)\.json$/u,
]

function parseArgs(argv) {
  const values = new Map()
  const valueArgs = new Set(["--version", "--source-root"])
  const positionals = []

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index]
    if (valueArgs.has(arg)) {
      const value = argv[index + 1]
      if (!value) throw new Error(`Missing value for ${arg}`)
      values.set(arg, value)
      index += 1
      continue
    }
    positionals.push(arg)
  }

  return { values, positionals }
}

function listTarball(tarballPath) {
  return execFileSync("tar", ["-tzf", tarballPath], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"))
}

function ensureNoBannedEntries(entries) {
  for (const entry of entries) {
    if (!entry.startsWith("package/")) {
      throw new Error(`Unexpected tarball entry outside package/: ${entry}`)
    }
    const rel = entry.slice("package/".length)
    if (rel.length === 0) continue
    for (const pattern of BANNED_PATTERNS) {
      if (pattern.test(rel)) {
        throw new Error(`Banned package entry: ${rel}`)
      }
    }
  }
}

function ensureRequiredRoots(entries) {
  for (const requiredRoot of REQUIRED_ROOTS) {
    const prefix = `package/${requiredRoot}/`
    if (!entries.some((entry) => entry.startsWith(prefix))) {
      throw new Error(`Package is missing required source root: ${requiredRoot}`)
    }
  }
}

function ensureLicensePreserved({ extractedRoot, sourceRoot }) {
  if (!sourceRoot) return
  const sourceLicensePath = path.join(sourceRoot, "LICENSE")
  const packageLicensePath = path.join(extractedRoot, "LICENSE")
  if (!existsSync(sourceLicensePath) || !existsSync(packageLicensePath)) {
    throw new Error("Cannot verify LICENSE preservation; source or package LICENSE is missing")
  }
  const sourceLicense = readFileSync(sourceLicensePath, "utf8")
  const packageLicense = readFileSync(packageLicensePath, "utf8")
  if (sourceLicense !== packageLicense) {
    throw new Error("Package LICENSE differs from source LICENSE")
  }
}

function sha256File(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex")
}

function main() {
  const args = parseArgs(process.argv)
  const tarballPath = path.resolve(args.positionals[0] ?? "")
  if (!tarballPath || !existsSync(tarballPath)) {
    throw new Error(`Missing package tarball: ${args.positionals[0] ?? "<none>"}`)
  }

  const expectedVersion = args.values.get("--version") ?? null
  const sourceRoot = args.values.get("--source-root")
    ? path.resolve(args.values.get("--source-root"))
    : null
  const entries = listTarball(tarballPath)
  ensureNoBannedEntries(entries)
  ensureRequiredRoots(entries)

  const tempDir = mkdtempSync(path.join(os.tmpdir(), "onyx-foss-package-"))
  try {
    execFileSync("tar", ["-xzf", tarballPath, "-C", tempDir], {
      stdio: ["ignore", "ignore", "pipe"],
    })
    const extractedRoot = path.join(tempDir, "package")
    const packageJson = readJson(path.join(extractedRoot, "package.json"))
    const provenance = readJson(path.join(extractedRoot, "onyx-foss-provenance.json"))

    if (packageJson.name !== PACKAGE_NAME) {
      throw new Error(`Package name mismatch: expected ${PACKAGE_NAME}, found ${packageJson.name}`)
    }
    if (expectedVersion && packageJson.version !== expectedVersion) {
      throw new Error(`Package version mismatch: expected ${expectedVersion}, found ${packageJson.version}`)
    }
    if (provenance.packageName !== PACKAGE_NAME) {
      throw new Error(`Provenance packageName mismatch: ${provenance.packageName}`)
    }
    if (provenance.packageVersion !== packageJson.version) {
      throw new Error("Provenance packageVersion does not match package.json")
    }
    if (sourceRoot && provenance.sourceLicenseSha256 !== sha256File(path.join(sourceRoot, "LICENSE"))) {
      throw new Error("Provenance sourceLicenseSha256 does not match source LICENSE")
    }
    ensureLicensePreserved({ extractedRoot, sourceRoot })
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }

  process.stdout.write(`Verified ${PACKAGE_NAME}@${expectedVersion ?? "<package-version>"}\n`)
}

main()
