// # AI-DEV: Keep display-group rendering centralized so AgentMessage and
// # AI-DEV: contract harness stories stay behavior-identical (including
// # AI-DEV: USER_CANCELLED fallback text and last-group onRenderComplete semantics).
import React from "react";

import type { FullChatState } from "@/app/app/message/messageComponents/interfaces";
import { RendererComponent } from "@/app/app/message/messageComponents/renderMessageComponent";
import { StopReason, type Packet } from "@/app/app/services/streamingModels";
import Text from "@/refresh-components/texts/Text";

interface DisplayGroup {
  turn_index: number;
  tab_index?: number;
  packets: Packet[];
}

export interface DisplayGroupRendererProps {
  displayGroups: DisplayGroup[];
  chatState: FullChatState;
  stopPacketSeen?: boolean;
  stopReason?: StopReason;
  onRenderComplete: () => void;
  animate?: boolean;
}

export function DisplayGroupRenderer({
  displayGroups,
  chatState,
  stopPacketSeen,
  stopReason,
  onRenderComplete,
  animate = false,
}: DisplayGroupRendererProps) {
  if (displayGroups.length === 0) {
    if (stopReason === StopReason.USER_CANCELLED) {
      return (
        <Text as="p" secondaryBody text04>
          User has stopped generation
        </Text>
      );
    }
    return null;
  }

  return (
    <>
      {displayGroups.map((displayGroup, index) => (
        <RendererComponent
          key={`${displayGroup.turn_index}-${displayGroup.tab_index}`}
          packets={displayGroup.packets}
          chatState={chatState}
          onComplete={() => {
            if (index === displayGroups.length - 1) {
              onRenderComplete();
            }
          }}
          animate={animate}
          stopPacketSeen={stopPacketSeen}
          stopReason={stopReason}
        >
          {(results) => (
            <>
              {results.map((result, resultIndex) => (
                <div key={resultIndex}>{result.content}</div>
              ))}
            </>
          )}
        </RendererComponent>
      ))}
    </>
  );
}
