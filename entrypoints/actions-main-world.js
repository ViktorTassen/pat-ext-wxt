import { orderProcessor } from '../utils/orderProcessor';
import { orderService } from '../utils/orderService';

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
    
    try {
      const { 
        workOpportunityId, 
        minPayout, 
        minPricePerDistance, 
        distanceUnit, 
        stemTime,
        selectedDriverIds,
        workOpportunity // Pass the workOpportunity directly from the component
      } = event.detail;
      
      if (!workOpportunity) {
        throw new Error(`Work opportunity data not provided`);
      }
      
      // Create the order using orderService
      const result = await orderService.createOrderFromWorkOpportunity(workOpportunity, {
        minPayout,
        minPricePerDistance,
        distanceUnit,
        stemTime,
        selectedDriverIds
      });
      
      console.log('Order created successfully', result);
      
      // Dispatch success event
      window.dispatchEvent(new CustomEvent('pat-postTruckSuccess', { 
        detail: { 
          workOpportunityId,
          orderId: result.id
        } 
      }));
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Dispatch error event
      window.dispatchEvent(new CustomEvent('pat-postTruckError', { 
        detail: { 
          error: error.message || "Unknown error occurred"
        } 
      }));
    }
  });
});