import type { Meta, StoryObj } from "@storybook/react";

import SidebarWrapper from "@/sections/sidebar/SidebarWrapper";
import SidebarBody from "@/sections/sidebar/SidebarBody";
import SidebarSection from "@/sections/sidebar/SidebarSection";
import SidebarTab from "@/refresh-components/buttons/SidebarTab";
import { SvgFolderPlus, SvgOnyxOctagon } from "@opal/icons";

const meta = {
  title: "Navigation/Sidebar/SidebarWrapper",
  component: SidebarWrapper,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onFoldClick: { action: "fold" },
  },
} satisfies Meta<typeof SidebarWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

function SidebarContents() {
  return (
    <SidebarBody scrollKey="storybook-sidebar-wrapper">
      <SidebarSection title="Projects">
        <SidebarTab leftIcon={SvgFolderPlus} focused>
          Launch Plan
        </SidebarTab>
      </SidebarSection>
      <SidebarSection title="Agents">
        <SidebarTab leftIcon={SvgOnyxOctagon} lowlight>
          Sales Assistant
        </SidebarTab>
      </SidebarSection>
    </SidebarBody>
  );
}

export const Unfolded: Story = {
  args: {
    folded: false,
  },
  render: (args) => (
    <SidebarWrapper {...args}>
      <SidebarContents />
    </SidebarWrapper>
  ),
};

export const Folded: Story = {
  args: {
    folded: true,
  },
  render: (args) => (
    <SidebarWrapper {...args}>
      <SidebarContents />
    </SidebarWrapper>
  ),
};

export const StaticHeader: Story = {
  args: {
    folded: undefined,
  },
  render: (args) => (
    <SidebarWrapper {...args}>
      <SidebarContents />
    </SidebarWrapper>
  ),
};

