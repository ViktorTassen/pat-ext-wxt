
import { storage } from 'wxt/storage';
/**
 * Intercepts fetch requests and dispatches custom events when specific API endpoints are called
 */
export const initializeFetchInterceptor = (): void => {
    // Store the original fetch function
    const originalFetch = window.fetch;

    
    // Replace the global fetch with our interceptor
    window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
      // Call the original fetch
      const response = await originalFetch.call(window, input, init);
      
      // Get the URL string
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      // Process specific API endpoints
      if (url.includes('api/drivers')) {
        try {
          // Clone and parse JSON directly
          const json = await response.clone().json();
          try {
            window.dispatchEvent(new CustomEvent('saveAllDrivers', {
              detail: { 
                drivers: json.data
              }
            }));
            console.log("Drivers data intercepted");
          } catch (error) {
            console.error("Error dispatching drivers event:", error);
          }
        } catch (error) {
          console.error("Error processing drivers API response:", error);
        }
      }
  
      if (url.includes('/api/loadboard/orders/get')) {
        try {
          // Clone and parse JSON directly
          const json = await response.clone().json();
          try {
            console.log('orders', json.truckCapacityOrders)
            storage.setItem('local:orders', json.truckCapacityOrders),
            // window.dispatchEvent(new CustomEvent('saveAllOrders', {
            //   detail: { 
            //     orders: json.truckCapacityOrders
            //   }
            // }));
            console.log("Orders data intercepted");
          } catch (error) {
            console.error("Error dispatching orders event:", error);
          }
        } catch (error) {
          console.error("Error processing orders API response:", error);
        }
      }
      
      // Return the original response
      return response;
    };
  };