import { Driver } from '../utils/types';

export default defineContentScript({
  matches: ['https://relay.amazon.com/loadboard/*'],
  runAt: "document_start",
  async main() {
    console.log('Injecting script fetch-main-world...');
    await injectScript('/fetch-main-world.js', {
      keepInDom: true,
    });
    console.log('Done!');


    // save orders to localStorage
    window.addEventListener('pat-orders', async (event: Event) => {
      const customEvent = event as CustomEvent;
      
      if (customEvent.detail?.orders) {
        try {
          await storage.setItem('local:orders', customEvent.detail.orders);
          console.log('Orders data saved to storage successfully');
        } catch (err) {
          console.error("Error saving orders data to storage:", err);
        }
      }
    });

    // save drivers to storage
    window.addEventListener('pat-drivers', async (event: Event) => {
      const customEvent = event as CustomEvent;
      
      if (customEvent.detail?.drivers && Array.isArray(customEvent.detail.drivers)) {
        try {
          const sanitizedDrivers = customEvent.detail.drivers.map((driver: Driver) => {
            const { domiciles, ...driverWithoutDomiciles } = driver;
            return driverWithoutDomiciles;
          });
          
          await storage.setItem('local:drivers', sanitizedDrivers);
          console.log('Drivers data saved successfully');
        } catch (err) {
          console.error("Error saving drivers data:", err);
        }
      }
    });

  },
});