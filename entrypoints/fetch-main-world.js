export default defineUnlistedScript(() => {
  // Store the original fetch function
  const originalFetch = window.fetch;

  // Replace the global fetch with our interceptor
  window.fetch = async function (...args) {
    // Get the URL string and request details
    const request = args[0];
    const options = args[1] || {};
    const url = request instanceof Request ? request.url : request instanceof URL ? request.href : request;
    const method = request instanceof Request ? request.method : options.method || 'GET';

    try {
      // Call the original fetch function
      const response = await originalFetch(...args);
      
      // Process specific API endpoints
      if (url.includes('api/drivers')) {
        // Clone the response since we can only read the body once
        const responseClone = response.clone();
        try {
          const json = await responseClone.json();
          if (json?.data) {
            console.log("Drivers data intercepted");
            window.dispatchEvent(new CustomEvent('pat-drivers', {
              detail: { 
                drivers: json.data
              }
            }));
          }
        } catch (err) {
          console.log("Skipping drivers API processing:", err.message);
        }
      }

      if (url.includes('/api/loadboard/orders/get')) {
        try {
          const responseClone = response.clone();
          const json = await responseClone.json();
          if (json?.truckCapacityOrders) {
            console.log('Orders intercepted');
            window.dispatchEvent(new CustomEvent('pat-orders', {
              detail: { 
                orders: json.truckCapacityOrders
              }
            }));
          }
        } catch (err) {
          console.log("Skipping orders API processing:", err.message);
        }
      }

      if (url.includes('api/loadboard/search')) {
        try {
          const responseClone = response.clone();
          const json = await responseClone.json();
          
          if (json?.workOpportunities) {
            console.log('Work opportunities intercepted');
            window.dispatchEvent(new CustomEvent('pat-workOpportunities', {
              detail: { 
                workOpportunities: json.workOpportunities
              }
            }));
          }
        } catch (err) {
          console.log("Skipping work opportunities processing:", err.message);
        }
      }
      
      // Return the original response
      return response;
    } catch (error) {
      // If it's an abort error, just log and continue
      
    }
  };

  // Fetch drivers
  try {
    const response = fetch("https://relay.amazon.com/api/drivers/basic", {
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      referrer: "https://relay.amazon.com/loadboard/orders?state=active",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include"
    });

  } catch (error) {
    console.error("Error fetching drivers:", error);
  }
});