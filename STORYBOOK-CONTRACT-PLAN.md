# Storybook Contract Plan (Onyx FOSS → IKE Base → Adapters Alignment)

## Summary (what we’re doing and why)

We will treat Storybook as the visual contract harness for the Onyx chat window (transcript renderer + timeline + tool/citation/deep-research blocks), then port that same contract into IKE Base so downstream renders the same UX states, and finally align existing adapters/implementations to satisfy the contract.

Priority order:

1. Chat window / transcript + elements (timeline, markdown, tool blocks, citations, deep research, stop/error)
2. Composer (AppInputBar)
3. Sidebars (already present upstream; explicitly de‑prioritized for the contract)

Storybook version baseline:

- Canonical Storybook: 10.2.13 (onyx-foss already uses this; another agent is upgrading ike-base-replit to match)

---

## Progress (as of 2026-02-26)

### onyx-foss

- ✅ Created branch: `topic/onyx-storybook-contract-chat`
- ✅ Added Tier‑1 contract fixtures (raw + typed):
  - `web/src/stories/Contract/fixtures/raw/onyxChatContractFixtures.ts`
  - `web/src/stories/Contract/fixtures/index.ts`
- ✅ Added Tier‑1 contract stories:
  - `web/src/stories/Contract/Chat/Transcript.stories.tsx`
    - MarkdownFixture, CustomTool, ParallelTools, SearchToolDocuments, Citations, DeepResearch, ImageGeneration, FileReader, MemoryTool, Reasoning, Stopped, Error
  - `web/src/stories/Contract/Chat/TranscriptDemo.stories.tsx`
    - DemoConversation
  - Shared story-only renderer: `web/src/stories/Contract/Chat/ContractTranscriptRenderer.tsx`
- ✅ Storybook build passes: `cd web && pnpm build-storybook` (v10.2.13)
- ✅ Storybook-only mock added for `/api/chat/file/:fileId` so image/file fixtures render without a backend: `web/.storybook/preview.tsx`
- ✅ Fixed MSW `onUnhandledRequest` URL parsing so static assets don’t 500: `web/.storybook/preview.tsx`
- ✅ Timeline now supports “always expanded” rendering when `collapsible={false}` (needed for contract harness display): `web/src/app/app/message/messageComponents/timeline/AgentTimeline.tsx`
- ✅ MCP proof-of-life: `http://localhost:6007/?path=/story/contract-onyx-chat-transcript--markdown-fixture` loaded (using port 6007 because 6006 was in use)
- ✅ MCP screenshots captured (repo root):
  - `onyx-storybook-contract-transcript-markdown.png`
  - `onyx-storybook-contract-transcript-markdown-dark.png`
  - `onyx-storybook-contract-transcript-custom-tool.png`
  - `onyx-storybook-contract-transcript-citations.png`
  - `onyx-storybook-contract-transcript-deep-research.png`
  - `onyx-storybook-contract-transcript-image-generation.png`
  - `onyx-storybook-contract-transcript-demo-conversation.png`
  - `onyx-storybook-contract-transcript-demo-conversation-dark.png`

### ike-base-replit

- ✅ Storybook upgraded to 10.x (target: 10.2.13) — Phase 2 port work can start
- ⏳ Phase 2 work will stay on the existing branch `codex/ike-chat-onyx` (pre-existing; do not create additional `codex/*` branches)

### ike-agents

- ⏳ Not started

---

## Repos + Working Directories (absolute paths for a new session)

These are separate git repos/worktrees:

- Upstream source UI: onyx-foss
  - Repo root: /Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/onyx-foss
  - Frontend root: /Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/onyx-foss/web
  - Storybook config: /Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/onyx-foss/web/.storybook
- Downstream app + Storybook: ike-base-replit
  - Repo root: /Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit
  - Storybook config: /Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/.storybook
  - Vendored Onyx UI package: /Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/packages/openclaw-onyx-chatui-plugin
- Downstream agents platform: ike-agents
  - Repo root: /Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-agents

Package manager:

- Use pnpm everywhere.

Branch naming constraint (critical):

- Do not create branches starting with codex/. Use topic/, feat/, pr/, etc.

Recommended branch names (create separately in each repo):

- topic/onyx-storybook-contract-chat
- topic/onyx-storybook-contract-chat-port
- topic/onyx-adapter-contract-align

---

## Current State (so you don’t re-discover it)

### onyx-foss (web/)

Already has Storybook scaffold + first-wave stories:

- Storybook deps in web/package.json: storybook@10.2.13, @storybook/nextjs@10.2.13
- Config:
  - web/.storybook/main.ts uses @storybook/nextjs
  - web/.storybook/preview.tsx imports ../src/app/globals.css, wraps stories with web/src/stories/StoryProviders.tsx, and configures MSW handlers
- Existing stories (mostly shell/composer/sidebar):
  - web/src/stories/Chat/AppInputBar.stories.tsx
  - web/src/stories/Landing/*
  - web/src/stories/Navigation/Sidebar/*

### ike-base-replit

- Storybook exists (currently SB 9.1.5 but being upgraded to 10.2.13 by another agent)
- Vendored transcript renderer exists and is used downstream:
  - packages/openclaw-onyx-chatui-plugin/src/OnyxFullChatClient.tsx
  - Packet contract type is placement+obj (same shape as upstream): Packet re-exported as OnyxPacket
- Debug packet fixture exists: client/src/pages/__debug/OnyxPreview.tsx

### ike-agents

- No Storybook today.
- Has a separate minimal UI plugin and simplified packet types (diverges from the canonical OnyxPacket union).

---

## Phase 0 — Preflight + Version Alignment (do this first)

### 0.1 Create branches (each repo independently)

In each repo root:

- git switch -c topic/onyx-storybook-contract-chat (or the appropriate branch name above)

### 0.2 Confirm Storybook 10.2.13 in ike-base-replit after the other agent’s upgrade

Acceptance: pnpm storybook works and prints/uses Storybook 10.2.13.

- If the upgrade lands via PR/branch, merge/rebase your Storybook work on top of it (avoid parallel Storybook config edits).

### 0.3 MCP validation baseline (non-visual contract yet)

Goal: verify Storybook is accessible in both repos using MCP (Playwright).

Run servers (one at a time to avoid port conflicts):

- onyx-foss:
  - cd /Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/onyx-foss/web
  - pnpm storybook (port 6006)
- ike-base-replit:
  - cd /Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit
  - pnpm storybook (port 6006)

Validate via MCP Playwright:

- Navigate to http://localhost:6006
- Open a known story URL (e.g. existing Landing/WelcomeMessage)
- Take a screenshot for “baseline proof of life”

Deliverable: a short “MCP validation note” in the plan doc (what URL/story ID loaded, where screenshot saved).

---

## Phase 1 — Define the Tier‑1 “Chat Contract” Story Suite in onyx-foss (source-of-truth visuals)

### 1.1 Contract story taxonomy + titles (stable IDs)

Create new contract stories under a stable namespace so we can port them downstream without ambiguity:

- Contract/Onyx/Chat/Transcript
- Contract/Onyx/Chat/Transcript (Demo)
- (later) Contract/Onyx/Chat/Composer

Do not rename/remove existing stories; keep them as “app UI stories” but outside the contract.

### 1.2 Add canonical “raw fixtures” (portable, no Next imports, minimal/no absolute imports)

Goal: fixtures should be pure data so they can be copied into ike-base without path/Next issues.

Add in onyx-foss:

- web/src/stories/Contract/fixtures/raw/onyxChatContractFixtures.ts
  - Exports plain objects for:
    - documents (a small set of OnyxDocument-shaped objects)
    - scenarios keyed by name:
      - markdownFixture
      - customToolFixture
      - parallelToolsFixture
      - searchToolFixture
      - citationsFixture
      - deepResearchFixture
      - imageGenerationFixture
      - fileReaderFixture
      - memoryToolFixture
      - reasoningFixture
      - stoppedFixture (StopReason.USER_CANCELLED)
      - errorFixture
    - demoConversationTurns (multi-turn array used by the “Demo” story)

Rules for raw fixtures:

- No imports from next/*
- Prefer no imports at all (just exported constants)
- Keep URLs/images deterministic (use a static placeholder URL already available in repo or a stable public placeholder)

### 1.3 Add typed fixture adapter (upstream-only type safety)

Add in onyx-foss:

- web/src/stories/Contract/fixtures/index.ts
  - Imports Packet type from web/src/app/app/services/streamingModels.ts
  - Exports typed wrappers/casts for the raw fixtures (so upstream stories are typechecked)

### 1.4 Implement the transcript contract stories (chat window focus)

Add in onyx-foss:

- web/src/stories/Contract/Chat/Transcript.stories.tsx
- web/src/stories/Contract/Chat/TranscriptDemo.stories.tsx

Rendering strategy (to maximize downstream comparability):

- Implement a small story-only “assistant turn renderer” that mirrors downstream’s OnyxFullChatClient approach:
  - Use usePacketProcessor + usePacedTurnGroups
  - Render AgentTimeline + RendererComponent with animate={false}
- Wrap in a “chat window” layout that matches downstream’s bubble styling where possible:
  - Right-aligned user bubble
  - Assistant timeline + rendered markdown blocks below

Component mapping (upstream):

- Packets/types: web/src/app/app/services/streamingModels.ts
- Timeline: web/src/app/app/message/messageComponents/timeline/AgentTimeline.tsx
- Rendering: web/src/app/app/message/messageComponents/renderMessageComponent.tsx
- Hooks: web/src/app/app/message/messageComponents/timeline/hooks/usePacketProcessor.ts, usePacedTurnGroups.ts

Story list (minimum Tier‑1 contract):

1. MarkdownFixture
2. CustomTool
3. ParallelTools
4. SearchToolDocuments
5. Citations
6. DeepResearch
7. ImageGeneration
8. FileReader
9. MemoryTool
10. Reasoning
11. Stopped
12. Error
13. DemoConversation (multi-turn, “looks like product”)

### 1.5 Upstream acceptance criteria (Phase 1)

- cd web && pnpm storybook renders all Contract/Onyx/Chat/* stories without real backend
- Light/dark toggle works via class switching (no manual dark: usage in new code)
- pnpm build-storybook succeeds in web/

### 1.6 MCP visual validation (contract stories)

Using Playwright MCP:

- Capture screenshots of:
  - MarkdownFixture (light + dark)
  - CustomTool (light)
  - Citations (light)
  - DeepResearch (light)
  - DemoConversation (light + dark)
- Save filenames with repo + story name (so cross-repo comparison is easy later)

---

## Phase 2 — Port the same Tier‑1 contract stories into ike-base-replit Storybook (downstream)

Note: we are not “skipping Phase 4”; we’re intentionally doing **Phase 2 + Phase 4.2 together** so the contract stories land with the minimum adapter invariants + tests needed to keep the contract stable.

### 2.1 Decide where the downstream stories live

Canonical location (recommended):

- Put contract stories inside the vendored UI package so they move with the package:
  - ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/stories/Contract/...

### 2.2 Ensure ike-base Storybook includes those story globs

Update (after SB upgrade lands):

- ike-base-replit/.storybook/main.ts
  - Add a stories glob for:
    ../packages/openclaw-onyx-chatui-plugin/src/stories/**/*.stories.@(ts|tsx)

### 2.3 Copy/sync raw fixtures into ike-base (exact same data)

Add in ike-base:

- packages/openclaw-onyx-chatui-plugin/src/stories/Contract/fixtures/raw/onyxChatContractFixtures.ts
  - Sync from onyx-foss raw fixtures (Phase 1.2) **via the existing sync tooling** (no manual copy)
  - Mechanism:
    - Add the upstream file to `packages/openclaw-onyx-chatui-plugin/upstream/manifest.json`
    - Run: `node packages/openclaw-onyx-chatui-plugin/upstream/sync.mjs --sync`

Add typed adapter in ike-base (package-local):

- packages/openclaw-onyx-chatui-plugin/src/stories/Contract/fixtures/index.ts
  - Imports Packet type from the vendored synced path:
    - packages/openclaw-onyx-chatui-plugin/src/synced/app/app/services/streamingModels.ts
  - Exports typed fixtures for downstream stories

### 2.3.1 Sync contract assets (images/files) for deterministic Storybook renders

Problem: upstream image fixtures resolve via `/api/chat/file/:fileId` in the full Onyx app. IKE Base Storybook has no such route by default, so contract stories need a deterministic asset source.

Decision (Phase 2): sync the two contract images from onyx-foss into IKE Base static assets:

- Destination (IKE Base): `client/public/onyx-contract/`
  - `client/public/onyx-contract/craft_demo_image_1.png`
  - `client/public/onyx-contract/craft_demo_image_2.png`
- Source (Onyx): `web/public/`
  - `web/public/craft_demo_image_1.png`
  - `web/public/craft_demo_image_2.png`

Constraint: these asset copies must happen through the same vendoring sync tooling (manifest + `sync.mjs`), not by hand.

### 2.3.2 Asset URL resolver must be adapter/config driven (not Storybook-only MSW)

Add a small configuration surface in the vendored plugin so environments can decide where `file_id` URLs resolve:

- Default behavior remains `/api/chat/file/:fileId` (so the UI keeps matching upstream expectations).
- Contract Storybook config overrides `file_id` resolution so:
  - `storybook-contract-image-1` → `/onyx-contract/craft_demo_image_1.png`
  - `storybook-contract-image-2` → `/onyx-contract/craft_demo_image_2.png`

(If/when OpenClaw supports file download, the gateway adapter can later provide a real resolver without changing the UI contract.)

### 2.4 Implement downstream contract stories using OnyxFullChatClient

Add in ike-base:

- packages/openclaw-onyx-chatui-plugin/src/stories/Contract/Chat/Transcript.stories.tsx
- packages/openclaw-onyx-chatui-plugin/src/stories/Contract/Chat/TranscriptDemo.stories.tsx

Rendering strategy (downstream):

- Render OnyxFullChatClient with turns built from the same fixtures.
- Keep story names aligned with upstream (same exported story names) even if component differs.
- Contract stories must set the plugin’s `file_id` URL resolver (2.3.2) so `ImageGeneration` renders without 404s.

Component mapping (downstream):

- UI entrypoint: packages/openclaw-onyx-chatui-plugin/src/OnyxFullChatClient.tsx
- Vendored timeline/renderer/hooks: under packages/openclaw-onyx-chatui-plugin/src/synced/app/app/...

### 2.5 Downstream acceptance criteria (Phase 2)

- pnpm storybook (ike-base) shows Contract/Onyx/Chat/* stories and they render deterministically
- `ImageGeneration` renders images without 404s
- No unexpected 400/500 network errors when opening contract stories
- pnpm storybook:build (or the repo’s build script name post-upgrade) succeeds
- MCP Playwright screenshots captured for the same story set as Phase 1.6

---

## Phase 3 — Tier‑2 Integration Stories (ike-base-replit only; not portable)

These stories verify full app wiring and gateway adapter behavior; they are allowed to be IKE-specific.

Re-evaluate the exact “gateway connected” integration surface after Phase 2 lands (the Phase 2 asset resolver shape influences whether we add an `/api/chat/file/*` route, a gateway proxy, or keep everything static for contract-only).

### 3.1 Add integration stories

Add in ike-base (location can be client/src/stories/**):

- Integration/Onyx/GatewayConnectedChat
  - Renders client/src/components/onyx/OpenClawOnyxChat.tsx (or a minimal wrapper around it)
  - Uses MSW or a local fake gateway stream to simulate:
    - session list + switching
    - abort/stop
    - reconnect/resume (if supported)

### 3.2 Integration acceptance criteria

- Story runs without requiring a real backend by default
- Optional “real backend mode” is opt-in via env var (mirrors existing patterns like storybook:real-llm)

---

## Phase 4 — Align existing implementations to the contract (packets + adapters)

### 4.1 Establish contract invariants (shared checklist)

For any adapter/mapping emitting OnyxPacket sequences:

- Every assistant turn is terminal: emits `stop` (optionally preceded by `error`) and never emits packets after `stop`
- Tool steps have coherent grouping via `placement` (`turn_index`, `tab_index`, and `sub_turn_index` when applicable)
- `stop_reason=user_cancelled` results in the “stopped” header state and blocks any further deltas

### 4.2 ike-base: gateway mapper compliance tests

Add “contract compliance” unit tests in ike-base for:

- `client/src/lib/openclaw-gateway/openclawOnyxMapper.ts`
  - Extend mapper to ignore any events after a terminal state (final/aborted/error) for a runId
  - Keep the runtime adapter client-side (browser gateway), but put invariants + mapping helpers in pure modules so they can be ported to ike-agents later
- Add a small shared invariants helper (pure TS) used by tests:
  - `client/src/lib/onyx-contract/*` (e.g., `validateOnyxPacketSequence(...)`)
  - Checks: “no packets after stop”, stop/error ordering, placement sanity, parallel branch keys when present

Use the same raw fixtures as golden inputs/expected shapes where possible.

### 4.3 ike-agents: converge packet mapping toward canonical OnyxPacket

Goal: ike-agents adapters should be able to drive the canonical UI contract.

Work items:

- Replace or wrap ike-agents’ simplified packet union so it can represent the canonical OnyxPacket (placement + obj) kinds used in the contract fixtures.
- Update packages/agent/src/onyx/gateway-packet-mapping.ts (and any related adapters) to emit the canonical shapes.
- Add unit tests in ike-agents that validate the same invariants as 4.1.

Acceptance:

- A “contract fixture playback” test passes (feed fixture packets through the renderer/processor or validate structural invariants).

---

## Phase 5 — Guardrails + CI gates (so Storybook becomes the contract gate)

### 5.1 Visual gates

For each repo that hosts the contract stories (onyx-foss web + ike-base):

- pnpm build-storybook must pass in CI
- Add a minimal screenshot/visual regression step (Chromatic or Playwright) for:
  - MarkdownFixture (light/dark)
  - Citations
  - DeepResearch
  - DemoConversation (light/dark)

### 5.2 Contract freeze log

Add a small markdown log (location decided per repo) stating:

- Any change to OnyxPacket shapes used by contract stories requires:
  - fixture update
  - screenshot update
  - adapter compliance test update

---

## Public API / Interface Changes (explicit)

No production API changes are required to start the contract stories.

Planned/likely interface additions (later phases, aligned with the broader consolidation plan):

- A first-class CapabilityManifestV1 and a ResolvedCapabilities merge rule (backend + agent + session), used to gate UI features deterministically.
- A shared adapter interface (sessions/history/stream/abort) suitable for multiple backends.

---

## Test Plan (by repo)

### onyx-foss

- cd web && pnpm build-storybook
- (Optional) add Storybook interaction/Playwright runner later; for now MCP screenshots are the validation artifact.

### ike-base-replit

- pnpm storybook:build (script name may change after SB 10 upgrade; update accordingly)
- pnpm test-storybook / existing vitest Storybook tests (ensure they still run post-upgrade)
- New unit tests for gateway mapper (Phase 4.2)

### ike-agents

- pnpm test in the affected packages
- New unit tests for canonical packet mapping invariants (Phase 4.3)

---

## Explicit Assumptions / Defaults

- Storybook 10.2.13 is the canonical version across onyx-foss and ike-base (ike-base upgrade is handled by another agent and will be complete before Phase 2 work starts).
- Tier‑1 contract stories are chat window focused and must be as backend-free and deterministic as possible.
- Sidebars are not part of the initial contract suite (they remain as upstream-only app stories until explicitly promoted).

---

## Progress Update — 2026-02-27 (Avatar/Icon small win)

Scope: P0 avatar/icon parity focus in IKE Base Storybook (`http://localhost:5001`).

### Synced via manifest + sync tool (no manual copy)

- Manifest updates in `ike-base-replit/packages/openclaw-onyx-chatui-plugin/upstream/manifest.json`:
  - Added target `foss-icons`:
    - upstream: `onyx-foss/web/src/components/icons/icons.tsx`
    - local: `ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/shims/components/icons/icons.tsx`
  - Expanded target `onyx-public` file list to include all icon assets referenced by canonical `icons.tsx` under `onyx-foss/web/public/*`, synced to `ike-base-replit/client/public/onyx-public/*`.
- Executed sync:
  - `node packages/openclaw-onyx-chatui-plugin/upstream/sync.mjs --sync`

### Forked files (and why)

- `foss-icons:icons.tsx` is marked forked (target-level forks) to preserve IKE/Vite compatibility:
  - Replaced `next/image` with native `<img>`.
  - Replaced `@public/*` imports with deterministic runtime URLs under `/onyx-public/*`.
  - Kept canonical icon exports so existing downstream imports remain stable.
- Focused local avatar patch:
  - `ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/synced/refresh-components/avatars/AgentAvatar.tsx`
  - Switched relative imports to `@onyx/*`.
  - Updated non-default agent avatar rendering to canonical octagon style (`SvgOnyxOctagon` + glyph), removing old circular placeholder look.
  - Increased octagon/avatar glyph contrast (`text-05`/`stroke-text-05`) so the octagon is visible at timeline size.

### Validation (IKE Storybook only)

- Build validation:
  - `direnv exec . pnpm storybook:build` (pass)
- Story IDs checked on IKE Storybook (`localhost:5001`):
  - `contract-onyx-chat-transcript--markdown-fixture` (light + dark)
  - `contract-onyx-chat-transcript--custom-tool` (light; avatar focus)
  - `contract-onyx-chat-transcript--citations` (light; source-tag details)
  - `contract-onyx-chat-transcript--file-reader` (light; tool step)
- Evidence screenshots captured:
  - `/tmp/ike-storybook-contract-transcript-markdown-light-20260227-v2.png`
  - `/tmp/ike-storybook-contract-transcript-markdown-dark-20260227.png`
  - `/tmp/ike-storybook-contract-transcript-custom-tool-light-20260227.png`
- `/tmp/ike-storybook-contract-transcript-custom-tool-light-avatar-fixed-20260227.png`
  - `/tmp/ike-avatar-wrapper-contrast-20260227.png` (zoomed avatar proof)
  - `/tmp/ike-storybook-contract-transcript-citations-light-details-20260227.png`
  - `/tmp/ike-storybook-contract-transcript-file-reader-light-20260227.png`
- Network sanity check (iframe session):
  - No unexpected 4xx/5xx observed.
  - Observed: `GET /index.json` 200, `GET /api/runtime-config` 200.

## Progress Update — 2026-02-27 (Code block frame/header formatting)

Scope: next visual gap after avatar/icon parity — code-block card/frame spacing in IKE Storybook markdown fixture.

### Root cause + fix

- Root cause: typography defaults were still applying `pre` top/bottom margins in IKE, which created extra spacing between the code-block header row and code frame.
- Patched in synced source:
  - `ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/synced/app/app/message/custom-code-styles.css`
  - Added `!important` overrides for `pre` margin/padding reset selectors used in markdown (`pre[class*="language-"]` and `.prose :where(pre)...`).
- Regenerated scoped CSS artifacts:
  - `direnv exec . pnpm --filter openclaw-onyx-chatui-plugin build:scoped-css`
  - Updated generated files in plugin (`custom-code-styles.scoped.css`, `onyx.utilities.scoped.css`).
- Marked file as forked to avoid future sync overwrite:
  - Added `app/app/message/custom-code-styles.css` to `synced.forks` in `ike-base-replit/packages/openclaw-onyx-chatui-plugin/upstream/manifest.json`.

### Validation (IKE Storybook only)

- Story ID: `contract-onyx-chat-transcript--markdown-fixture` on `http://localhost:5001`.
- Verified computed style on code-block `pre`: `marginTop=0px`, `marginBottom=0px` (previously 24px).
- Evidence screenshot:
  - `/tmp/ike-storybook-contract-transcript-markdown-light-codeframe-fixed-20260227.png`
