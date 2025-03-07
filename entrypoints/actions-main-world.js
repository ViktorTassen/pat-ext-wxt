import { orderProcessor } from '../utils/orderProcessor';

export default defineUnlistedScript(() => {
  console.log("Actions script loaded");

  // Listen for order action requests
  ['delete', 'modify', 'clone'].forEach(action => {
    window.addEventListener(`${action}OrdersRequest`, async (event) => {
      const { orders, changes } = event.detail;
      await orderProcessor.processOrders(orders, changes, action);
    });
  });
});