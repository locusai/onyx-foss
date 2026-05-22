// # AI-DEV: Keep exported scenario names stable, but source packet construction
// # AI-DEV: from raw scenarioSpecs through buildContractScenarios for DRY parity.
import type { Packet } from "@/app/app/services/streamingModels";
import type { OnyxDocument } from "@/lib/search/interfaces";

import { buildContractScenarios } from "./buildContractScenarios";
import {
  type ContractScenarioKey as RawContractScenarioKey,
  documents as rawDocuments,
  demoConversationTurns as rawDemoConversationTurns,
  scenarioSpecs,
} from "./raw/onyxChatContractFixtures";

export const contractDocuments = rawDocuments as unknown as Record<
  string,
  OnyxDocument
>;

const builtContractScenarios = buildContractScenarios(scenarioSpecs);
export type ContractScenarioKey = keyof typeof builtContractScenarios;

export const contractScenarios = builtContractScenarios as Record<
  ContractScenarioKey,
  Packet[]
>;

export interface ContractDemoTurn {
  user: string;
  packets: Packet[];
  docs: OnyxDocument[];
}

export const demoConversationTurns = rawDemoConversationTurns.map((rawTurn) => ({
  user: rawTurn.user,
  packets:
    contractScenarios[rawTurn.scenarioKey as RawContractScenarioKey] ?? [],
  docs: rawTurn.docs as unknown as OnyxDocument[],
})) as ContractDemoTurn[];
