import type { Order, OrderChanges, OrderAction, ProgressEvent } from './types';

class EventBus {
  private static instance: EventBus;
  
  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  emitProgress(action: OrderAction, progress: ProgressEvent) {
    window.dispatchEvent(new CustomEvent(`${action}Progress`, { detail: progress }));
  }

  emitSuccess(action: OrderAction, result: ProgressEvent) {
    window.dispatchEvent(new CustomEvent(`${action}OrdersSuccess`, { detail: result }));
  }

  emitError(action: OrderAction, error: string) {
    window.dispatchEvent(new CustomEvent(`${action}OrdersError`, { detail: { error } }));
  }

  emitRequest(action: OrderAction, orders: Order[], changes?: OrderChanges) {
    window.dispatchEvent(new CustomEvent(`${action}OrdersRequest`, {
      detail: { orders, changes }
    }));
  }
}

export const eventBus = EventBus.getInstance();