// # AI-DEV: Contract fixtures should convert spec data through this shared builder,
// # AI-DEV: not hand-authored packet literals, so packet semantics stay aligned with
// # AI-DEV: adapter/runtime paths. Keep sub_turn_index support in placement helpers.
import type { ObjTypes, Packet, Placement } from "@/app/app/services/streamingModels";

export interface PlacementInput {
  turnIndex: number;
  tabIndex?: number;
  subTurnIndex?: number | null;
}

type PacketObject = ObjTypes;
type PacketType = PacketObject["type"];
type PacketObjectForType<TType extends PacketType> = Extract<
  PacketObject,
  { type: TType }
>;

export type PacketForType<TType extends PacketType> = {
  placement: Placement;
  obj: PacketObjectForType<TType>;
};

export type PacketSpec<TType extends PacketType = PacketType> = {
  placement: PlacementInput;
  obj: PacketObjectForType<TType>;
};

export function buildPlacement(args: PlacementInput): Placement {
  return {
    turn_index: args.turnIndex,
    ...(typeof args.tabIndex === "number" ? { tab_index: args.tabIndex } : {}),
    ...(args.subTurnIndex !== undefined
      ? { sub_turn_index: args.subTurnIndex }
      : {}),
  };
}

export function packetFromSpec<TType extends PacketType>(
  spec: PacketSpec<TType>
): PacketForType<TType> {
  return {
    placement: buildPlacement(spec.placement),
    obj: spec.obj,
  };
}

export function packetFromUnknownSpec(spec: {
  placement: PlacementInput;
  obj: { type: string; [key: string]: unknown };
}): Packet {
  return packetFromSpec(spec as PacketSpec);
}
