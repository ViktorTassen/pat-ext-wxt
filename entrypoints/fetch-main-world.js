export default defineUnlistedScript(() => {
    // Store the original fetch function
    const originalFetch = window.fetch;

    // Replace the global fetch with our interceptor
    window.fetch = async function (...args) {
      // Get the URL string
      const request = args[0];
      const url = request instanceof Request ? request.url : request instanceof URL ? request.href : request;

      // Call the original fetch function
      const response = await originalFetch(...args);

      
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
          console.log("json?.workOpportunities", json?.workOpportunities)
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