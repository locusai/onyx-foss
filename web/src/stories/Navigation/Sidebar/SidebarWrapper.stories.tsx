import type { Meta, StoryObj } from "@storybook/react";

import {
  ApplicationStatus,
  type CombinedSettings,
  QueryHistoryType,
} from "@/interfaces/settings";
import { SettingsContext } from "@/providers/SettingsProvider";
import SidebarWrapper from "@/sections/sidebar/SidebarWrapper";
import SidebarBody from "@/sections/sidebar/SidebarBody";
import SidebarSection from "@/sections/sidebar/SidebarSection";
import SidebarTab from "@/refresh-components/buttons/SidebarTab";
import {
  SvgBubbleText,
  SvgFolderPlus,
  SvgOnyxOctagon,
} from "@opal/icons";

const meta = {
  title: "Onyx-OSS/Sidebar/SidebarWrapper",
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

const enterpriseSettings = {
  settings: {
    anonymous_user_enabled: false,
    invite_only_enabled: false,
    notifications: [],
    needs_reindexing: false,
    gpu_enabled: false,
    application_status: ApplicationStatus.ACTIVE,
    auto_scroll: true,
    temperature_override_enabled: false,
    query_history_type: QueryHistoryType.NORMAL,
  },
  enterpriseSettings: {
    application_name: "Onyx QA",
    use_custom_logo: false,
    use_custom_logotype: false,
    logo_display_style: "logo_and_name",
    custom_nav_items: [],
    custom_lower_disclaimer_content: null,
    custom_header_content: null,
    two_lines_for_chat_header: null,
    custom_popup_header: null,
    custom_popup_content: null,
    enable_consent_screen: null,
    consent_screen_prompt: null,
    show_first_visit_notice: null,
    custom_greeting_message: null,
  },
  customAnalyticsScript: null,
  webVersion: null,
  webDomain: null,
  isSearchModeAvailable: false,
} satisfies CombinedSettings;

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

export const EnterpriseName: Story = {
  args: {
    folded: false,
  },
  render: () => (
    <SettingsContext.Provider value={enterpriseSettings}>
      <SidebarWrapper folded={false}>
        <SidebarBody scrollKey="storybook-sidebar-wrapper-enterprise-name">
          <SidebarSection title="Sales Assistant">
            <SidebarTab leftIcon={SvgBubbleText} focused>
              Q1 Planning
            </SidebarTab>
          </SidebarSection>
        </SidebarBody>
      </SidebarWrapper>
    </SettingsContext.Provider>
  ),
};
