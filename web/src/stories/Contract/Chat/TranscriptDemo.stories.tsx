import type { Meta, StoryObj } from "@storybook/react";

import { ContractConversation } from "@/stories/Contract/Chat/ContractTranscriptRenderer";
import { demoConversationTurns } from "@/stories/Contract/fixtures";

const meta = {
  title: "Contract/Onyx/Chat/Transcript (Demo)",
  component: ContractConversation,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    turns: { table: { disable: true } },
  },
} satisfies Meta<typeof ContractConversation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DemoConversation: Story = {
  args: {
    turns: demoConversationTurns,
  },
};

