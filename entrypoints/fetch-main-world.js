export default defineUnlistedScript(() => {
    // Store the original fetch function
    const originalFetch = window.fetch;

    // Replace the global fetch with our interceptor
    window.fetch = async function(input, init) {
      // Get the URL string
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      
      // Call the original fetch
      const response = await originalFetch.call(this, input, init);
      
      // Process specific API endpoints
      if (url.includes('api/drivers')) {
        // Clone the response since we can only read the body once
        const responseClone = response.clone();
        responseClone.json().then(json => {
          if (json?.data) {
            console.log("Drivers data intercepted");
            window.dispatchEvent(new CustomEvent('pat-drivers', {
              detail: { 
                drivers: json.data
              }
            }))
          }
        }).catch(err => {
          console.error("Error processing drivers API response:", err);
        });
      }

      if (url.includes('/api/loadboard/orders/get')) {
        const responseClone = response.clone();
        responseClone.json().then(json => {
          if (json?.truckCapacityOrders) {
            console.log('Orders intercepted');
            window.dispatchEvent(new CustomEvent('pat-orders', {
              detail: { 
                orders: json.truckCapacityOrders
              }
            }))

          }
        }).catch(err => {
          console.error("Error processing orders API response:", err);
        });
      }


      if (url.includes('api/loadboard/search')) {
        const responseClone = response.clone();
        responseClone.json().then(json => {
          if (json?.workOpportunities) {
            console.log('Orders intercepted');
            window.dispatchEvent(new CustomEvent('pat-workOpportunities', {
              detail: { 
                workOpportunities: json.workOpportunities
              }
            }))

          }
        }).catch(err => {
          console.error("Error processing orders API response:", err);
        });
      }
      
      // Return the original response
      return response;
    };

    



  });