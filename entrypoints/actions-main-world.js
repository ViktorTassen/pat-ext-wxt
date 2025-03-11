import { orderProcessor } from '../utils/orderProcessor';

export default defineUnlistedScript(() => {
  console.log("Actions script loaded");

  // Listen for order action requests
  ['delete', 'modify', 'clone'].forEach(action => {
    window.addEventListener(`${action}OrdersRequest`, async (event) => {
      console.log(`Received ${action} orders request`);
      const { orders, changes } = event.detail;
      await orderProcessor.processOrders(orders, changes, action);
    });
  });

  // Listen for post truck requests
  window.addEventListener('pat-postTruck', async (event) => {
    console.log('Received post truck request', event.detail);
    // TODO: Implement actual API call to post truck
    // For now, just log the request
    const { workOpportunityId, minPayout } = event.detail;
    console.log(`Would post truck for work opportunity ${workOpportunityId} with min payout $${minPayout}`);
    
    // Simulate successful processing
    // This should be replaced with actual API implementation
  });
});