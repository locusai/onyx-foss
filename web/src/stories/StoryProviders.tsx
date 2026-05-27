"use client";

import type { ReactNode } from "react";
import AppProvider from "@/providers/AppProvider";
import { ProjectsProvider } from "@/providers/ProjectsContext";
import { MODAL_ROOT_ID } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PHProvider } from "@/app/providers";
import { fixtures } from "@/stories/fixtures";
import type { AuthTypeMetadata } from "@/lib/userSS";
import type { CombinedSettings } from "@/interfaces/settings";
import type { User } from "@/lib/types";

type StorybookTheme = "light" | "dark";

export interface StoryProvidersProps {
  children: ReactNode;
  forcedTheme?: StorybookTheme;
  folded?: boolean;
  user?: User | null;
  settings?: CombinedSettings;
  authTypeMetadata?: AuthTypeMetadata;
}

export default function StoryProviders({
  children,
  forcedTheme = "light",
  folded,
  user = fixtures.user,
  settings = fixtures.settings,
  authTypeMetadata = fixtures.authTypeMetadata,
}: StoryProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme={forcedTheme}
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className="text-text min-h-screen bg-background relative font-hanken">
        <TooltipProvider>
          <PHProvider>
            <AppProvider
              authTypeMetadata={authTypeMetadata}
              user={user}
              settings={settings}
              folded={folded}
            >
              <ProjectsProvider>
                <div id={MODAL_ROOT_ID} className="h-screen w-screen">
                  {children}
                </div>
              </ProjectsProvider>
            </AppProvider>
          </PHProvider>
        </TooltipProvider>
      </div>
    </ThemeProvider>
  );
}
