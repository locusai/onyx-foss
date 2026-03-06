import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import { http, HttpResponse } from "msw";

import "../src/app/globals.css";
import StoryProviders from "../src/stories/StoryProviders";
import { fixtures } from "../src/stories/fixtures";

if (typeof document !== "undefined") {
  // `tailwind-themes/tailwind.config.js` references `var(--font-inter)` in
  // `fontFamily.sans`. In the app this is set by `next/font`, but Storybook
  // doesn't run that pipeline, so define a safe fallback.
  document.documentElement.style.setProperty("--font-inter", "Inter");
}

initialize({
  onUnhandledRequest(request, print) {
    // Fail fast on any missing API mocks, but allow static assets and
    // external resources (e.g. Google Fonts from globals.css).
    const pathname = (() => {
      try {
        return new URL(request.url).pathname;
      } catch {
        return "";
      }
    })();

    if (pathname.startsWith("/api/")) {
      print.error();
    }
  },
});

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    options: {
      storySort: {
        order: [
          "Onyx-OSS",
          ["Sidebar", ["AppSidebar", "SidebarBody", "SidebarTab", "SidebarSection", "SidebarWrapper", "UserAvatarPopover"]],
          ["Chat", ["Transcript", "TranscriptDemo"]],
          ["Input", ["AppInputBar"]],
          "*",
        ],
      },
    },
    nextjs: {
      appDirectory: true,
    },
    msw: {
      handlers: [
        http.get("/api/manage/connector-status", () =>
          HttpResponse.json(fixtures.ccPairs)
        ),
        http.get("/api/federated", () =>
          HttpResponse.json(fixtures.federatedConnectors)
        ),
        http.get("/api/input_prompt", () =>
          HttpResponse.json(fixtures.inputPrompts)
        ),
        http.get("/api/llm/provider", () =>
          HttpResponse.json(fixtures.llmProviders)
        ),
        http.get("/api/llm/persona/:personaId/providers", () =>
          HttpResponse.json(fixtures.llmProviders)
        ),
        http.get("/api/admin/llm/built-in/options", () =>
          HttpResponse.json(fixtures.llmProviderOptions)
        ),
        http.post("/api/admin/llm/test/default", () => new HttpResponse(null)),
        http.get("/api/user/projects", () =>
          HttpResponse.json(fixtures.projects)
        ),
        http.get("/api/user/files/recent", () =>
          HttpResponse.json(fixtures.recentFiles)
        ),
        http.get("/api/persona", () => HttpResponse.json(fixtures.agents)),
        http.get("/api/chat/get-user-chat-sessions", () =>
          HttpResponse.json({ sessions: fixtures.chatSessions })
        ),
        http.get("/api/notifications", () =>
          HttpResponse.json(fixtures.notifications)
        ),
        // Storybook-only: serve deterministic file payloads for chat UI fixtures.
        http.get("/api/chat/file/:fileId", async ({ params }) => {
          const fileId = String(params.fileId);
          const publicAsset =
            {
              "storybook-contract-image-1": "/craft_demo_image_1.png",
              "storybook-contract-image-2": "/craft_demo_image_2.png",
            }[fileId] ?? "/logo.png";

          const response = await fetch(publicAsset);
          const body = await response.arrayBuffer();
          const contentType =
            response.headers.get("Content-Type") ?? "image/png";

          return new HttpResponse(body, {
            headers: { "Content-Type": contentType },
          });
        }),
      ],
    },
  },
  decorators: [
    (Story, context) => (
      <StoryProviders
        forcedTheme={context.globals.theme}
        folded={context.parameters.sidebarFolded}
      >
        <Story />
      </StoryProviders>
    ),
  ],
  loaders: [mswLoader],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "UI theme",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
