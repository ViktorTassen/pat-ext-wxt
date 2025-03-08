import type { Order, OrderChanges, OrderAction, ProgressEvent } from './types';
import { orderService } from './orderService';
import { eventBus } from './eventBus';

class OrderProcessor {
  private static instance: OrderProcessor;
  private readonly BATCH_SIZE = 10;
  
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
    
    try {
      if (action === 'delete') {
        // Process deletions in batches of BATCH_SIZE
        const orderIds = orders.map(order => ({
          id: order.id,
          version: order.version
        }));

        // Split orders into batches
        for (let i = 0; i < orderIds.length; i += this.BATCH_SIZE) {
          const batch = orderIds.slice(i, i + this.BATCH_SIZE);
          try {
            await orderService.deleteOrders(batch);
            completed += batch.length;
            this.emitProgress(action, { completed, failed, total, isComplete: false });
            
            // Add delay between batches
            if (i + this.BATCH_SIZE < orderIds.length) {
              await new Promise(resolve => setTimeout(resolve, 600));
            }
          } catch (error) {
            failed += batch.length;
            this.emitProgress(action, { completed, failed, total, isComplete: false });
          }
        }
      } else {
        // Process modify and clone operations one by one
        for (let i = 0; i < orders.length; i++) {
          try {
            const order = orders[i];
            
            if (action === 'modify') {
              await orderService.modifyOrder(order, changes!);
            } else if (action === 'clone') {
              await orderService.cloneOrder(order, changes!);
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
      }
    } catch (error) {
      // If the entire operation fails, mark remaining orders as failed
      failed = total - completed;
      this.emitProgress(action, { completed, failed, total, isComplete: false });
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