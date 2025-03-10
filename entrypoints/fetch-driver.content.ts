export default defineContentScript({
  matches: ['*://*/*'],
  runAt: "document_start",
  
  async main() {
    console.log('Injecting script fetch-driver-main-world.js...');
    await injectScript('/fetch-driver-main-world.js', {
      keepInDom: true,
    });
  },
});