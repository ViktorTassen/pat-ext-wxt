export default defineContentScript({
    matches: ['https://relay.amazon.com/loadboard/*'],
    runAt: "document_start",
    async main() {
      console.log('Injecting script actions-main-world.js...');
      await injectScript('/actions-main-world.js', {
        keepInDom: true,
      });
      console.log('Done!');
  
    },
  });