import { defineConfig, defineRunnerConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  runner: defineRunnerConfig({
    disabled: true,
  }),
  manifest: {
    name: 'Rocket Relay Post Truck Manager',
    description: 'Rocket Post-a-Truck Manager for Amazon Relay Loadboard (Rocket PAT Manager)',
    permissions: ['storage', 'declarativeNetRequest', 'tabs', 'offscreen', 'identity'],
    action: {
      default_title: "PAT Extension",
      default_popup: "popup/index.html"
    },
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
    ],
    host_permissions: [
      "https://rocket-post.firebaseapp.com/*",
    ],


    oauth2: {
      client_id: "968131648916-q1ds7o49q4jeao9nmvm1k8g9pu17tbva.apps.googleusercontent.com",
      scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
      ]
    }
  },
});