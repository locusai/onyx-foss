import type { Meta, StoryObj } from "@storybook/react";

import SidebarTab from "@/refresh-components/buttons/SidebarTab";
import { SvgOnyxOctagon } from "@opal/icons";

const meta = {
  title: "Onyx-OSS/Sidebar/SidebarTab",
  component: SidebarTab,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SidebarTab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    leftIcon: SvgOnyxOctagon,
    children: "Default",
  },
};

export const Focused: Story = {
  args: {
    leftIcon: SvgOnyxOctagon,
    focused: true,
    children: "Focused",
  },
};

export const Lowlight: Story = {
  args: {
    leftIcon: SvgOnyxOctagon,
    lowlight: true,
    children: "Lowlight",
  },
};

export const Folded: Story = {
  args: {
    leftIcon: SvgOnyxOctagon,
    folded: true,
    children: "Folded",
  },
};
