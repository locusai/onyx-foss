import type { Meta, StoryObj } from "@storybook/react";

import AppInputBar, { type AppInputBarProps } from "@/sections/input/AppInputBar";
import { useFilters, useLlmManager } from "@/lib/hooks";
import { fixtures } from "@/stories/fixtures";

type AppInputBarStoryArgs = Partial<
  Omit<AppInputBarProps, "filterManager" | "llmManager">
>;

function AppInputBarStory(args: AppInputBarStoryArgs) {
  const selectedAssistant = args.selectedAssistant ?? fixtures.agents[1];

  const filterManager = useFilters();
  const llmManager = useLlmManager(undefined, selectedAssistant);

  return (
    <div className="h-screen w-screen flex flex-col justify-end p-4">
      <AppInputBar
        removeDocs={args.removeDocs ?? (() => undefined)}
        selectedDocuments={args.selectedDocuments ?? []}
        initialMessage={args.initialMessage}
        stopGenerating={args.stopGenerating ?? (() => undefined)}
        onSubmit={args.onSubmit ?? (() => undefined)}
        llmManager={llmManager}
        chatState={args.chatState ?? "input"}
        currentSessionFileTokenCount={args.currentSessionFileTokenCount ?? 0}
        availableContextTokens={args.availableContextTokens ?? 128_000}
        selectedAssistant={selectedAssistant}
        toggleDocumentSidebar={args.toggleDocumentSidebar ?? (() => undefined)}
        handleFileUpload={args.handleFileUpload ?? (() => undefined)}
        filterManager={filterManager}
        retrievalEnabled={args.retrievalEnabled ?? true}
        deepResearchEnabled={args.deepResearchEnabled ?? false}
        setPresentingDocument={args.setPresentingDocument}
        toggleDeepResearch={args.toggleDeepResearch ?? (() => undefined)}
        disabled={args.disabled ?? false}
        tabReadingEnabled={args.tabReadingEnabled}
        currentTabUrl={args.currentTabUrl}
        onToggleTabReading={args.onToggleTabReading}
      />
    </div>
  );
}

const meta = {
  title: "Onyx-OSS/Input/AppInputBar",
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onSubmit: { action: "submit" },
    stopGenerating: { action: "stopGenerating" },
    toggleDocumentSidebar: { action: "toggleDocumentSidebar" },
    handleFileUpload: { action: "handleFileUpload" },
    toggleDeepResearch: { action: "toggleDeepResearch" },
    removeDocs: { action: "removeDocs" },
  },
  render: (args: AppInputBarStoryArgs) => <AppInputBarStory {...args} />,
} satisfies Meta<AppInputBarStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    disabled: false,
    chatState: "input",
    initialMessage: "",
  },
};

export const WithText: Story = {
  args: {
    disabled: false,
    chatState: "input",
    initialMessage: "Draft a follow-up email for today's demo.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    chatState: "input",
    initialMessage: "",
  },
};
