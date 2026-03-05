import type { Meta, StoryObj } from "@storybook/react";

import SidebarSection from "@/sections/sidebar/SidebarSection";
import SidebarTab from "@/refresh-components/buttons/SidebarTab";
import { Button } from "@opal/components";
import { SvgMoreHorizontal, SvgOnyxOctagon } from "@opal/icons";

const meta = {
  title: "Navigation/Sidebar/SidebarSection",
  component: SidebarSection,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SidebarSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Recents",
    action: (
      <Button icon={SvgMoreHorizontal} prominence="tertiary" tooltip="More" />
    ),
    children: (
      <div className="w-[15rem] p-2">
        <SidebarTab leftIcon={SvgOnyxOctagon} focused>
          Q1 Planning
        </SidebarTab>
        <SidebarTab leftIcon={SvgOnyxOctagon} lowlight>
          Customer Follow-up
        </SidebarTab>
      </div>
    ),
  },
};

