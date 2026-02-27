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

## Dev Notes (facts; full fidelity, no dates)

Global:
- Canonical Storybook: 10.2.13 in onyx-foss and ike-base-replit.
- Worktrees:
  - onyx-foss: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/onyx-foss`
  - ike-base-replit: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit`
  - ike-agents: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-agents`
- Package manager: pnpm everywhere.
- Branch constraint: do not create new `codex/*` branches; use `topic/*` or repo‑standard prefixes.
- Non‑suppression rule: anything emitted today must be shown (if not fully rendered, display a placeholder bubble), except when explicitly gated by a UI toggle (e.g., thinking).

Layer A — UI surface (onyx-foss + ike-base plugin):
- onyx-foss contract fixtures + stories: `web/src/stories/Contract/**`.
- Storybook preview mocks `/api/chat/file/:fileId` for contract images.
- `AgentTimeline` supports `collapsible={false}` for contract harness display.
- Plugin UI entrypoint: `packages/openclaw-onyx-chatui-plugin/src/OnyxFullChatClient.tsx`.
- Completed UI changes and exact implementation steps are recorded in the Running Status Matrix (Complete items tables per layer).

Layer B — Adapter/runtime (ike-base):
- OpenClaw gateway adapter: `client/src/lib/openclaw-gateway/`.
- Packet invariants helper: `client/src/lib/onyx-contract/validateOnyxPacketSequence.ts`.
- Capability manifest uses `CapabilityManifest` with a `version` property (no `V1` suffix).

Layer C — Integration (ike-base):
- Integration stories live under `client/src/stories/Integrations/Onyx/*`.
- Debug routes moved into integration storybooks (commit: `fc887ce4`).

Validation evidence (ike-base Storybook) — how to capture:
- Run: `direnv exec . pnpm storybook:build`.
- Start Storybook: `direnv exec . pnpm storybook` (or repo script).
- Open story IDs:
  - `contract-onyx-chat-transcript--markdown-fixture`
  - `contract-onyx-chat-transcript--custom-tool`
  - `contract-onyx-chat-transcript--citations`
  - `contract-onyx-chat-transcript--file-reader`
- Capture screenshots via Playwright or browser DevTools. Store under a stable repo path (not `/tmp`) and include story name in filename.
- Network sanity check: ensure `GET /index.json` and `GET /api/runtime-config` return 200 with no unexpected 4xx/5xx.

---

## Running Status Matrix (by layer)

Layer A — UI (packages/openclaw-onyx-chatui-plugin)
Scope: transcript rendering + shell/composer UI. This is the primary parity surface.
| Functionality | Onyx (existing) | OpenClaw (status + priority + pointers) | Ike-agent |
| --- | --- | --- | --- |
| Transcript rendering (timeline + rich packets) | `OnyxFullChatClient.tsx` + synced timeline/renderer. | **Partial (P0)** — renders assistant/tool packets but missing system cards + timestamp labels + reasoning visibility. Feasibility: supported by existing timeline/renderer; no new renderer required. Implement in `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/OnyxFullChatClient.tsx`. | |
| System cards | Onyx timeline/tool/reasoning renderers already support system‑style cards; adapt these. | **Missing (P0)** — map system role to system card using existing renderers (no suppression). Feasibility: supported by existing Onyx timeline renderers; no new renderer required. Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/synced/app/app/message/messageComponents/renderMessageComponent.tsx`, `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/synced/app/app/message/messageComponents/timeline/`. | |
| Timestamp labels (metadata, not inline) | `timestampLabel` exists on `OnyxFullChatTurn.user`. | **Missing (P0)** — render label outside the bubble; keep user text clean. Feasibility: supported by existing turn shape; UI-only change. Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/OnyxFullChatClient.tsx`. | |
| Thinking/reasoning visibility | Reasoning renderer exists in synced timeline. | **Missing (P0)** — emit reasoning packets in adapter and show when capability + session allow. Feasibility: supported by existing reasoning renderer; requires adapter mapping. Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/synced/app/app/message/messageComponents/timeline/renderers/reasoning/ReasoningRenderer.tsx`. | |
| Reading indicator | Not present in plugin. | **Missing (P1)** — add derived item when stream exists but empty. Feasibility: requires new UI logic (no existing component). Research: Control UI `app-scroll.ts` + `buildChatItems`. | |
| Compaction markers | Not wired in plugin. | **Missing (P1)** — use `HistoryResult.compactionMarkers` to insert divider items. Feasibility: requires new UI logic (no existing component). Research: Control UI `groupMessages` / `buildChatItems`. | |
| Scroll anchoring + new‑messages pill | `ChatScrollContainer` only. | **Missing (P1)** — add `useChatScrollAnchoring` (threshold 450px). Feasibility: requires new hook + pill UI. Research: Control UI `app-scroll.ts`. | |
| Tool output sidebar | Not in plugin. | **Missing (P2)** — ToolOutputPanel + ResizableDivider. Feasibility: requires new UI components (not present in plugin). Research: Control UI `markdown-sidebar.ts`. | |
| Header controls (session select, refresh, thinking, focus) | Not in plugin. | **Missing (P1)** — build `OnyxChatTabShell` header controls. Feasibility: requires new UI components (not present in plugin). Research: Control UI `openclaw-app` + renderChat props. | |
| Composer input + queue + stop/new | Not in plugin. | **Missing (P0 after transcript basics)** — implement Control UI parity. Feasibility: requires new composer UI + runtime logic (not present in plugin). Research: Control UI `app-chat.ts` + composer handlers. | |

Complete items:
| Functionality | Onyx (existing) | OpenClaw (status + pointers) | Ike-agent |
| --- | --- | --- | --- |
| User bubble rendering | Implemented in `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/OnyxFullChatClient.tsx`. | **Complete** — no changes. | |
| Avatar/icon parity (implemented) | Onyx icons source: `web/src/components/icons/icons.tsx` + `web/public/*`. | **Complete** — how: update `packages/openclaw-onyx-chatui-plugin/upstream/manifest.json` (add `foss-icons`, expand `onyx-public`), run `node packages/openclaw-onyx-chatui-plugin/upstream/sync.mjs --sync`, fork `packages/openclaw-onyx-chatui-plugin/src/shims/components/icons/icons.tsx` to use `img` + `/onyx-public/*`, update `AgentAvatar.tsx` to canonical octagon + contrast. | |
| Code-block frame spacing (implemented) | Onyx base styles in `app/app/message/custom-code-styles.css`. | **Complete** — how: patch `packages/openclaw-onyx-chatui-plugin/src/synced/app/app/message/custom-code-styles.css` with `pre` margin resets, run `pnpm --filter openclaw-onyx-chatui-plugin build:scoped-css`, add `app/app/message/custom-code-styles.css` to `synced.forks` in manifest. | |

Layer B — Adapter/runtime (client/src/lib/openclaw-gateway)
Scope: OpenClaw → OnyxPacket mapping + capabilities/tool catalog.
| Functionality | Onyx (existing) | OpenClaw (status + priority + pointers) | Ike-agent |
| --- | --- | --- | --- |
| History fetch | `HistoryResult` supports `hasMore` + `compactionMarkers`. | **Partial (P1)** — implemented but no compaction markers/pagination. Feasibility: adapter-only change. Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/client/src/lib/openclaw-gateway/OpenClawOnyxChatAdapter.ts` (`getHistory`). | |
| Streaming + abort | `streamMessage` + `abort` in adapter interface. | **Partial (P0)** — streaming works; add reasoning packets + system mapping. Feasibility: adapter-only change. | |
| Reasoning packets | OnyxPacket supports reasoning. | **Missing (P0)** — emit reasoning packets from `thinking` tags or structured gateway parts. Feasibility: adapter-only change. Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/client/src/lib/openclaw-gateway/openclawOnyxMapper.ts`, `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/client/src/lib/openclaw-gateway/reasoningTags.ts`. | |
| System message mapping | Message tree supports `system`. | **Missing (P0)** — map `role=system` into system card (not assistant text). Feasibility: adapter-only change. Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/client/src/lib/openclaw-gateway/OpenClawOnyxChatAdapter.ts` (`buildTurnsFromHistory`). | |
| Timestamp metadata | `timestampLabel` on turn. | **Partial (P0)** — extracted; ensure UI uses it and envelope is stripped from `user.text`. Feasibility: adapter + UI wiring. Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/client/src/lib/openclaw-gateway/chatEnvelope.ts`. | |
| Tool stream packets | OnyxPacket tool steps supported. | **Partial (P1)** — custom_tool_* packets mapped; normalize for tool cards + sidebar. Feasibility: adapter-only change. Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/client/src/lib/openclaw-gateway/OpenClawOnyxChatAdapter.ts` (tool stream section). | |
| Capabilities manifest | `CapabilityManifest` + `version` property. | **Partial (P1)** — thinking toggle false; gate from backend. Feasibility: adapter-only change. Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/client/src/lib/openclaw-gateway/OpenClawOnyxChatAdapter.ts` (`getCapabilities`). | |
| Tool catalog | Interface exists. | **Partial (P2)** — currently empty; wire from gateway when available. Feasibility: adapter-only change. Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/client/src/lib/openclaw-gateway/OpenClawOnyxChatAdapter.ts` (`getToolCatalog`). | |

Complete items:
| Functionality | Onyx (existing) | OpenClaw (status + pointers) | Ike-agent |
| --- | --- | --- | --- |
| Sessions list + labels | `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/packages/openclaw-onyx-chatui-plugin/src/runtime/types.ts` interface. | **Complete** — `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/client/src/lib/openclaw-gateway/OpenClawOnyxChatAdapter.ts` (`listSessions`). |  |
Layer C — Integration (Lit/app layer)
Scope: mount React shell from Lit + URL/persistence/external link adapters.
| Functionality | Onyx (existing) | OpenClaw (status + priority + pointers) | Ike-agent |
| --- | --- | --- | --- |
| React shell mount (Next‑free) | Onyx app uses React shell in `web/src/app/app`. | **Missing (P1)** — mount `OnyxChatTabShell` from Lit host. Feasibility: requires new integration wrapper (not present). Research: `/Volumes/devel/openclaw-work/chat-ui-migration/.worktrees/ike-base-replit/client/src/components/onyx/*` (see `OpenClawOnyxChat.tsx`). | |
| URL sync + persistence | Onyx app layer handles this. | **Missing (P1)** — implement platform adapter for `sessionKey` + settings. Feasibility: requires new integration layer code (not present). | |
| External link opener | Onyx app utilities. | **Missing (P2)** — platform adapter for external links. Feasibility: requires new integration layer code (not present). | |
| Integration storybooks | Contract stories exist upstream. | **Partial (P2)** — integration stories at `client/src/stories/Integrations/Onyx/*`. | |
---

## Current — OpenClaw parity + downstream contract stories (ike-base-replit)

Focus now: transcript correctness + downstream contract stories, then composer parity.

Contract stories (downstream):
- Ensure Storybook includes plugin stories glob in `ike-base-replit/.storybook/main.ts`.
- Sync raw fixtures into the plugin via `packages/openclaw-onyx-chatui-plugin/upstream/manifest.json` + `sync.mjs --sync`.
- Sync contract assets into `client/public/onyx-contract/` via the same sync tooling (no manual copy).
- Add file-id resolver override in Storybook so contract images resolve to `/onyx-contract/*`.
- Add downstream contract stories under `packages/openclaw-onyx-chatui-plugin/src/stories/Contract/Chat/*` using OnyxFullChatClient.

Transcript basics (must land before composer):
- Render system cards in `OnyxFullChatClient` (not assistant text).
- Render `timestampLabel` outside the user bubble; user text must be clean.
- Emit reasoning packets in the adapter; UI must show reasoning when capability + session allow.
- Non‑suppression rule: anything emitted must be shown (placeholder bubble allowed), except when gated by a UI toggle (thinking).

Composer parity (next priority after transcript basics):
- Input box behavior + styling parity: autosize, Enter/Shift+Enter/IME, paste images → previews.
- Stop/New session semantics.
- Send/Queue behavior while busy.

Validation (current):
- Contract stories render deterministically in ike-base Storybook.
- `ImageGeneration` shows images without 404s.
- No unexpected 4xx/5xx when loading contract stories.
- Storybook build passes for ike-base (script name as configured).

---

## Next Up

- Scroll anchoring + “New messages” pill.
- Reading indicator for empty streams.
- Compaction markers.
- Header controls and shell (`OnyxChatTabShell`).
- Tool output sidebar + resizable divider (including mobile overlay).
- Capabilities gating refinement (thinking toggle + tool output panel).
- Integration layer: Lit mount + URL sync + persistence + external link opener.
- Integration storybooks expansion in `client/src/stories/Integrations/Onyx/*`.

---

## Deferred

### Integration stories (ike-base-replit)
- Add `Integration/Onyx/GatewayConnectedChat` story under `client/src/stories/Integrations/Onyx/*`.
- Render `client/src/components/onyx/OpenClawOnyxChat.tsx` (or a minimal wrapper).
- Use MSW or local fake gateway stream to simulate:
  - session list + switching
  - abort/stop
  - reconnect/resume (if supported)
- Default: no real backend required. Optional “real backend mode” via env var (mirror existing storybook:real-llm patterns).

### Contract invariants + adapter compliance
- Enforce terminal semantics: no packets after `stop` (or `error`), ever.
- Tool step grouping via `placement` (`turn_index`, `tab_index`, `sub_turn_index` when applicable).
- `stop_reason=user_cancelled` maps to “stopped” header state.
- Extend `client/src/lib/openclaw-gateway/openclawOnyxMapper.ts` to ignore events after terminal state.
- Use `client/src/lib/onyx-contract/validateOnyxPacketSequence.ts` to validate:
  - stop/error ordering
  - placement sanity
  - parallel branch keys when present
- Prefer contract fixtures as golden inputs for tests when possible.

### ike-agents convergence
- Replace/wrap simplified packet union to canonical OnyxPacket (placement + obj).
- Update `packages/agent/src/onyx/gateway-packet-mapping.ts` (and related adapters) to emit canonical shapes.
- Add invariant tests mirroring `validateOnyxPacketSequence`.
- Acceptance: “contract fixture playback” test passes (structural invariants ok).

### CI guardrails
- `pnpm build-storybook` gate in CI for onyx-foss + ike-base.
- Minimal visual regression (Chromatic or Playwright) for:
  - MarkdownFixture (light/dark)
  - Citations
  - DeepResearch
  - DemoConversation (light/dark)

### Contract freeze log
- Add a small markdown log (location per repo).
- Any change to OnyxPacket shapes used by contract stories requires:
  - fixture update
  - screenshot update
  - adapter compliance test update

### Public API / interface changes (only if needed later)
- ResolvedCapabilities merge rule (backend + agent + session).
- Shared adapter interface (sessions/history/stream/abort) across backends.

### Test plan (when these deferred phases start)
- onyx-foss:
  - `cd web && pnpm build-storybook`
  - Optional Storybook interaction/Playwright runner
- ike-base-replit:
  - `pnpm storybook:build` (script name per repo)
  - `pnpm test-storybook` / existing vitest Storybook tests
  - New mapper compliance unit tests
- ike-agents:
  - `pnpm test` in affected packages
  - New canonical packet mapping invariant tests

---

## Future Plan (full fidelity; retained verbatim)

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

- A first-class CapabilityManifest (with a `version` field) and a ResolvedCapabilities merge rule (backend + agent + session), used to gate UI features deterministically.
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
