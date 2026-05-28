import type { MinimalPersonaSnapshot } from "@/app/admin/assistants/interfaces"

export const storybookAgents = [
  {
    id: 0,
    name: "Onyx",
    description: "Default assistant",
    tools: [],
    starter_messages: null,
    document_sets: [],
    is_public: true,
    is_visible: true,
    display_priority: 0,
    is_default_persona: true,
    builtin_persona: true,
    owner: null,
  },
  {
    id: 1,
    name: "Sales Assistant",
    description: "Helps with customer questions and sales enablement.",
    tools: [],
    starter_messages: [
      {
        name: "Quick Summary",
        message: "Summarize our latest product updates in 5 bullets.",
      },
      {
        name: "Objections",
        message: "Draft responses to common customer objections.",
      },
      {
        name: "Email",
        message: "Write a follow-up email after a demo.",
      },
    ],
    document_sets: [],
    is_public: true,
    is_visible: true,
    display_priority: 1,
    is_default_persona: true,
    builtin_persona: true,
    owner: null,
  },
] satisfies MinimalPersonaSnapshot[]
