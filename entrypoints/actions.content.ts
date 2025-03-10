export default defineContentScript({
    matches: ['https://relay.amazon.com/loadboard/orders'],
    runAt: "document_start",
    async main() {
      console.log('Injecting script...');
      await injectScript('/actions-main-world.js', {
        keepInDom: true,
      });
      console.log('Done!');
  
    },
  });