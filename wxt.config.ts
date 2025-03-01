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
  },
});


