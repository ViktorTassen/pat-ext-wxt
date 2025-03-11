import { Driver } from './types';

type Listener = () => void;

class StorageManager {
  private static instance: StorageManager;
  private opportunities: any[] = [];
  private drivers: Driver[] = [];
  private listeners: Set<Listener> = new Set();
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  async init() {
    if (this.initialized) return;
    
    try {
      // Only load drivers from storage, opportunities are managed in memory
      const loadedDrivers = await storage.getItem('local:drivers') as Driver[];
      this.drivers = (loadedDrivers || []).filter(driver => driver.status === 'active');
      this.initialized = true;
      this.notifyListeners();
    } catch (error) {
      console.error("Error loading data from storage:", error);
    }
  }

  getOpportunities(): any[] {
    return this.opportunities;
  }

  getDrivers(): Driver[] {
    return this.drivers;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Update methods for when new data comes in
  updateOpportunities(opportunities: any[]) {
    this.opportunities = opportunities;
    this.notifyListeners();
  }

  updateDrivers(drivers: Driver[]) {
    this.drivers = drivers.filter(driver => driver.status === 'active');
    this.notifyListeners();
  }
}

export const storageManager = StorageManager.getInstance();