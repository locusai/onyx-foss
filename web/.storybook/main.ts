import type { StorybookConfig } from "@storybook/nextjs";

if (!process.env.WATCHPACK_POLLING) {
  process.env.WATCHPACK_POLLING = "true";
}

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.mdx", "../src/stories/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "msw-storybook-addon",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
};

export default config;
