// # AI-DEV: Keep this file data-only (scenario specs), not concrete Packet arrays.
// # AI-DEV: Builders in each repo must construct packets from this synced spec.
export interface ContractPlacementSpec {
  turnIndex: number;
  tabIndex?: number;
  subTurnIndex?: number | null;
}

export interface ContractPacketSpec {
  placement: ContractPlacementSpec;
  obj: {
    type: string;
    [key: string]: unknown;
  };
}

export type ContractScenarioSpecMap = Record<string, readonly ContractPacketSpec[]>;

export const documents = {
  roadmapSlackThread: {
    document_id: "doc_slack_roadmap_q1",
    semantic_identifier: "Slack: #product — Roadmap Q1",
    link: "https://example.com/slack/roadmap-q1",
    source_type: "slack",
    blurb:
      "Discussion thread capturing milestones, risks, and ownership for the Q1 roadmap.",
    boost: 0,
    hidden: false,
    score: 0.87,
    chunk_ind: 0,
    match_highlights: [],
    metadata: {
      channel: "#product",
      author: "alex",
    },
    updated_at: "2026-02-01T00:00:00Z",
    is_internet: false,
  },
  contractDesignDoc: {
    document_id: "doc_gdrive_contract_chat",
    semantic_identifier: "Design Doc: Storybook Contract Chat UI",
    link: "https://example.com/drive/design-doc",
    source_type: "google_drive",
    blurb:
      "Spec for the contract story suite and the packet invariants required by downstream adapters.",
    boost: 0,
    hidden: false,
    score: 0.83,
    chunk_ind: 0,
    match_highlights: [],
    metadata: {
      owner: "raunak",
      status: "draft",
    },
    updated_at: "2026-02-10T00:00:00Z",
    is_internet: false,
  },
  storybookWebReference: {
    document_id: "doc_web_storybook_docs",
    semantic_identifier: "Storybook — Docs",
    link: "https://example.com/storybook-docs",
    source_type: "web",
    blurb:
      "Reference material for Storybook configuration, addons, and rendering patterns.",
    boost: 0,
    hidden: false,
    score: 0.62,
    chunk_ind: 0,
    match_highlights: [],
    metadata: {
      site: "example.com",
      category: "docs",
    },
    updated_at: "2026-01-20T00:00:00Z",
    is_internet: true,
  },
} as const;

const internalDocs = [
  documents.roadmapSlackThread,
  documents.contractDesignDoc,
] as const;

const webDocs = [documents.storybookWebReference] as const;

const markdownAnswer = `# Transcript contract: Markdown

This story exercises:
- headings + lists
- tables
- code blocks
- inline math ($E = mc^2$)

## Table

| Token | Meaning |
| --- | --- |
| \`turn_index\` | sequential step |
| \`tab_index\` | parallel tool branch |

## Code

\`\`\`ts
type Packet = {
  placement: { turn_index: number; tab_index?: number }
  obj: { type: string }
}
\`\`\`

External link: [Onyx](https://example.com)`;

const citationsAnswer = `We treat Storybook as a visual contract harness [[1]](#) and port it downstream into IKE Base [[2]](#).

This lets adapters evolve while preserving stable UX states.`;

const deepResearchFinalAnswer = `## Deep research summary

We generated a plan, executed nested tools, and produced a report.

Key sources: [[1]](#) [[2]](#)`;

export const scenarioSpecs = {
  markdownFixture: [
    {
      placement: { turnIndex: 0 },
      obj: {
        type: "message_start",
        id: "msg_markdown",
        content: markdownAnswer,
        final_documents: null,
      },
    },
    { placement: { turnIndex: 0 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 1 }, obj: { type: "stop", stop_reason: "finished" } },
  ],

  customToolFixture: [
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: { type: "custom_tool_start", tool_name: "Calendar" },
    },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: {
        type: "custom_tool_delta",
        tool_name: "Calendar",
        response_type: "json",
        data: {
          next_event: {
            title: "Storybook contract sync",
            start: "2026-02-27T17:00:00Z",
            duration_minutes: 30,
            attendees: ["a@example.com", "b@example.com"],
          },
        },
        file_ids: null,
      },
    },
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "section_end" } },
    {
      placement: { turnIndex: 1 },
      obj: {
        type: "message_start",
        id: "msg_custom_tool",
        content:
          "I found the next sync on your calendar and pulled the key meeting details.",
        final_documents: null,
      },
    },
    { placement: { turnIndex: 1 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 2 }, obj: { type: "stop", stop_reason: "finished" } },
  ],

  parallelToolsFixture: [
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: { type: "search_tool_start", is_internet_search: false },
    },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: { type: "search_tool_queries_delta", queries: ["storybook contract plan"] },
    },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: { type: "search_tool_documents_delta", documents: [...internalDocs] },
    },
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "section_end" } },
    {
      placement: { turnIndex: 0, tabIndex: 1 },
      obj: {
        type: "python_tool_start",
        code: "total = 128_000\nused = 12_345\nprint(total - used)",
      },
    },
    {
      placement: { turnIndex: 0, tabIndex: 1 },
      obj: {
        type: "python_tool_delta",
        stdout: "115655\n",
        stderr: "",
        file_ids: [],
      },
    },
    { placement: { turnIndex: 0, tabIndex: 1 }, obj: { type: "section_end" } },
    {
      placement: { turnIndex: 1 },
      obj: {
        type: "message_start",
        id: "msg_parallel_tools",
        content:
          "I searched for the plan and also computed the remaining context token budget.",
        final_documents: null,
      },
    },
    { placement: { turnIndex: 1 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 2 }, obj: { type: "stop", stop_reason: "finished" } },
  ],

  searchToolFixture: [
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: { type: "search_tool_start", is_internet_search: false },
    },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: { type: "search_tool_queries_delta", queries: ["chat window timeline renderer"] },
    },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: { type: "search_tool_documents_delta", documents: [...internalDocs] },
    },
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "section_end" } },
    {
      placement: { turnIndex: 1 },
      obj: {
        type: "message_start",
        id: "msg_search_tool",
        content:
          "I found a couple internal docs that describe the current timeline + renderer architecture.",
        final_documents: null,
      },
    },
    { placement: { turnIndex: 1 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 2 }, obj: { type: "stop", stop_reason: "finished" } },
  ],

  citationsFixture: [
    {
      placement: { turnIndex: 0 },
      obj: {
        type: "message_start",
        id: "msg_citations",
        content: citationsAnswer,
        final_documents: null,
      },
    },
    {
      placement: { turnIndex: 0 },
      obj: {
        type: "citation_info",
        citation_number: 1,
        document_id: documents.roadmapSlackThread.document_id,
      },
    },
    {
      placement: { turnIndex: 0 },
      obj: {
        type: "citation_info",
        citation_number: 2,
        document_id: documents.contractDesignDoc.document_id,
      },
    },
    { placement: { turnIndex: 0 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 1 }, obj: { type: "stop", stop_reason: "finished" } },
  ],

  deepResearchFixture: [
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: { type: "deep_research_plan_start" },
    },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: {
        type: "deep_research_plan_delta",
        content:
          "- Define Tier-1 transcript contract stories\n- Port fixtures downstream\n- Align adapters + tests\n",
      },
    },
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "section_end" } },
    {
      placement: { turnIndex: 1, tabIndex: 0 },
      obj: {
        type: "research_agent_start",
        research_task:
          "Gather evidence for contract invariants and propose adapters alignment steps.",
      },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0, subTurnIndex: 0 },
      obj: { type: "search_tool_start", is_internet_search: false },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0, subTurnIndex: 0 },
      obj: {
        type: "search_tool_queries_delta",
        queries: ["packet processor section_end injection", "timeline ui state machine"],
      },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0, subTurnIndex: 0 },
      obj: { type: "search_tool_documents_delta", documents: [...internalDocs] },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0, subTurnIndex: 0 },
      obj: { type: "section_end" },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0, subTurnIndex: 1 },
      obj: { type: "open_url_start" },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0, subTurnIndex: 1 },
      obj: { type: "open_url_urls", urls: ["https://example.com/storybook-docs"] },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0, subTurnIndex: 1 },
      obj: { type: "open_url_documents", documents: [...webDocs] },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0, subTurnIndex: 1 },
      obj: { type: "section_end" },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0 },
      obj: { type: "intermediate_report_start" },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0 },
      obj: {
        type: "intermediate_report_delta",
        content:
          "### Findings\n\n- Contract fixtures should be pure data (portable).\n- Adapters must emit coherent placement grouping.\n",
      },
    },
    {
      placement: { turnIndex: 1, tabIndex: 0 },
      obj: { type: "intermediate_report_cited_docs", cited_docs: [...internalDocs] },
    },
    { placement: { turnIndex: 1, tabIndex: 0 }, obj: { type: "section_end" } },
    {
      placement: { turnIndex: 2 },
      obj: {
        type: "message_start",
        id: "msg_deep_research",
        content: deepResearchFinalAnswer,
        final_documents: null,
      },
    },
    {
      placement: { turnIndex: 2 },
      obj: {
        type: "citation_info",
        citation_number: 1,
        document_id: documents.roadmapSlackThread.document_id,
      },
    },
    {
      placement: { turnIndex: 2 },
      obj: {
        type: "citation_info",
        citation_number: 2,
        document_id: documents.contractDesignDoc.document_id,
      },
    },
    { placement: { turnIndex: 2 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 3 }, obj: { type: "stop", stop_reason: "finished" } },
  ],

  imageGenerationFixture: [
    {
      placement: { turnIndex: 0 },
      obj: { type: "image_generation_start" },
    },
    {
      placement: { turnIndex: 0 },
      obj: {
        type: "image_generation_final",
        images: [
          {
            file_id: "storybook-contract-image-1",
            url: "/craft_demo_image_1.png",
            revised_prompt: "A simple wireframe of a chat transcript contract story.",
            shape: "square",
          },
          {
            file_id: "storybook-contract-image-2",
            url: "/craft_demo_image_2.png",
            revised_prompt: "A timeline UI with parallel tool tabs.",
            shape: "square",
          },
        ],
      },
    },
    { placement: { turnIndex: 0 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 1 }, obj: { type: "stop", stop_reason: "finished" } },
  ],

  fileReaderFixture: [
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "file_reader_start" } },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: {
        type: "file_reader_result",
        file_name: "STORYBOOK-CONTRACT-PLAN.md",
        file_id: "storybook-contract-file-1",
        start_char: 0,
        end_char: 420,
        total_chars: 9999,
        preview_start:
          "# Storybook Contract Plan (Onyx FOSS → IKE Base → Adapters Alignment)\n\n## Summary",
        preview_end:
          "…Tier‑1 contract stories are chat window focused and deterministic.",
      },
    },
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "section_end" } },
    {
      placement: { turnIndex: 1 },
      obj: {
        type: "message_start",
        id: "msg_file_reader",
        content: "I read the plan and extracted the key phases and acceptance criteria.",
        final_documents: null,
      },
    },
    { placement: { turnIndex: 1 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 2 }, obj: { type: "stop", stop_reason: "finished" } },
  ],

  memoryToolFixture: [
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "memory_tool_start" } },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: {
        type: "memory_tool_delta",
        memory_text: "Prefer stable Storybook titles for contract stories.",
        operation: "add",
        memory_id: 7,
        index: 0,
      },
    },
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "section_end" } },
    {
      placement: { turnIndex: 1 },
      obj: {
        type: "message_start",
        id: "msg_memory",
        content: "Saved the contract-story naming rule to memory for future sessions.",
        final_documents: null,
      },
    },
    { placement: { turnIndex: 1 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 2 }, obj: { type: "stop", stop_reason: "finished" } },
  ],

  reasoningFixture: [
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "reasoning_start" } },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: {
        type: "reasoning_delta",
        reasoning:
          "# Plan\n\n1. Define raw fixtures\n2. Add typed adapter\n3. Render transcript contract stories\n",
      },
    },
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "section_end" } },
    {
      placement: { turnIndex: 1 },
      obj: {
        type: "message_start",
        id: "msg_reasoning",
        content: "Here’s the execution plan for building the Tier‑1 contract suite.",
        final_documents: null,
      },
    },
    { placement: { turnIndex: 1 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 2 }, obj: { type: "stop", stop_reason: "finished" } },
  ],

  stoppedFixture: [
    { placement: { turnIndex: 0, tabIndex: 0 }, obj: { type: "reasoning_start" } },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: {
        type: "reasoning_delta",
        reasoning:
          "I was about to fetch additional documents, but generation was interrupted.",
      },
    },
    { placement: { turnIndex: 1 }, obj: { type: "stop", stop_reason: "user_cancelled" } },
  ],

  errorFixture: [
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: {
        type: "python_tool_start",
        code: "print(1 / 0)",
      },
    },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: {
        type: "python_tool_delta",
        stdout: "",
        stderr: "ZeroDivisionError: division by zero\n",
        file_ids: [],
      },
    },
    {
      placement: { turnIndex: 0, tabIndex: 0 },
      obj: { type: "error", message: "Tool call failed" },
    },
    {
      placement: { turnIndex: 1 },
      obj: {
        type: "message_start",
        id: "msg_error",
        content:
          "I hit an error while executing code. I can retry with a different approach.",
        final_documents: null,
      },
    },
    { placement: { turnIndex: 1 }, obj: { type: "section_end" } },
    { placement: { turnIndex: 2 }, obj: { type: "stop", stop_reason: "finished" } },
  ],
} as const satisfies ContractScenarioSpecMap;

export type ContractScenarioKey = keyof typeof scenarioSpecs;

export const demoConversationTurns = [
  {
    user: "Give me a quick markdown overview of the Storybook contract approach.",
    scenarioKey: "markdownFixture",
    docs: [...internalDocs],
  },
  {
    user: "Search for related internal docs and summarize what you find.",
    scenarioKey: "searchToolFixture",
    docs: [...internalDocs],
  },
  {
    user: "Generate a couple illustrative images for the contract suite.",
    scenarioKey: "imageGenerationFixture",
    docs: [...internalDocs],
  },
  {
    user: "Do a deep research style run and give me the final summary with citations.",
    scenarioKey: "deepResearchFixture",
    docs: [...internalDocs],
  },
] as const;
