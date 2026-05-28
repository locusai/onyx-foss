"use client"

import type { Meta, StoryObj } from "@storybook/react"
import type { ReactNode } from "react"
import { useMemo, useState } from "react"

import type {
  LLMProviderDescriptor,
  ModelConfiguration,
} from "@/app/admin/configuration/llm/interfaces"
import { ProviderIcon } from "@/app/admin/configuration/llm/ProviderIcon"
import * as SettingsLayouts from "@/layouts/settings-layouts"
import Button from "@/refresh-components/buttons/Button"
import Checkbox from "@/refresh-components/inputs/Checkbox"
import InputSelect from "@/refresh-components/inputs/InputSelect"
import InputTypeIn from "@/refresh-components/inputs/InputTypeIn"
import Switch from "@/refresh-components/inputs/Switch"
import Modal from "@/refresh-components/Modal"
import Text from "@/refresh-components/texts/Text"
import { cn } from "@/lib/utils"
import {
  storybookDefaultOpenClawLlmCatalogVersion,
  storybookOpenClawLlmCatalogVersions,
} from "@/stories/fixtures/llm"
import { Content, ContentAction } from "@opal/layouts"
import {
  SvgArrowExchange,
  SvgCpu,
  SvgPlusCircle,
  SvgRefreshCw,
  SvgSettings,
  SvgTrash,
  SvgUsers,
  SvgX,
} from "@opal/icons"

function StoryCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-12 border border-border-01 bg-background-neutral-01">
      {children}
    </div>
  )
}

function StoryInputHorizontal({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-[16rem_1fr] items-center gap-3 p-4">
      <Content
        title={title}
        description={description}
        sizePreset="main-ui"
        variant="section"
      />
      <div>{children}</div>
    </div>
  )
}

function StorySelectCard({
  children,
  selected,
  onClick,
}: {
  children: ReactNode
  selected?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer overflow-hidden rounded-12 border text-left transition-colors",
        selected
          ? "border-border-05 bg-background-neutral-02"
          : "border-border-01 bg-background-neutral-01 hover:bg-background-neutral-02",
      )}
    >
      {children}
    </button>
  )
}

type ProviderCatalogEntry = {
  provider: string
  productName: string
  companyName: string
  models: ModelConfiguration[]
}

function providerCatalogFromProviders(
  providers: LLMProviderDescriptor[],
): ProviderCatalogEntry[] {
  return providers.map((provider) => ({
    provider: provider.provider,
    productName: provider.provider_display_name || provider.name,
    companyName:
      provider.name || provider.provider_display_name || provider.provider,
    models: provider.model_configurations,
  }))
}

function catalogEntryFromProvider(
  provider: LLMProviderDescriptor,
): ProviderCatalogEntry {
  return {
    provider: provider.provider,
    productName: provider.provider_display_name || provider.name,
    companyName:
      provider.name || provider.provider_display_name || provider.provider,
    models: provider.model_configurations,
  }
}

function cloneProvider(provider: LLMProviderDescriptor): LLMProviderDescriptor {
  return {
    ...provider,
    is_public: provider.is_public ?? true,
    groups: provider.groups ?? [],
    personas: provider.personas ?? [],
    model_configurations: provider.model_configurations.map((model) => ({
      ...model,
    })),
  }
}

function providerFromCatalog(
  entry: ProviderCatalogEntry,
): LLMProviderDescriptor {
  const defaultModel = entry.models.find((model) => model.is_visible)
  return {
    name: entry.companyName,
    provider: entry.provider,
    provider_display_name: entry.companyName,
    default_model_name: defaultModel?.name ?? entry.models[0]?.name ?? "",
    is_default_provider: false,
    is_public: true,
    groups: [],
    personas: [],
    model_configurations: entry.models.map((model) => ({ ...model })),
  }
}

function modelLabel(model: ModelConfiguration) {
  return model.display_name || model.name
}

interface ProviderCardProps {
  provider: LLMProviderDescriptor
  selected: boolean
  isDefault: boolean
  onConfigure: () => void
  onDelete: () => void
}

function ExistingProviderCard({
  provider,
  selected,
  isDefault,
  onConfigure,
  onDelete,
}: ProviderCardProps) {
  const entry = catalogEntryFromProvider(provider)

  return (
    <StorySelectCard selected={selected} onClick={onConfigure}>
      <ContentAction
        icon={() => <ProviderIcon provider={provider.provider} size={20} />}
        title={provider.name || entry.productName}
        description={entry.companyName}
        sizePreset="main-ui"
        variant="section"
        paddingVariant="lg"
        tag={isDefault ? { title: "Default", color: "blue" } : undefined}
        rightChildren={
          <div className="flex flex-row items-stretch">
            <Button
              main
              tertiary
              size="md"
              leftIcon={SvgTrash}
              aria-label={`Delete ${provider.name}`}
              onClick={(event) => {
                event.stopPropagation()
                onDelete()
              }}
            />
            <Button
              main
              tertiary
              size="md"
              leftIcon={SvgSettings}
              aria-label={`Configure ${provider.name}`}
              onClick={(event) => {
                event.stopPropagation()
                onConfigure()
              }}
            />
          </div>
        }
      />
    </StorySelectCard>
  )
}

function NewProviderCard({
  entry,
  onConfigure,
}: {
  entry: ProviderCatalogEntry
  onConfigure: () => void
}) {
  return (
    <StorySelectCard onClick={onConfigure}>
      <ContentAction
        icon={() => <ProviderIcon provider={entry.provider} size={20} />}
        title={entry.productName}
        description={entry.companyName}
        sizePreset="main-ui"
        variant="section"
        paddingVariant="lg"
        rightChildren={
          <Button
            main
            tertiary
            size="md"
            rightIcon={SvgArrowExchange}
            onClick={(event) => {
              event.stopPropagation()
              onConfigure()
            }}
          >
            Connect
          </Button>
        }
      />
    </StorySelectCard>
  )
}

interface ProviderSetupModalProps {
  provider: LLMProviderDescriptor
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (provider: LLMProviderDescriptor) => void
}

function ProviderSetupModal({
  provider,
  open,
  onOpenChange,
  onSave,
}: ProviderSetupModalProps) {
  const entry = catalogEntryFromProvider(provider)
  const [draft, setDraft] = useState(() => cloneProvider(provider))
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [newModelName, setNewModelName] = useState("")
  const visibleModels = draft.model_configurations.filter(
    (model) => model.is_visible,
  )
  const defaultModel =
    visibleModels.find((model) => model.name === draft.default_model_name) ??
    visibleModels[0]

  function updateModels(models: ModelConfiguration[]) {
    const nextDefault =
      models.find((model) => model.name === draft.default_model_name)
        ?.is_visible === true
        ? draft.default_model_name
        : models.find((model) => model.is_visible)?.name || ""

    setDraft({
      ...draft,
      default_model_name: nextDefault,
      model_configurations: models,
    })
  }

  function addModel() {
    const modelName = newModelName.trim()
    if (
      !modelName ||
      draft.model_configurations.some((model) => model.name === modelName)
    ) {
      return
    }

    updateModels([
      ...draft.model_configurations,
      {
        name: modelName,
        display_name: modelName,
        is_visible: true,
        max_input_tokens: 128000,
        supports_image_input: false,
        supports_reasoning: false,
      },
    ])
    setNewModelName("")
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content width="md" height="lg">
        <div className="flex h-[34rem] max-h-[calc(100dvh-6rem)] flex-col bg-background-neutral-00">
          <div className="flex items-start justify-between border-b border-border-01 p-4">
            <div className="flex min-w-0 gap-2">
              <div className="mt-0.5">
                <ProviderIcon provider={draft.provider} size={24} />
              </div>
              <div className="min-w-0">
                <Text as="p" headingH3>
                  Configure {draft.name || entry.productName}
                </Text>
                <Text as="p" secondaryBody text03>
                  Connect to {entry.companyName} and set up available models.
                </Text>
              </div>
            </div>
            <Button
              main
              tertiary
              size="md"
              leftIcon={SvgX}
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            />
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[18rem_1fr] gap-0 overflow-hidden">
            <div className="border-r border-border-01 p-4">
              <div className="space-y-3">
                <div>
                  <Text as="p" text04 mainUiAction>
                    Provider
                  </Text>
                  <div className="mt-2 rounded-12 border border-border-01 bg-background-neutral-01 p-2">
                    <div className="flex items-center gap-2">
                      <ProviderIcon provider={draft.provider} size={20} />
                      <div>
                        <Text as="p" text04 mainUiAction>
                          {entry.productName}
                        </Text>
                        <Text as="p" secondaryBody text03>
                          {entry.companyName}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Text as="p" text04 mainUiAction>
                    Test model
                  </Text>
                  <div className="mt-2">
                    <InputSelect
                      value={defaultModel?.name}
                      onValueChange={(value) =>
                        setDraft({ ...draft, default_model_name: value })
                      }
                    >
                      <InputSelect.Trigger placeholder="Select model" />
                      <InputSelect.Content>
                        {visibleModels.map((model) => (
                          <InputSelect.Item key={model.name} value={model.name}>
                            {modelLabel(model)}
                          </InputSelect.Item>
                        ))}
                      </InputSelect.Content>
                    </InputSelect>
                  </div>
                </div>

                <div className="rounded-12 border border-border-01 bg-background-neutral-01 p-3">
                  <Text as="p" text04 mainUiAction>
                    Models Access
                  </Text>
                  <Text as="p" secondaryBody text03>
                    All users and agents
                  </Text>
                  <div className="mt-3 flex items-center gap-2 rounded-08 bg-background-neutral-02 p-2">
                    <SvgUsers className="h-4 w-4 stroke-text-03" />
                    <Text as="p" secondaryBody text03>
                      Admin is always shared.
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1">
                    <Text as="span" text04 mainUiAction>
                      Display Name
                    </Text>
                    <InputTypeIn
                      value={draft.name}
                      onChange={(event) =>
                        setDraft({ ...draft, name: event.target.value })
                      }
                      placeholder="Display Name"
                    />
                  </label>
                  <label className="block space-y-1">
                    <Text as="span" text04 mainUiAction>
                      API Key
                    </Text>
                    <InputTypeIn value="sk-••••••••••••••••" readOnly />
                  </label>
                </div>

                {(draft.provider === "openrouter" ||
                  draft.provider === "bifrost" ||
                  draft.provider === "openai_compatible" ||
                  draft.provider === "ollama_chat") && (
                  <label className="block space-y-1">
                    <Text as="span" text04 mainUiAction>
                      API Base URL
                    </Text>
                    <InputTypeIn
                      value={
                        draft.provider === "openrouter"
                          ? "https://openrouter.ai/api/v1"
                          : draft.provider === "bifrost"
                            ? "https://your-bifrost-gateway.com/v1"
                            : "http://host.docker.internal:11434"
                      }
                      readOnly
                    />
                  </label>
                )}

                <div className="rounded-12 border border-border-01 bg-background-neutral-01 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <Text as="p" text04 mainUiAction>
                        Models
                      </Text>
                      <Text as="p" secondaryBody text03>
                        Select models to make available for this provider.
                      </Text>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        main
                        tertiary
                        size="md"
                        leftIcon={SvgRefreshCw}
                        onClick={() => updateModels(draft.model_configurations)}
                      />
                      <Button
                        main
                        tertiary
                        size="md"
                        onClick={() =>
                          updateModels(
                            draft.model_configurations.map((model) => ({
                              ...model,
                              is_visible: !draft.model_configurations.every(
                                (candidate) => candidate.is_visible,
                              ),
                            })),
                          )
                        }
                      >
                        {draft.model_configurations.every(
                          (model) => model.is_visible,
                        )
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {draft.model_configurations.map((model) => (
                      <button
                        key={model.name}
                        type="button"
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between rounded-08 p-2 text-left transition-colors",
                          model.is_visible
                            ? "bg-background-neutral-02"
                            : "hover:bg-background-neutral-02",
                        )}
                        onClick={() =>
                          updateModels(
                            draft.model_configurations.map((candidate) =>
                              candidate.name === model.name
                                ? {
                                    ...candidate,
                                    is_visible: !candidate.is_visible,
                                  }
                                : candidate,
                            ),
                          )
                        }
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <Checkbox checked={model.is_visible} readOnly />
                          <div className="min-w-0">
                            <Text as="p" text04 mainUiAction>
                              {modelLabel(model)}
                            </Text>
                            <Text as="p" secondaryBody text03>
                              {model.name}
                            </Text>
                          </div>
                        </div>
                        {draft.default_model_name === model.name && (
                          <span className="rounded-08 bg-background-neutral-03 px-1.5 py-0.5 text-xs text-text-03">
                            Test
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {!autoUpdate && (
                    <div className="mt-3 flex gap-2">
                      <div className="min-w-0 flex-1">
                        <InputTypeIn
                          value={newModelName}
                          onChange={(event) =>
                            setNewModelName(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault()
                              addModel()
                            }
                          }}
                          placeholder="Enter model name"
                        />
                      </div>
                      <Button
                        action
                        secondary
                        size="md"
                        leftIcon={SvgPlusCircle}
                        disabled={!newModelName.trim()}
                        onClick={addModel}
                      >
                        Add Model
                      </Button>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-border-01 pt-3">
                    <div>
                      <Text as="p" text04 mainUiAction>
                        Auto Update
                      </Text>
                      <Text as="p" secondaryBody text03>
                        Update available models when new models are released.
                      </Text>
                    </div>
                    <Switch
                      checked={autoUpdate}
                      onCheckedChange={setAutoUpdate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t border-border-01 p-4">
            <Button
              main
              secondary
              size="md"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button main secondary size="md">
                Test
              </Button>
              <Button
                action
                primary
                size="md"
                onClick={() => {
                  onSave(draft)
                  onOpenChange(false)
                }}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

function ProviderDeleteModal({
  provider,
  open,
  onOpenChange,
  onDelete,
}: {
  provider: LLMProviderDescriptor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}) {
  if (!provider) return null

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content width="sm" height="fit">
        <div className="space-y-4 p-4">
          <div className="flex gap-2">
            <SvgTrash className="mt-1 h-5 w-5 stroke-status-error-05" />
            <div>
              <Text as="p" headingH3>
                Delete {provider.name}
              </Text>
              <Text as="p" secondaryBody text03>
                All models from this provider will be unavailable for future
                chats. Chat history stays.
              </Text>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              main
              secondary
              size="md"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              danger
              primary
              size="md"
              onClick={() => {
                onDelete()
                onOpenChange(false)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

interface LanguageModelsConfiguration32Props {
  catalogVersionId?: string
}

function LanguageModelsConfiguration32({
  catalogVersionId = storybookDefaultOpenClawLlmCatalogVersion.id,
}: LanguageModelsConfiguration32Props) {
  const catalogVersion =
    storybookOpenClawLlmCatalogVersions.find(
      (version) => version.id === catalogVersionId,
    ) ?? storybookDefaultOpenClawLlmCatalogVersion
  const fixtureProviders = catalogVersion.providers
  const providerCatalog = useMemo(
    () => providerCatalogFromProviders(fixtureProviders),
    [fixtureProviders],
  )

  const [providers, setProviders] = useState<LLMProviderDescriptor[]>(() =>
    fixtureProviders.slice(0, 2).map(cloneProvider),
  )
  const [defaultValue, setDefaultValue] = useState(
    `${fixtureProviders[0]!.provider}:${
      fixtureProviders[0]!.default_model_name
    }`,
  )
  const [activeProvider, setActiveProvider] =
    useState<LLMProviderDescriptor | null>(null)
  const [deleteProvider, setDeleteProvider] =
    useState<LLMProviderDescriptor | null>(null)

  const configuredProviderNames = useMemo(
    () => new Set(providers.map((provider) => provider.provider)),
    [providers],
  )

  const defaultProviderKey = defaultValue.split(":")[0]
  const availableProviderCatalog = providerCatalog.filter(
    (entry) => !configuredProviderNames.has(entry.provider),
  )

  function upsertProvider(provider: LLMProviderDescriptor) {
    setProviders((current) => {
      const exists = current.some(
        (candidate) => candidate.provider === provider.provider,
      )
      return exists
        ? current.map((candidate) =>
            candidate.provider === provider.provider ? provider : candidate,
          )
        : [...current, provider]
    })
  }

  function removeProvider(provider: LLMProviderDescriptor) {
    setProviders((current) =>
      current.filter((candidate) => candidate.provider !== provider.provider),
    )
    if (activeProvider?.provider === provider.provider) {
      setActiveProvider(null)
    }
  }

  return (
    <main className="h-screen w-screen bg-background-tint-01 text-text-04">
      <SettingsLayouts.Root>
        <SettingsLayouts.Header
          icon={SvgCpu}
          title="Language Models"
          separator
        />

        <SettingsLayouts.Body>
          <StoryCard>
            <StoryInputHorizontal
              title="Default Model"
              description="This model will be used by Onyx by default in your chats."
            >
              <InputSelect value={defaultValue} onValueChange={setDefaultValue}>
                <InputSelect.Trigger placeholder="Select a default model" />
                <InputSelect.Content>
                  {providers.map((provider) => (
                    <InputSelect.Group key={provider.provider}>
                      <InputSelect.Label>{provider.name}</InputSelect.Label>
                      {provider.model_configurations
                        .filter((model) => model.is_visible)
                        .map((model) => (
                          <InputSelect.Item
                            key={`${provider.provider}:${model.name}`}
                            value={`${provider.provider}:${model.name}`}
                          >
                            {modelLabel(model)}
                          </InputSelect.Item>
                        ))}
                    </InputSelect.Group>
                  ))}
                </InputSelect.Content>
              </InputSelect>
            </StoryInputHorizontal>
          </StoryCard>

          <section className="space-y-3">
            <Content
              title="Available Providers"
              sizePreset="main-content"
              variant="section"
            />
            <div className="flex flex-col gap-2">
              {providers.map((provider) => (
                <ExistingProviderCard
                  key={provider.provider}
                  provider={provider}
                  selected={activeProvider?.provider === provider.provider}
                  isDefault={defaultProviderKey === provider.provider}
                  onConfigure={() => setActiveProvider(cloneProvider(provider))}
                  onDelete={() => setDeleteProvider(provider)}
                />
              ))}
            </div>
          </section>

          <div className="border-t border-border-01" />

          <section className="space-y-3">
            <Content
              title="Add Provider"
              description="Onyx supports both popular providers and self-hosted models."
              sizePreset="main-content"
              variant="section"
            />
            <div className="grid grid-cols-2 gap-2">
              {availableProviderCatalog.map((entry) => (
                <NewProviderCard
                  key={entry.provider}
                  entry={entry}
                  onConfigure={() =>
                    setActiveProvider(providerFromCatalog(entry))
                  }
                />
              ))}
            </div>
          </section>

          {activeProvider && (
            <ProviderSetupModal
              key={activeProvider.provider}
              provider={activeProvider}
              open={!!activeProvider}
              onOpenChange={(open) => {
                if (!open) setActiveProvider(null)
              }}
              onSave={upsertProvider}
            />
          )}

          <ProviderDeleteModal
            provider={deleteProvider}
            open={!!deleteProvider}
            onOpenChange={(open) => {
              if (!open) setDeleteProvider(null)
            }}
            onDelete={() => deleteProvider && removeProvider(deleteProvider)}
          />
        </SettingsLayouts.Body>
      </SettingsLayouts.Root>
    </main>
  )
}

const meta = {
  title: "Onyx-OSS/LLM/ProviderModelPicker32",
  component: LanguageModelsConfiguration32,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LanguageModelsConfiguration32>

export default meta

type Story = StoryObj<typeof meta>

export const IntendedUse: Story = {
  args: {
    catalogVersionId: storybookDefaultOpenClawLlmCatalogVersion.id,
  },
  argTypes: {
    catalogVersionId: {
      control: "select",
      options: storybookOpenClawLlmCatalogVersions.map((version) => version.id),
    },
  },
  render: (args) => (
    <LanguageModelsConfiguration32
      key={args.catalogVersionId}
      catalogVersionId={args.catalogVersionId}
    />
  ),
}
