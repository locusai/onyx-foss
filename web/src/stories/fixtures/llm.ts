import type {
  LLMProviderDescriptor,
  WellKnownLLMProviderDescriptor,
} from "@/app/admin/configuration/llm/interfaces";

export const storybookLlmProviders = [
  {
    name: "OpenAI",
    provider: "openai",
    provider_display_name: "OpenAI",
    default_model_name: "gpt-4.1-mini",
    is_default_provider: true,
    model_configurations: [
      {
        name: "gpt-4.1-mini",
        is_visible: true,
        max_input_tokens: 128000,
        supports_image_input: true,
        display_name: "GPT-4.1 Mini",
        provider_display_name: "OpenAI",
      },
    ],
  },
] satisfies LLMProviderDescriptor[];

export const storybookLlmProviderOptions = [] satisfies WellKnownLLMProviderDescriptor[];

