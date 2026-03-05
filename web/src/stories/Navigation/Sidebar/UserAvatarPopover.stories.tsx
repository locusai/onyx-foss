import type { Meta, StoryObj } from "@storybook/react";

import UserAvatarPopover from "@/sections/sidebar/UserAvatarPopover";
import SidebarWrapper from "@/sections/sidebar/SidebarWrapper";
import SidebarBody from "@/sections/sidebar/SidebarBody";

const meta = {
  title: "Navigation/Sidebar/UserAvatarPopover",
  component: UserAvatarPopover,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof UserAvatarPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

function InSidebar({ folded }: { folded: boolean }) {
  return (
    <SidebarWrapper folded={folded}>
      <SidebarBody
        scrollKey="storybook-user-avatar-popover"
        footer={<UserAvatarPopover folded={folded} />}
      />
    </SidebarWrapper>
  );
}

export const Unfolded: Story = {
  render: () => <InSidebar folded={false} />,
};

export const Folded: Story = {
  render: () => <InSidebar folded={true} />,
};

