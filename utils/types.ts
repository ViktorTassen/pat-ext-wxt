export type Region = 'US' | 'UK' | 'DE' | 'ES' | 'FR' | 'IT' | 'PL' | 'IN' | 'CZ' | 'JP' | 'CA';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}


export interface Driver {
  firstName: string;
  lastName: string;
  latestTransientDriverId: string;
  status: string;
  emailId: string;
  domiciles?: any;
}

export interface Order {
  id: string;
  version: number;
  alias: string;
  status?: string;
  matchType?: string;
  startTime: string;
  endTime: string;
  totalCost: {
    unit: string;
    value: number;
  };
  costPerDistance: {
    currencyUnit: string;
    distanceUnit: string;
    value: number;
  };
  minPickUpBufferInMinutes: number;
  maxNumberOfStops: number;
  originCityRadius: {
    unit: string;
    value: number;
  };
  destinationCityRadius: {
    unit: string;
    value: number;
  };
  driverTypes: string[];
  supplyTransientDriverIdList: string[];
  visibleProvidedTrailerType?: string;
  providedTrailerType?: string;
  visibleEquipmentTypes?: string;
  equipmentTypes?: string[];
  loadingTypeList?: string[];
}

export interface OrderChanges {
  startDateTime?: string;
  endDateTime?: string;
  minPayout?: string;
  minPricePerMile?: string;
  stemTime?: string;
  maxStops?: string;
  originRadius?: string;
  destinationRadius?: string;
  selectedDriverIds?: string[] | null;
}

export interface ProgressEvent {
  completed: number;
  failed: number;
  total: number;
  isComplete: boolean;
}

export type OrderAction = 'modify' | 'clone' | 'delete';

export interface WorkOpportunity {
  id: string;
  version: number;
  majorVersion: number;
  entityType: string | null;
  operatorIds: any | null;
  startTime: string | null;
  endTime: string | null;
  expirationTime: string | null;
  expectedArrivalForNextStop: string | null;
  stopCount: number;
  isRetendered: boolean | null;
  isUnaccepted: boolean | null;
  businessType: string | null;
  contractId: string | null;
  payout: {
    value: number;
    unit: string;
  };
  transitOperatorType: string;
  totalDuration: number;
  totalLayover: number;
  tourState: string;
  firstPickupTime: string;
  lastDeliveryTime: string;
  totalDistance: {
    value: number;
    unit: string;
  };
  loads: Array<{
    versionedLoadId: {
      id: string;
      version: number | null;
    };
    stops: Array<{
      stopId: string | null;
      stopType: string;
      stopSequenceNumber: number;
      location: {
        label: string;
        stopCode: string;
        line1: string;
        line2: string | null;
        line3: string | null;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        latitude: number;
        longitude: number;
        timeZone: string;
        vendorCodes: any | null;
        domicile: string;
      };
      locationCode: string;
      weight: {
        value: number;
        unit: string;
      } | null;
      actions: Array<{
        type: string;
        plannedTime: string;
        actualTime: string | null;
        actualTimeSource: string | null;
        delayReport: any | null;
        yardEvents: any | null;
      }>;
      trailerDetails: Array<{
        assetId: string | null;
        assetSource: string | null;
        assetOwner: string;
        assetType: string | null;
        trailerLoadingStatus: string | null;
        dropTrailerETA: string | null;
      }>;
      loadingType: string | null;
      unloadingType: string | null;
      pickupInstructions: string | null;
      deliveryInstructions: string | null;
      pickupNumbers: any | null;
      deliveryNumbers: any | null;
      contacts: any | null;
      stopRequirements: Array<{
        requirement: string | null;
        stopRequirementType: string;
        containerOwner: string;
        oceanCarrierSCAC: string | null;
      }>;
      stopCategory: string;
      isVendorLocation: boolean | null;
      dropTrailerTime: string | null;
      calculatedEstimateArrivalTime: string | null;
      appointmentApplicability: any[];
    }>;
    loadType: string;
    equipmentType: string;
    weight: any | null;
    distance: {
      value: number;
      unit: string;
    };
    payout: {
      value: number;
      unit: string;
    };
    costItems: Array<{
      name: string;
      monetaryAmount: {
        value: number;
        unit: string;
      };
    }>;
    layoverDuration: number;
    specialServices: any[];
    loadShipperAccounts: string[];
    shipperReferenceNumbers: any[];
    purchaseOrders: any[];
    isExternalLoad: boolean;
    existingSubCarrierName: string;
    workOpportunityId: string;
    loadfreightType: string;
    aggregatedFreightAttributes: {
      freightCommodities: string[];
      temperature: any | null;
    };
    woLoadCarrierSpecificShipperAccounts: {
      [key: string]: boolean;
    };
  }>;
  aggregatedCostItems: Array<{
    name: string;
    monetaryAmount: {
      value: number;
      unit: string;
    };
  }>;
  workType: string;
  workOpportunityOptionId: string;
  workOpportunityType: string;
  deadhead: {
    value: number;
    unit: string;
  };
  createdAtTime: string;
  endPriorityTime: string | null;
  relevanceScore: number;
  carrierSpecificShipperAccounts: {
    [key: string]: boolean;
  };
  startLocation: {
    label: string;
    stopCode: string;
    line1: string;
    line2: string | null;
    line3: string | null;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    timeZone: string;
    vendorCodes: any | null;
    domicile: string;
  };
  endLocation: {
    label: string;
    stopCode: string;
    line1: string;
    line2: string | null;
    line3: string | null;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    timeZone: string;
    vendorCodes: any | null;
    domicile: string;
  };
  powerType: string | null;
  shouldShowPriorityBadge: boolean;
  workOpportunityArrivalWindows: Array<{
    start: string;
    end: string;
  }>;
  matchDeviationDetails: any | null;
  eligibleFeatures: any[];
  carrierIneligibleForWOReasonList: any[];
  carrierIneligibleForWOContextMap: any;
  nationality: string | null;
  searchChannelStampedDuration: {
    workOpportunities: number;
    bidding: number;
    operator: number;
    postATruck: number;
    commercialCarrierAdhocBoard: number;
    contract: number;
    negotiation: number;
  };
  tags: any[];
  demandSupportEnabled: boolean;
  laportLoad: boolean;
  chassisDepotLoad: boolean;
  oneDayPaymentEligible: boolean;
  adHocLoad: boolean;
}