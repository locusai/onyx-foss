// # AI-DEV: This file is the fixture DRY boundary: scenario specs are data-only
// # AI-DEV: and must be materialized through packetFromUnknownSpec.
import type { Packet } from "@/app/app/services/streamingModels";
import { packetFromUnknownSpec } from "@/app/app/services/onyxPacketBuilder";

import type {
  ContractPacketSpec,
  ContractScenarioSpecMap,
} from "./raw/onyxChatContractFixtures";

export function buildContractScenarioPackets(
  packetSpecs: readonly ContractPacketSpec[]
): Packet[] {
  return packetSpecs.map((packetSpec) => packetFromUnknownSpec(packetSpec));
}

export function buildContractScenarios<TScenarioMap extends ContractScenarioSpecMap>(
  scenarioMap: TScenarioMap
): { [K in keyof TScenarioMap]: Packet[] } {
  const builtEntries = Object.entries(scenarioMap).map(([scenarioName, specs]) => [
    scenarioName,
    buildContractScenarioPackets(specs),
  ]);

  return Object.fromEntries(builtEntries) as { [K in keyof TScenarioMap]: Packet[] };
}
