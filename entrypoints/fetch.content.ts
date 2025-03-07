export default defineContentScript({
  matches: ['*://*/*'],
  runAt: "document_start",
  async main() {
    console.log('Injecting script...');
    await injectScript('/fetch-main-world.js', {
      keepInDom: true,
    });
    console.log('Done!');

    // Listen for custom events from the fetch interceptor
    window.addEventListener('orders', async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Orders data received:', customEvent.detail?.orders);
      
      // Save orders data to storage
      if (customEvent.detail?.orders) {
        try {
          await storage.setItem('local:orders', customEvent.detail.orders);
          console.log('Orders data saved to storage successfully');
        } catch (err) {
          console.error("Error saving orders data to storage:", err);
        }
      }
    });
    
    window.addEventListener('drivers', async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Drivers data received:', customEvent.detail?.drivers);
      
      // Save drivers data to storage
      if (customEvent.detail?.drivers) {
        try {
          await storage.setItem('local:drivers', customEvent.detail.drivers);
          console.log('Drivers data saved to storage successfully');
        } catch (err) {
          console.error("Error saving drivers data to storage:", err);
        }
      }
    });
  },
});