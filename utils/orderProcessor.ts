import type { Order, OrderChanges, OrderAction, ProgressEvent } from './types';
import { orderService } from './orderService';
import { eventBus } from './eventBus';

class OrderProcessor {
  private static instance: OrderProcessor;
  
  private constructor() {}

  static getInstance(): OrderProcessor {
    if (!OrderProcessor.instance) {
      OrderProcessor.instance = new OrderProcessor();
    }
    return OrderProcessor.instance;
  }

  async processOrders(orders: Order[], changes: OrderChanges | undefined, action: OrderAction) {
    let completed = 0;
    let failed = 0;
    const total = orders.length;
    
    for (let i = 0; i < orders.length; i++) {
      try {
        const order = orders[i];
        
        switch (action) {
          case 'delete':
            await orderService.deleteOrder(order.id, order.version);
            break;
          case 'modify':
            await orderService.modifyOrder(order, changes!);
            break;
          case 'clone':
            await orderService.cloneOrder(order, changes!);
            break;
        }
        
        completed++;
        this.emitProgress(action, { completed, failed, total, isComplete: false });
        
        if (i < orders.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      } catch (error) {
        failed++;
        this.emitProgress(action, { completed, failed, total, isComplete: false });
      }
    }

    this.handleCompletion(action, { completed, failed, total });
  }

  private emitProgress(action: OrderAction, progress: ProgressEvent) {
    eventBus.emitProgress(action, progress);
  }

  private handleCompletion(action: OrderAction, result: { completed: number; failed: number; total: number }) {
    if (result.completed > 0) {
      const progress: ProgressEvent = {
        ...result,
        isComplete: true
      };
      eventBus.emitSuccess(action, progress);
      
      setTimeout(() => window.location.reload(), 1500);
    } else if (result.failed > 0) {
      eventBus.emitError(action, `Failed to ${action} ${result.failed} order${result.failed !== 1 ? 's' : ''}`);
    }
  }
}

export const orderProcessor = OrderProcessor.getInstance();