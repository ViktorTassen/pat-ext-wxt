
export default defineContentScript({
  matches: ['*://*/*'],
  runAt: "document_start",
  async main() {
    console.log('Injecting script...');
    await injectScript('/intercept.js', {
      keepInDom: true,
    });
    console.log('Done!');

     // Listen for custom events from the fetch interceptor
     window.addEventListener('orders', (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Orders data received:', customEvent.detail?.orders);
      // You can process the data here or send it to the background script
    });
    
    window.addEventListener('drivers', (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Drivers data received:', customEvent.detail?.drivers);
      // You can process the data here or send it to the background script
    });

  },
});