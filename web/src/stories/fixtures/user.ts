import { AuthTypeMetadata } from "@/lib/userSS";
import { AuthType } from "@/lib/constants";
import { ThemePreference, UserRole, type User } from "@/lib/types";

export const storybookUser = {
  id: "user_storybook_1",
  email: "a@example.com",
  is_active: true,
  is_superuser: false,
  is_verified: true,
  role: UserRole.BASIC,
  team_name: "Onyx",
  preferences: {
    chosen_assistants: null,
    visible_assistants: [],
    hidden_assistants: [],
    default_model: null,
    recent_assistants: [],
    auto_scroll: true,
    shortcut_enabled: true,
    temperature_override_enabled: true,
    theme_preference: ThemePreference.LIGHT,
    chat_background: null,
    default_app_mode: "CHAT",
  },
} satisfies User;

export const storybookAuthTypeMetadata = {
  // OIDC/SAML skip the periodic token refresh call in `useTokenRefresh`.
  authType: AuthType.OIDC,
  autoRedirect: false,
  requiresVerification: false,
  anonymousUserEnabled: true,
  passwordMinLength: 8,
  hasUsers: true,
  oauthEnabled: true,
} satisfies AuthTypeMetadata;

