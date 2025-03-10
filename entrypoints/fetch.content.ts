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
    window.addEventListener('pat-orders', async (event: Event) => {
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

    interface Driver {
      domiciles?: any;
      [key: string]: any;
    }
    
    window.addEventListener('pat-drivers', async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Drivers data received:', customEvent.detail?.drivers);
      
      // Save drivers data to storage
      if (customEvent.detail?.drivers && Array.isArray(customEvent.detail.drivers)) {
        try {
          // Create a safe copy of the drivers array and remove domiciles
          const sanitizedDrivers = customEvent.detail.drivers.map((driver: Driver) => {
            // Create a new object without the domiciles property
            const { domiciles, ...driverWithoutDomiciles } = driver;
            return driverWithoutDomiciles;
          });
          
          await storage.setItem('local:drivers', sanitizedDrivers);
          console.log('Drivers data saved to storage successfully');
        } catch (err) {
          console.error("Error saving drivers data to storage:", err);
        }
      }
    });


    window.addEventListener('pat-workOpportunities', async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('workOpportunities data received:', customEvent.detail?.workOpportunities);
      
      // Save drivers data to storage
      if (customEvent.detail?.workOpportunities && Array.isArray(customEvent.detail.workOpportunities)) {
        try {
          await storage.setItem('local:workOpportunities', customEvent.detail?.workOpportunities);
          console.log('pat-workOpportunities data saved to storage successfully');
        } catch (err) {
          console.error("Error saving pat-workOpportunities data to storage:", err);
        }
      }
    });
  },
});