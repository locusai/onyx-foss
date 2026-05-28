import type { ConnectorCredentialPairStatus } from "@/app/admin/connector/[ccPairId]/types"
import {
  ValidSources,
  type CCPairBasicInfo,
  type FederatedConnectorDetail,
} from "@/lib/types"

export const storybookCcPairs = [
  {
    has_successful_run: true,
    source: ValidSources.Slack,
    status: "ACTIVE" as ConnectorCredentialPairStatus,
  },
] satisfies CCPairBasicInfo[]

export const storybookFederatedConnectors =
  [] satisfies FederatedConnectorDetail[]
