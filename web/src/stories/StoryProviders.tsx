"use client";

import type { ReactNode } from "react";
import { AuthType } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppProvider from "@/providers/AppProvider";
import { ProjectsProvider } from "@/providers/ProjectsContext";
import { storybookSettings, storybookUser } from "@/stories/fixtures";

interface StoryProvidersProps {
  children: ReactNode;
  forcedTheme?: "light" | "dark";
  folded?: boolean;
}

export default function StoryProviders({
  children,
  forcedTheme = "light",
  folded = false,
}: StoryProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme={forcedTheme}
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider>
        <AppProvider
          user={storybookUser}
          settings={storybookSettings}
          folded={folded}
          authTypeMetadata={{
            authType: AuthType.BASIC,
            autoRedirect: false,
            requiresVerification: false,
            anonymousUserEnabled: true,
            passwordMinLength: 8,
            hasUsers: true,
            oauthEnabled: false,
          }}
        >
          <ProjectsProvider>{children}</ProjectsProvider>
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
