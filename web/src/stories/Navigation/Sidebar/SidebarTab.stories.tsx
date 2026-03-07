import type { Meta, StoryObj } from "@storybook/react";

import SidebarTab from "@/refresh-components/buttons/SidebarTab";
import {
  SvgActivity,
  SvgBubbleText,
  SvgLink,
  SvgOnyxOctagon,
} from "@opal/icons";

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

export const RightChildren: Story = {
  args: {
    leftIcon: SvgBubbleText,
    rightChildren: (
      <span className="text-[10px] font-medium text-text-03">2</span>
    ),
    children: "Linked Inbox",
  },
};

export const Href: Story = {
  args: {
    href: "?path=/story/onyx-oss-sidebar-sidebartab--href",
    leftIcon: SvgLink,
    children: "Open Session Link",
  },
};

export const Transient: Story = {
  args: {
    transient: true,
    leftIcon: SvgActivity,
    children: "Reconnecting",
  },
};

export const Nested: Story = {
  args: {
    nested: true,
    children: "Nested Child",
  },
};
