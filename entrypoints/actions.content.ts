export default defineContentScript({
    matches: [
      "https://relay.amazon.com/loadboard/*",
      "https://relay.amazon.co.uk/loadboard/*",
      "https://relay.amazon.de/loadboard/*",
      "https://relay.amazon.es/loadboard/*",
      "https://relay.amazon.ca/loadboard/*",
      "https://relay.amazon.fr/loadboard/*",
      "https://relay.amazon.it/loadboard/*",
      "https://relay.amazon.pl/loadboard/*",
      "https://relay.amazon.in/loadboard/*",
      "https://relay.amazon.cz/loadboard/*",
      "https://relay.amazon.co.jp/loadboard/*"
    ],
    runAt: "document_start",
    async main() {
      console.log('Injecting script actions-main-world.js...');
      await injectScript('/actions-main-world.js', {
        keepInDom: true,
      });
      console.log('Done!');
  
    },
  });