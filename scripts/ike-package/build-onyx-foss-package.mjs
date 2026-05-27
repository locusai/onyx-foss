#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const PACKAGE_NAME = "@locusai/onyx-foss"
const DEFAULT_VERSION = "3.0.13-ike.8"
const FOSS_SOURCE_COMMIT = "071745492fe356ea66404a504775f58b6b5d0e0a"
const NON_FOSS_SOURCE_COMMIT = "8eb2e10203d5ab6d5a38e8adcd50b1eca8b20050"
const NON_FOSS_SOURCE_TAG = "v3.0.13"
const CARRY_HEAD = "2a82463a2107f15527cd3ae73cea2036b204ce12"
const CARRY_SUFFIX = "ike.8"

function parseArgs(argv) {
  const values = new Map()
  const flags = new Set()
  const valueArgs = new Set(["--version", "--out-dir", "--stage-dir"])

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index]
    if (valueArgs.has(arg)) {
      const value = argv[index + 1]
      if (!value) throw new Error(`Missing value for ${arg}`)
      values.set(arg, value)
      index += 1
      continue
    }
    flags.add(arg)
  }

  return { flags, values }
}

function repoRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..")
}

function git(root, args) {
  return execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim()
}

function gitStatus(root, args) {
  return spawnSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  })
}

function assertCarryPackageRootsUnchanged(root) {
  const ancestor = gitStatus(root, ["merge-base", "--is-ancestor", CARRY_HEAD, "HEAD"])
  if (ancestor.status !== 0) {
    throw new Error(`Expected package build HEAD to contain carry head ${CARRY_HEAD}`)
  }

  const packageRoots = ["web/src", "web/lib/opal/src", "web/public", "LICENSE", "README.md"]
  const diff = gitStatus(root, ["diff", "--quiet", CARRY_HEAD, "--", ...packageRoots])
  if (diff.status !== 0) {
    const changed = git(root, ["diff", "--name-only", CARRY_HEAD, "--", ...packageRoots])
    throw new Error(
      `Package source roots differ from carry head ${CARRY_HEAD}:\n${changed}`,
    )
  }
}

function copyRoot(root, stageRoot, relativePath) {
  const source = path.join(root, relativePath)
  if (!existsSync(source)) {
    throw new Error(`Missing required package source root: ${relativePath}`)
  }
  cpSync(source, path.join(stageRoot, relativePath), {
    recursive: true,
    dereference: false,
    filter(sourcePath) {
      const rel = path.relative(root, sourcePath).replaceAll("\\", "/")
      return !/(^|\/)(node_modules|\.git|\.cache|__pycache__)(\/|$)/u.test(rel)
    },
  })
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8")
}

function defaultArtifactDir(root) {
  return path.resolve(root, "..", "ike-replit-base-local", ".onyx-artifacts")
}

function sha256File(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex")
}

function npmEnv(root) {
  return {
    ...process.env,
    NODE_OPTIONS: "",
    npm_config_cache: path.join(root, ".onyx-package", "npm-cache"),
  }
}

function main() {
  const args = parseArgs(process.argv)
  const root = repoRoot()
  const version = args.values.get("--version") ?? process.env.ONYX_PACKAGE_VERSION ?? DEFAULT_VERSION
  const stageDir = path.resolve(args.values.get("--stage-dir") ?? path.join(root, ".onyx-package", "stage"))
  const outDir = path.resolve(args.values.get("--out-dir") ?? defaultArtifactDir(root))
  const head = git(root, ["rev-parse", "HEAD"])

  assertCarryPackageRootsUnchanged(root)

  rmSync(stageDir, { recursive: true, force: true })
  mkdirSync(stageDir, { recursive: true })
  mkdirSync(outDir, { recursive: true })

  copyRoot(root, stageDir, "web/src")
  copyRoot(root, stageDir, "web/lib/opal/src")
  copyRoot(root, stageDir, "web/public")
  cpSync(path.join(root, "LICENSE"), path.join(stageDir, "LICENSE"))
  cpSync(path.join(root, "README.md"), path.join(stageDir, "README.md"))

  const provenance = {
    packageName: PACKAGE_NAME,
    packageVersion: version,
    carryBasis: FOSS_SOURCE_COMMIT,
    carryHead: CARRY_HEAD,
    packageBuildHead: head,
    carrySuffix: CARRY_SUFFIX,
    upstreamFossRepo: "onyx-dot-app/onyx-foss",
    upstreamFossCommit: FOSS_SOURCE_COMMIT,
    upstreamFossTag: "nightly-latest-20260227",
    upstreamNonFossRepo: "onyx-dot-app/onyx",
    upstreamNonFossCommit: NON_FOSS_SOURCE_COMMIT,
    upstreamNonFossTag: NON_FOSS_SOURCE_TAG,
    upstreamNonFossRelease: NON_FOSS_SOURCE_TAG,
    sourceLicenseSha256: sha256File(path.join(root, "LICENSE")),
  }

  writeJson(path.join(stageDir, "package.json"), {
    name: PACKAGE_NAME,
    version,
    description: "LocusAI carried Onyx FOSS source package for IKE hydration",
    license: "SEE LICENSE IN LICENSE",
    type: "module",
    files: [
      "web/src",
      "web/lib/opal/src",
      "web/public",
      "onyx-foss-provenance.json",
      "LICENSE",
      "README.md",
    ],
    publishConfig: {
      registry: "https://npm.pkg.github.com",
    },
  })
  writeJson(path.join(stageDir, "onyx-foss-provenance.json"), provenance)

  const packJson = execFileSync("npm", ["pack", "--json", "--pack-destination", outDir], {
    cwd: stageDir,
    env: npmEnv(root),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  })
  const [packResult] = JSON.parse(packJson)
  if (!packResult?.filename) {
    throw new Error(`npm pack did not return an artifact filename: ${packJson}`)
  }
  const artifactPath = path.join(outDir, packResult.filename)

  const verifyScript = path.join(root, "scripts", "ike-package", "verify-onyx-foss-package.mjs")
  execFileSync("node", [verifyScript, artifactPath, "--version", version, "--source-root", root], {
    cwd: root,
    stdio: "inherit",
  })

  if (!args.flags.has("--quiet")) {
    process.stdout.write(`${artifactPath}\n`)
  }
}

main()
