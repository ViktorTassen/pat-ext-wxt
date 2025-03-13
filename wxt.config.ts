import { defineConfig, defineRunnerConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  runner: defineRunnerConfig({
    disabled: true,
  }),
  manifest: {
    permissions: ['storage', 'declarativeNetRequest'],
    web_accessible_resources: [
      {
        resources: ["fetch-main-world.js", "actions-main-world.js"],
        matches: [
          "*://relay.amazon.com/*",
          "*://relay.amazon.co.uk/*",
          "*://relay.amazon.de/*",
          "*://relay.amazon.es/*",
          "*://relay.amazon.ca/*",
          "*://relay.amazon.fr/*",
          "*://relay.amazon.it/*",
          "*://relay.amazon.pl/*",
          "*://relay.amazon.in/*",
          "*://relay.amazon.cz/*",
          "*://relay.amazon.co.jp/*"
        ],
      }
    ]
  },
});