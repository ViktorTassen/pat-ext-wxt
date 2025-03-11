import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Driver } from './types';

interface OpportunityContextType {
  opportunities: any[];
  drivers: Driver[];
  updateOpportunities: (opportunities: any[]) => void;
  updateDrivers: (drivers: Driver[]) => void;
}

const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);

export function OpportunityProvider({ children }: { children: React.ReactNode }) {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    // Load initial drivers from storage
    const loadInitialData = async () => {
      try {
        const loadedDrivers = await storage.getItem('local:drivers') as Driver[];
        if (loadedDrivers) {
          setDrivers(loadedDrivers.filter(driver => driver.status === 'active'));
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    
    loadInitialData();

    // Listen for opportunities updates
    const handleOpportunitiesUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.opportunities) {
        setOpportunities(customEvent.detail.opportunities);
      }
    };

    // Listen for drivers updates
    const handleDriversUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.drivers) {
        setDrivers(customEvent.detail.drivers.filter((driver: Driver) => driver.status === 'active'));
      }
    };

    // Add event listeners
    window.addEventListener('opportunitiesUpdated', handleOpportunitiesUpdate);
    window.addEventListener('driversUpdated', handleDriversUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('opportunitiesUpdated', handleOpportunitiesUpdate);
      window.removeEventListener('driversUpdated', handleDriversUpdate);
    };
  }, []);

  const updateOpportunities = (newOpportunities: any[]) => {
    setOpportunities(newOpportunities);
  };

  const updateDrivers = (newDrivers: Driver[]) => {
    setDrivers(newDrivers.filter(driver => driver.status === 'active'));
  };

  return (
    <OpportunityContext.Provider value={{ 
      opportunities, 
      drivers, 
      updateOpportunities, 
      updateDrivers 
    }}>
      {children}
    </OpportunityContext.Provider>
  );
}

export function useOpportunity() {
  const context = useContext(OpportunityContext);
  if (context === undefined) {
    throw new Error('useOpportunity must be used within an OpportunityProvider');
  }
  return context;
}