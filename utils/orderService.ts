
console.log('Order service loaded');
export async function deleteOrder(orderId: string, version: number) {
    const token = document.querySelector('[name=x-csrf-token]')?.getAttribute('content') || '';
    const domain = window.location.hostname;

    console.log('Deleting order', orderId, version, token, domain);

    
    const body = {
      cancellationReason: "FOUND_OTHER_WORK",
      cancellationComment: ""
    };
  
    const response = await fetch(`https://${domain}/api/loadboard/orders/cancel/${orderId}/${version}`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-csrf-token': token
      },
      referrer: `https://${domain}/loadboard/orders?state=active`,
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: JSON.stringify(body),
      mode: 'cors',
      credentials: 'include'
    });
  
    if (!response.ok) {
      throw new Error(`Failed to delete order ${orderId}`);
    }
  }
  
  export async function deleteOrders(orders: Array<{ id: string; version: number }>) {
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      
      try {
        await deleteOrder(order.id, order.version);
        
        // Dispatch progress event
        window.dispatchEvent(new CustomEvent('deleteProgress', {
          detail: {
            current: i + 1,
            total: orders.length
          }
        }));
        
        // Add delay between requests
        if (i < orders.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      } catch (error) {
        console.error(`Failed to delete order ${order.id}:`, error);
        throw error;
      }
    }
  }