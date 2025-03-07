export default defineContentScript({
    matches: ['*://*/*'],
    runAt: "document_start",
    async main() {
      console.log('Injecting script...');
      await injectScript('/actions-main-world.js', {
        keepInDom: true,
      });
      console.log('Done!');
  
    },
  });