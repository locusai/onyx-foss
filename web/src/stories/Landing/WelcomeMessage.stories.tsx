import type { Meta, StoryObj } from "@storybook/react";

import WelcomeMessage from "@/app/app/components/WelcomeMessage";
import { fixtures } from "@/stories/fixtures";

const meta = {
  title: "Landing/WelcomeMessage",
  component: WelcomeMessage,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof WelcomeMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultAgent: Story = {
  args: {
    isDefaultAgent: true,
  },
};

export const NamedAgent: Story = {
  args: {
    isDefaultAgent: false,
    agent: fixtures.agents[1],
  },
};

