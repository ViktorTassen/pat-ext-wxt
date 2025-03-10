export default defineUnlistedScript(async () => {
  try {
    const response = await fetch("https://relay.amazon.com/api/drivers/basic", {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data?.data) {
      // Dispatch the same event that our fetch interceptor would dispatch
      window.dispatchEvent(new CustomEvent('pat-drivers', {
        detail: { 
          drivers: data.data
        }
      }));
    }
  } catch (error) {
    console.error("Error fetching drivers:", error);
  }
});