import type { Meta, StoryObj } from "@storybook/react";

import AppSidebar from "@/sections/sidebar/AppSidebar";
import Text from "@/refresh-components/texts/Text";

const meta = {
  title: "Onyx-OSS/Sidebar/AppSidebar",
  component: AppSidebar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

function WithMainContent() {
  return (
    <div className="flex w-screen h-screen">
      <AppSidebar />
      <div className="flex-1 h-full p-8">
        <Text as="p" headingH2>
          Main Content
        </Text>
        <Text as="p" text03 className="pt-2">
          This is placeholder content to validate sidebar layout.
        </Text>
      </div>
    </div>
  );
}

export const DesktopUnfolded: Story = {
  render: () => <WithMainContent />,
};

export const DesktopFolded: Story = {
  parameters: {
    sidebarFolded: true,
  },
  render: () => <WithMainContent />,
};

export const MobileOverlay: Story = {
  parameters: {
    // Uses the viewport addon from addon-essentials.
    viewport: { defaultViewport: "iphone6" },
  },
  render: () => <WithMainContent />,
};
