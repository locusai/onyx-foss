// # AI-DEV: Contract transcript stories use the same display-group renderer as
// # AI-DEV: production chat to keep Storybook evidence contract-valid.
import React, { useMemo } from "react";

import HumanMessage from "@/app/app/message/HumanMessage";
import { DisplayGroupRenderer } from "@/app/app/message/messageComponents/DisplayGroupRenderer";
import { AgentTimeline } from "@/app/app/message/messageComponents/timeline/AgentTimeline";
import { usePacketProcessor } from "@/app/app/message/messageComponents/timeline/hooks/usePacketProcessor";
import { usePacedTurnGroups } from "@/app/app/message/messageComponents/timeline/hooks/usePacedTurnGroups";
import type { FullChatState } from "@/app/app/message/messageComponents/interfaces";
import { type Packet } from "@/app/app/services/streamingModels";
import type { MinimalPersonaSnapshot } from "@/app/admin/assistants/interfaces";
import type { MinimalOnyxDocument, OnyxDocument } from "@/lib/search/interfaces";

const contractAssistant: MinimalPersonaSnapshot = {
  id: 1,
  name: "Onyx",
  description: "Contract assistant used for Storybook transcript fixtures.",
  tools: [],
  starter_messages: null,
  document_sets: [],
  is_public: true,
  is_visible: true,
  display_priority: null,
  is_default_persona: false,
  builtin_persona: true,
  owner: null,
};

function noOpPresentingDocument(_doc: MinimalOnyxDocument) {
  // Intentionally empty: Storybook contract stories are backend-free.
}

export interface ContractChatWindowProps {
  children: React.ReactNode;
}

export function ContractChatWindow({ children }: ContractChatWindowProps) {
  return (
    <div className="h-screen w-screen bg-background-neutral-01">
      <div className="h-full w-full overflow-y-auto">
        <div className="flex justify-center p-4">
          <div className="w-full max-w-[52rem] flex flex-col gap-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContractAgentTurnProps {
  packets: Packet[];
  docs: OnyxDocument[];
  nodeId: number;
}

function ContractAgentTurn({ packets, docs, nodeId }: ContractAgentTurnProps) {
  const {
    citationMap,
    toolTurnGroups,
    displayGroups,
    stopPacketSeen,
    stopReason,
    isGeneratingImage,
    generatedImageCount,
    onRenderComplete,
    finalAnswerComing,
    toolProcessingDuration,
  } = usePacketProcessor(packets, nodeId);

  const { pacedTurnGroups, pacedDisplayGroups, pacedFinalAnswerComing } =
    usePacedTurnGroups(
      toolTurnGroups,
      displayGroups,
      stopPacketSeen,
      nodeId,
      finalAnswerComing
    );

  const effectiveChatState = useMemo<FullChatState>(
    () => ({
      assistant: contractAssistant,
      docs,
      citations: citationMap,
      setPresentingDocument: noOpPresentingDocument,
    }),
    [docs, citationMap]
  );

  return (
    <div className="flex flex-col gap-3">
      <AgentTimeline
        turnGroups={pacedTurnGroups}
        chatState={effectiveChatState}
        stopPacketSeen={stopPacketSeen}
        stopReason={stopReason}
        hasDisplayContent={pacedDisplayGroups.length > 0}
        isGeneratingImage={isGeneratingImage}
        generatedImageCount={generatedImageCount}
        finalAnswerComing={pacedFinalAnswerComing}
        toolProcessingDuration={toolProcessingDuration}
        collapsible={false}
      />

      <div className="overflow-x-visible focus:outline-none select-text cursor-text px-3">
        <DisplayGroupRenderer
          displayGroups={pacedDisplayGroups}
          chatState={effectiveChatState}
          stopPacketSeen={stopPacketSeen}
          stopReason={stopReason}
          onRenderComplete={onRenderComplete}
          animate={false}
        />
      </div>
    </div>
  );
}

export interface ContractSingleTurnProps {
  userMessage: string;
  packets: Packet[];
  docs: OnyxDocument[];
}

export function ContractSingleTurn({
  userMessage,
  packets,
  docs,
}: ContractSingleTurnProps) {
  return (
    <ContractChatWindow>
      <HumanMessage content={userMessage} nodeId={0} />
      <ContractAgentTurn packets={packets} docs={docs} nodeId={1} />
    </ContractChatWindow>
  );
}

export interface ContractConversationTurn {
  user: string;
  packets: Packet[];
  docs: OnyxDocument[];
}

export interface ContractConversationProps {
  turns: ContractConversationTurn[];
}

export function ContractConversation({ turns }: ContractConversationProps) {
  return (
    <ContractChatWindow>
      {turns.map((turn, idx) => (
        <React.Fragment key={idx}>
          <HumanMessage content={turn.user} nodeId={idx * 2} />
          <ContractAgentTurn
            packets={turn.packets}
            docs={turn.docs}
            nodeId={idx * 2 + 1}
          />
        </React.Fragment>
      ))}
    </ContractChatWindow>
  );
}
