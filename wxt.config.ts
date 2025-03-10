import { defineConfig, defineRunnerConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  runner: defineRunnerConfig({
    disabled: true,
  }),
  manifest: {
    permissions: ['storage'],
    web_accessible_resources: [
      {
        resources: ["fetch-driver-main-world.js","fetch-main-world.js", "actions-main-world.js"],
        matches: ["*://*/*"],
      }
    ]
  },
});