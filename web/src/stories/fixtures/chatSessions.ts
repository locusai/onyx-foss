import {
  ChatSessionSharedStatus,
  type ChatSession,
} from "@/app/app/interfaces";

export const storybookChatSessions = [
  {
    id: "chat_storybook_1",
    name: "Q1 Planning",
    persona_id: 1,
    time_created: "2026-02-01T12:00:00.000Z",
    time_updated: "2026-02-01T12:05:00.000Z",
    shared_status: ChatSessionSharedStatus.Private,
    project_id: null,
    current_alternate_model: "",
    current_temperature_override: null,
  },
  {
    id: "chat_storybook_2",
    name: "Customer Follow-up",
    persona_id: 1,
    time_created: "2026-02-02T09:00:00.000Z",
    time_updated: "2026-02-02T09:15:00.000Z",
    shared_status: ChatSessionSharedStatus.Private,
    project_id: null,
    current_alternate_model: "",
    current_temperature_override: null,
  },
] satisfies ChatSession[];

