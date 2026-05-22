export const SYSTEM_TOOL_NAME = "System";
export const TOOL_RESULT_NAME = "Tool Result";

const TOOL_ACTIVITY_LABELS = {
  exec: "Running command",
  "sessions history": "Loading session history",
  gateway: "Connecting to gateway",
} as const;

function readNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeSpecialToolName(name: string): string | null {
  const lower = name.trim().toLowerCase();
  if (lower === "system") return SYSTEM_TOOL_NAME;
  if (lower === "tool result") return TOOL_RESULT_NAME;
  return null;
}

export function resolveToolDisplayLabel(name?: unknown): string {
  const value = readNonEmptyString(name);
  if (!value) return "Tool";

  const normalizedSpecialName = normalizeSpecialToolName(value);
  if (normalizedSpecialName) return normalizedSpecialName;

  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

export function formatToolActivityLabel(name?: unknown): string {
  const displayLabel = resolveToolDisplayLabel(name);
  if (displayLabel === "Tool") return "Executing tool";
  if (displayLabel === SYSTEM_TOOL_NAME || displayLabel === TOOL_RESULT_NAME) {
    return displayLabel;
  }

  const override =
    TOOL_ACTIVITY_LABELS[
      displayLabel.toLowerCase() as keyof typeof TOOL_ACTIVITY_LABELS
    ];
  return override ?? `Executing ${displayLabel}`;
}
