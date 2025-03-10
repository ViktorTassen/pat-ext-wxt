import { storageManager } from '../utils/storageManager';
import { Driver } from '../utils/types';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: "document_start",
  async main() {
    console.log('Injecting script...');
    await injectScript('/fetch-main-world.js', {
      keepInDom: true,
    });
    console.log('Done!');

   // save orders to localStorage
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

    // save drivers to storageManager only
    window.addEventListener('pat-drivers', async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Drivers data received:', customEvent.detail?.drivers);
      
      // Save drivers data to storage and update manager
      if (customEvent.detail?.drivers && Array.isArray(customEvent.detail.drivers)) {
        try {
          // Create a safe copy of the drivers array and remove domiciles
          const sanitizedDrivers = customEvent.detail.drivers.map((driver: Driver) => {
            const { domiciles, ...driverWithoutDomiciles } = driver;
            return driverWithoutDomiciles;
          });
          
          storageManager.updateDrivers(sanitizedDrivers);
          console.log('Drivers data saved to storage successfully');
        } catch (err) {
          console.error("Error saving drivers data to storage:", err);
        }
      }
    });
    // save workOpportunities to storageManager only
    window.addEventListener('pat-workOpportunities', async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('workOpportunities data received:', customEvent.detail?.workOpportunities);
      
      // Update opportunities in storage manager only
      if (customEvent.detail?.workOpportunities && Array.isArray(customEvent.detail.workOpportunities)) {
        try {
          storageManager.updateOpportunities(customEvent.detail.workOpportunities);
          console.log('Work opportunities updated in storage manager successfully');
        } catch (err) {
          console.error("Error updating work opportunities:", err);
        }
      }
    });
  },
});