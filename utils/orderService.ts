import type { Order, OrderChanges, WorkOpportunity } from './types';

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
  
  async createOrderFromWorkOpportunity(workOpportunity: WorkOpportunity, options: {
    minPayout: number;
    minPricePerDistance: number;
    distanceUnit: string;
    stemTime: number;
    selectedDriverIds: string[] | null;
  }) {
    // Extract locations from the work opportunity
    const origin = workOpportunity.startLocation;
    const destination = workOpportunity.endLocation;
    
    // Create order payload with type annotation to include all fields
    const orderPayload: {
      runType: string;
      originCityInfo: any;
      originCityRadius: any;
      destinationCityInfo: any;
      isAnywhereDestination: boolean;
      destinationCityInfoForFilter: any;
      destinationCityRadius: any;
      startTime: string;
      endTime: string;
      distanceOrDuration: string;
      minDistance: any;
      maxDistance: any;
      minDurationInMinutes: any;
      maxDurationInMinutes: any;
      driverTypes: string[];
      payoutType: string;
      totalCost: any;
      costPerDistance: any;
      minPickUpBufferInMinutes: number;
      maxNumberOfStops: number;
      endLocationList: any[];
      endRegionList: any[];
      supplyDriverIdList: any[];
      supplyTransientDriverIdList: string[];
      exclusionCityList: any[];
      excludeSpecialServices: string[];
      visibleProvidedTrailerType?: string;
      providedTrailerType?: string;
      visibleEquipmentTypes?: string;
      equipmentTypes?: string[];
      loadingTypeList?: string[];
    } = {
      runType: workOpportunity.workOpportunityType || "ONE_WAY",
      originCityInfo: {
        name: origin.city,
        stateCode: origin.state,
        country: origin.country,
        latitude: origin.latitude,
        longitude: origin.longitude,
        displayValue: `${origin.city}, ${origin.state}`,
        isCityLive: false,
        isAnywhere: false,
        uniqueKey: `${origin.latitude}${origin.city}, ${origin.state}`
      },
      originCityRadius: {
        value: 25,
        unit: options.distanceUnit === "miles" || options.distanceUnit === "mi" ? "mi" : "km"
      },
      destinationCityInfo: null,
      isAnywhereDestination: false,
      destinationCityInfoForFilter: null,
      destinationCityRadius: {
        value: 25,
        unit: options.distanceUnit === "miles" || options.distanceUnit === "mi" ? "mi" : "km"
      },
      startTime: new Date(new Date(workOpportunity.firstPickupTime).getTime() - 60 * 1000).toISOString(), // 1 minute before
      endTime: new Date(new Date(workOpportunity.lastDeliveryTime).getTime() + 60 * 1000).toISOString(), // 1 minute after
      distanceOrDuration: "DISTANCE",
      minDistance: {
        value: Math.max(1, Math.floor(workOpportunity.totalDistance.value - 0.1)), // 0.1 less, but min 1
        unit: options.distanceUnit === "miles" ? "mi" : options.distanceUnit
      },
      maxDistance: {
        value: Math.ceil(workOpportunity.totalDistance.value + 0.1), // 0.1 more
        unit: options.distanceUnit === "miles" ? "mi" : options.distanceUnit
      },
      minDurationInMinutes: null,
      maxDurationInMinutes: null,
      driverTypes: [options.selectedDriverIds && options.selectedDriverIds.length > 1 ? "TEAM" : "SOLO"],
      payoutType: "FLAT_RATE",
      totalCost: {
        value: options.minPayout,
        unit: workOpportunity.payout.unit
      },
      costPerDistance: {
        value: options.minPricePerDistance,
        currencyUnit: workOpportunity.payout.unit,
        distanceUnit: options.distanceUnit === "miles" ? "mi" : options.distanceUnit
      },
      minPickUpBufferInMinutes: options.stemTime,
      maxNumberOfStops: workOpportunity.stopCount,
      endLocationList: [{
        name: destination.city,
        stateCode: destination.state,
        country: destination.country,
        latitude: destination.latitude,
        longitude: destination.longitude,
        nearestDomicileCode: null,
        displayValue: `${destination.city}, ${destination.state}`
      }],
      endRegionList: [],
      supplyDriverIdList: [],
      supplyTransientDriverIdList: options.selectedDriverIds || [],
      exclusionCityList: [],
      excludeSpecialServices: ["SWING_DOOR"]
    };

    // Determine trailer ownership
    const trailerOwner = 
      workOpportunity.loads[0]?.stops[0]?.trailerDetails[0]?.assetOwner != null ? 
      "AMAZON_PROVIDED" : "CARRIER_OWNED";
    
    orderPayload.visibleProvidedTrailerType = trailerOwner;
    orderPayload.providedTrailerType = trailerOwner;
    
    // Handle equipment types based on the requirement
    if (workOpportunity.loads[0]?.equipmentType === "FIFTY_THREE_FOOT_TRUCK") {
      orderPayload.visibleEquipmentTypes = "FIFTY_THREE_FOOT_TRUCK";
      orderPayload.equipmentTypes = [
        "FIFTY_THREE_FOOT_TRUCK",
        "SKIRTED_FIFTY_THREE_FOOT_TRUCK",
        "FIFTY_THREE_FOOT_DRY_VAN",
        "FIFTY_THREE_FOOT_A5_AIR_TRAILER",
        "FORTY_FIVE_FOOT_TRUCK"
      ];
    } else {
      // Use the equipment type from work opportunity
      const equipmentType = workOpportunity.loads[0]?.equipmentType || "FIFTY_THREE_FOOT_TRUCK";
      orderPayload.visibleEquipmentTypes = equipmentType;
      orderPayload.equipmentTypes = [equipmentType];
    }

    // Set loading type based on work opportunity
    const loadingTypes: string[] = [];
    workOpportunity.loads[0]?.stops.forEach(stop => {
      if (stop.loadingType) loadingTypes.push(stop.loadingType);
      if (stop.unloadingType) loadingTypes.push(stop.unloadingType);
    });
    
    if (loadingTypes.length > 0) {
      orderPayload.loadingTypeList = [...new Set(loadingTypes)]; // remove duplicates
    } else {
      orderPayload.loadingTypeList = ["DROP"];
    }

    return this.makeRequest('/api/loadboard/orders/upsert', 'POST', orderPayload);
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

    // Handle driver changes
    if (changes.selectedDriverIds === null) {
      // Remove all drivers but keep existing driver type
      updatedOrder.supplyTransientDriverIdList = [];
    } else if (Array.isArray(changes.selectedDriverIds)) {
      // Update drivers and driver type based on number of selected drivers
      updatedOrder.supplyTransientDriverIdList = changes.selectedDriverIds;
      updatedOrder.driverTypes = [changes.selectedDriverIds.length > 1 ? 'TEAM' : 'SOLO'];
    }

    return updatedOrder;
  }
}

export const orderService = new OrderService();