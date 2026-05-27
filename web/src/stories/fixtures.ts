import type { CombinedSettings } from "@/interfaces/settings";
import {
  ApplicationStatus,
  QueryHistoryType,
} from "@/interfaces/settings";
import { NO_AUTH_USER_ID } from "@/lib/extension/constants";
import { ThemePreference, UserRole, type User } from "@/lib/types";
import type { MinimalPersonaSnapshot } from "@/app/admin/assistants/interfaces";
import type { LLMProviderDescriptor } from "@/app/admin/configuration/llm/interfaces";

const storybookAssistant: MinimalPersonaSnapshot = {
  id: 1,
  name: "Research Assistant",
  description: "Storybook assistant used for Onyx picker fixtures.",
  tools: [],
  starter_messages: null,
  document_sets: [],
  is_public: true,
  is_visible: true,
  display_priority: null,
  is_default_persona: false,
  builtin_persona: true,
  owner: null,
};

export const llmProviders: LLMProviderDescriptor[] = [
  {
    name: "OpenAI",
    provider: "openai",
    provider_display_name: "OpenAI",
    default_model_name: "gpt-4o-mini",
    is_default_provider: true,
    model_configurations: [
      {
        name: "gpt-4o-mini",
        display_name: "GPT-4o mini",
        is_visible: true,
        max_input_tokens: 128000,
        supports_image_input: true,
        supports_reasoning: false,
      },
      {
        name: "gpt-4o",
        display_name: "GPT-4o",
        is_visible: true,
        max_input_tokens: 128000,
        supports_image_input: true,
        supports_reasoning: false,
      },
      {
        name: "o3-mini",
        display_name: "o3 mini",
        is_visible: true,
        max_input_tokens: 200000,
        supports_image_input: false,
        supports_reasoning: true,
      },
    ],
  },
  {
    name: "Anthropic",
    provider: "anthropic",
    provider_display_name: "Anthropic",
    default_model_name: "claude-3-5-sonnet-latest",
    is_default_provider: false,
    model_configurations: [
      {
        name: "claude-3-5-sonnet-latest",
        display_name: "Claude 3.5 Sonnet",
        is_visible: true,
        max_input_tokens: 200000,
        supports_image_input: true,
        supports_reasoning: false,
      },
      {
        name: "claude-3-opus-latest",
        display_name: "Claude 3 Opus",
        is_visible: true,
        max_input_tokens: 200000,
        supports_image_input: true,
        supports_reasoning: false,
      },
    ],
  },
  {
    name: "OpenRouter",
    provider: "openrouter",
    provider_display_name: "OpenRouter",
    default_model_name: "anthropic/claude-3.5-sonnet",
    is_default_provider: false,
    model_configurations: [
      {
        name: "anthropic/claude-3.5-sonnet",
        display_name: "Claude 3.5 Sonnet",
        vendor: "anthropic",
        is_visible: true,
        max_input_tokens: 200000,
        supports_image_input: true,
        supports_reasoning: false,
      },
      {
        name: "openai/gpt-4o-mini",
        display_name: "GPT-4o mini",
        vendor: "openai",
        is_visible: true,
        max_input_tokens: 128000,
        supports_image_input: true,
        supports_reasoning: false,
      },
    ],
  },
];

export const storybookUser: User = {
  id: NO_AUTH_USER_ID,
  email: "storybook@onyx.local",
  is_active: true,
  is_superuser: true,
  is_verified: true,
  role: UserRole.ADMIN,
  preferences: {
    chosen_assistants: null,
    visible_assistants: [],
    hidden_assistants: [],
    pinned_assistants: [],
    default_model: null,
    recent_assistants: [],
    auto_scroll: false,
    shortcut_enabled: true,
    temperature_override_enabled: false,
    theme_preference: ThemePreference.LIGHT,
    chat_background: null,
    default_app_mode: "CHAT",
  },
  team_name: "Onyx Storybook",
  password_configured: false,
};

export const storybookSettings: CombinedSettings = {
  settings: {
    anonymous_user_enabled: true,
    invite_only_enabled: false,
    notifications: [],
    needs_reindexing: false,
    gpu_enabled: false,
    application_status: ApplicationStatus.ACTIVE,
    auto_scroll: false,
    temperature_override_enabled: false,
    query_history_type: QueryHistoryType.DISABLED,
    search_ui_enabled: true,
    onyx_craft_enabled: true,
    ee_features_enabled: false,
  },
  enterpriseSettings: null,
  customAnalyticsScript: null,
  webVersion: "storybook",
  webDomain: "localhost",
  isMobile: false,
  isSearchModeAvailable: true,
};

export const fixtures = {
  agents: [
    {
      ...storybookAssistant,
      id: 0,
      name: "Default Assistant",
      is_default_persona: true,
    },
    storybookAssistant,
  ],
  ccPairs: [],
  federatedConnectors: [],
  inputPrompts: [],
  llmProviders,
  llmProviderOptions: [],
  projects: [],
  recentFiles: [],
  chatSessions: [],
  notifications: [],
};
