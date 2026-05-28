import { storybookAgents } from "@/stories/fixtures/agents"
import { storybookChatSessions } from "@/stories/fixtures/chatSessions"
import {
  storybookCcPairs,
  storybookFederatedConnectors,
} from "@/stories/fixtures/connectors"
import { storybookInputPrompts } from "@/stories/fixtures/inputPrompts"
import {
  storybookLlmProviders,
  storybookLlmProviderOptions,
} from "@/stories/fixtures/llm"
import { storybookNotifications } from "@/stories/fixtures/notifications"
import { storybookProjects } from "@/stories/fixtures/projects"
import { storybookRecentFiles } from "@/stories/fixtures/recentFiles"
import {
  storybookAuthTypeMetadata,
  storybookUser,
} from "@/stories/fixtures/user"
import { storybookSettings } from "@/stories/fixtures/settings"

export const fixtures = {
  agents: storybookAgents,
  chatSessions: storybookChatSessions,
  ccPairs: storybookCcPairs,
  federatedConnectors: storybookFederatedConnectors,
  inputPrompts: storybookInputPrompts,
  llmProviders: storybookLlmProviders,
  llmProviderOptions: storybookLlmProviderOptions,
  notifications: storybookNotifications,
  projects: storybookProjects,
  recentFiles: storybookRecentFiles,
  settings: storybookSettings,
  user: storybookUser,
  authTypeMetadata: storybookAuthTypeMetadata,
}
