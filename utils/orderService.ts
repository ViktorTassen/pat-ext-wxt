import type { Order, OrderChanges } from './types';

class OrderService {
  private readonly domain: string;

  constructor() {
    this.domain = window.location.hostname;
  }

  private getCSRFToken(): string {
    const token = document.querySelector('[name=x-csrf-token]')?.getAttribute('content');
    if (!token) {
      throw new Error('CSRF token not found');
    }
    return token;
  }

  private async makeRequest(endpoint: string, method: string, body: any) {
    const token = this.getCSRFToken();

    const response = await fetch(`https://${this.domain}${endpoint}`, {
      method,
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'x-csrf-token': token
      },
      referrer: `https://${this.domain}/loadboard/orders?state=active`,
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: JSON.stringify(body),
      mode: 'cors',
      credentials: 'include'
    });

    // For delete operations, we consider 2xx status codes as success
    if ((endpoint.includes('/cancel/') || endpoint.includes('/batch/cancel')) && response.ok) {
      return true;
    }

    // For other operations, we expect JSON response
    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteOrder(orderId: string, version: number) {
    return this.makeRequest(
      `/api/loadboard/orders/cancel/${orderId}/${version}`,
      'POST',
      {
        cancellationReason: "FOUND_OTHER_WORK",
        cancellationComment: ""
      }
    );
  }

  async deleteOrders(orders: Array<{ id: string; version: number }>) {
    return this.makeRequest(
      '/api/loadboard/orders/batch/cancel',
      'POST',
      {
        orders,
        cancellationDetails: {
          cancellationReason: "FOUND_OTHER_WORK",
          cancellationComment: ""
        }
      }
    );
  }

  async modifyOrder(order: Order, changes: OrderChanges) {
    const modifiedOrder = this.applyChanges(order, changes);
    return this.makeRequest('/api/loadboard/orders/upsert', 'POST', modifiedOrder);
  }

  async cloneOrder(order: Order, changes: OrderChanges) {
    const clonedOrder = this.applyChanges(order, changes);
    // Remove keys not needed for cloning
    const { id, status, version, alias, matchType, ...cleanOrder } = clonedOrder;
    return this.makeRequest('/api/loadboard/orders/upsert', 'POST', cleanOrder);
  }

  private applyChanges(order: Order, changes: OrderChanges): Order {
    const updatedOrder = { ...order };

    if (changes.startDateTime) {
      updatedOrder.startTime = new Date(changes.startDateTime).toISOString();
    }

    if (changes.endDateTime) {
      updatedOrder.endTime = new Date(changes.endDateTime).toISOString();
    }

    if (changes.minPayout) {
      updatedOrder.totalCost.value = parseFloat(changes.minPayout);
    }

    if (changes.minPricePerMile) {
      updatedOrder.costPerDistance.value = parseFloat(changes.minPricePerMile);
    }

    if (changes.stemTime) {
      updatedOrder.minPickUpBufferInMinutes = parseInt(changes.stemTime, 10);
    }

    if (changes.maxStops) {
      updatedOrder.maxNumberOfStops = parseInt(changes.maxStops, 10);
    }

    if (changes.originRadius) {
      updatedOrder.originCityRadius.value = parseInt(changes.originRadius, 10);
    }

    if (changes.destinationRadius) {
      updatedOrder.destinationCityRadius.value = parseInt(changes.destinationRadius, 10);
    }

    return updatedOrder;
  }
}

export const orderService = new OrderService();