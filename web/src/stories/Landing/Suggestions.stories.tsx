import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentType } from "react";

import Suggestions from "@/sections/Suggestions";

function withSearchParam(key: string, value: string) {
  return (Story: ComponentType) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set(key, value);
      window.history.replaceState(window.history.state, "", url.toString());
    }
    return <Story />;
  };
}

const meta = {
  title: "Landing/Suggestions",
  component: Suggestions,
  args: {
    onSubmit: () => undefined,
  },
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onSubmit: { action: "submit" },
  },
} satisfies Meta<typeof Suggestions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithStarterMessages: Story = {
  decorators: [withSearchParam("assistantId", "1")],
};

export const Empty: Story = {
  decorators: [withSearchParam("assistantId", "0")],
};
