export type Region = 'US' | 'UK' | 'DE' | 'ES' | 'FR' | 'IT' | 'PL' | 'IN' | 'CZ' | 'JP';

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
}

export interface ProgressEvent {
  completed: number;
  failed: number;
  total: number;
  isComplete: boolean;
}

export type OrderAction = 'modify' | 'clone' | 'delete';