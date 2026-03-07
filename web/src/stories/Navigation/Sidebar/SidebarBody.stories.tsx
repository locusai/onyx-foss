import type { Meta, StoryObj } from "@storybook/react";

import SidebarBody from "@/sections/sidebar/SidebarBody";
import SidebarSection from "@/sections/sidebar/SidebarSection";
import SidebarTab from "@/refresh-components/buttons/SidebarTab";
import UserAvatarPopover from "@/sections/sidebar/UserAvatarPopover";
import SidebarWrapper from "@/sections/sidebar/SidebarWrapper";
import { Button } from "@opal/components";
import {
  SvgBubbleText,
  SvgChevronRight,
  SvgMoreHorizontal,
  SvgOnyxOctagon,
  SvgRefreshCw,
} from "@opal/icons";

const meta = {
  title: "Onyx-OSS/Sidebar/SidebarBody",
  component: SidebarBody,
  args: {
    scrollKey: "storybook-sidebar-body",
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SidebarBody>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SidebarWrapper folded={false}>
      <SidebarBody
        scrollKey="storybook-sidebar-body"
        actionButtons={[
          <SidebarTab key="new" leftIcon={SvgOnyxOctagon} focused>
            New Session
          </SidebarTab>,
        ]}
        footer={<UserAvatarPopover folded={false} />}
      >
        <SidebarSection title="Recents">
          <SidebarTab leftIcon={SvgOnyxOctagon}>Q1 Planning</SidebarTab>
          <SidebarTab leftIcon={SvgOnyxOctagon}>Customer Follow-up</SidebarTab>
        </SidebarSection>
      </SidebarBody>
    </SidebarWrapper>
  ),
};

export const Footer: Story = {
  render: () => (
    <SidebarWrapper folded={false}>
      <SidebarBody
        scrollKey="storybook-sidebar-body-footer"
        actionButtons={
          <SidebarTab lowlight leftIcon={SvgRefreshCw}>
            Refresh Directory
          </SidebarTab>
        }
        footer={
          <SidebarTab leftIcon={SvgChevronRight}>Footer Shortcut</SidebarTab>
        }
      >
        <SidebarSection
          title="Sales Assistant"
          action={
            <Button
              icon={SvgMoreHorizontal}
              prominence="tertiary"
              tooltip="More"
            />
          }
        >
          <SidebarTab leftIcon={SvgBubbleText} focused>
            Q1 Planning
          </SidebarTab>
          <SidebarTab leftIcon={SvgBubbleText}>
            Customer Follow-up
          </SidebarTab>
        </SidebarSection>
      </SidebarBody>
    </SidebarWrapper>
  ),
};
