import type { Meta, StoryObj } from "@storybook/react";

import { ChatFileType } from "@/app/app/interfaces";
import {
  ContractSingleTurn,
  type ContractSingleTurnProps,
} from "@/stories/Contract/Chat/ContractTranscriptRenderer";
import { contractDocuments, contractScenarios } from "@/stories/Contract/fixtures";

const allDocs = Object.values(contractDocuments);

const meta = {
  title: "Contract/Onyx/Chat/Transcript",
  component: ContractSingleTurn,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    packets: { table: { disable: true } },
    docs: { table: { disable: true } },
    userFiles: { table: { disable: true } },
  },
} satisfies Meta<typeof ContractSingleTurn>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MarkdownFixture: Story = {
  args: {
    userMessage: "Render a markdown-heavy assistant response.",
    packets: contractScenarios.markdownFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const CustomTool: Story = {
  args: {
    userMessage: "What's my next meeting?",
    packets: contractScenarios.customToolFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const ParallelTools: Story = {
  args: {
    userMessage: "Search internal docs and compute remaining token budget.",
    packets: contractScenarios.parallelToolsFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const SearchToolDocuments: Story = {
  args: {
    userMessage: "Find documents describing the timeline + renderer.",
    packets: contractScenarios.searchToolFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const Citations: Story = {
  args: {
    userMessage: "Explain why Storybook is the contract harness (with citations).",
    packets: contractScenarios.citationsFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const DeepResearch: Story = {
  args: {
    userMessage: "Do a deep research run and return the final summary.",
    packets: contractScenarios.deepResearchFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const ImageGeneration: Story = {
  args: {
    userMessage: "Generate a couple contract-themed images.",
    packets: contractScenarios.imageGenerationFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const UserAttachment: Story = {
  args: {
    userMessage: "Please analyze the attached image.",
    userFiles: [
      {
        id: "storybook-contract-image-1",
        type: ChatFileType.IMAGE,
        name: "craft_demo_image_1.png",
      },
    ],
    packets: contractScenarios.markdownFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const FileReader: Story = {
  args: {
    userMessage: "Read the contract plan file and extract key phases.",
    packets: contractScenarios.fileReaderFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const MemoryTool: Story = {
  args: {
    userMessage: "Remember the stable naming convention for contract stories.",
    packets: contractScenarios.memoryToolFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const Reasoning: Story = {
  args: {
    userMessage: "Think through an execution plan for Phase 1.",
    packets: contractScenarios.reasoningFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const Stopped: Story = {
  args: {
    userMessage: "Stop generation.",
    packets: contractScenarios.stoppedFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};

export const Error: Story = {
  args: {
    userMessage: "Run a Python snippet (that errors) and recover gracefully.",
    packets: contractScenarios.errorFixture,
    docs: allDocs,
  } satisfies ContractSingleTurnProps,
};
