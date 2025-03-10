import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Driver } from './types';

interface LoadboardContextType {
  opportunities: any[];
  drivers: Driver[];
  isLoading: boolean;
}

const LoadboardContext = createContext<LoadboardContextType>({
  opportunities: [],
  drivers: [],
  isLoading: true
});

export const LoadboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedOpportunities, loadedDrivers] = await Promise.all([
          storage.getItem('local:workOpportunities') as Promise<any[]>,
          storage.getItem('local:drivers') as Promise<Driver[]>
        ]);
        
        if (loadedOpportunities) {
          setOpportunities(loadedOpportunities);
        }
        
        if (loadedDrivers) {
          setDrivers(loadedDrivers.filter(driver => driver.status === 'active'));
        }
      } catch (error) {
        console.error("Error loading data from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <LoadboardContext.Provider value={{ opportunities, drivers, isLoading }}>
      {children}
    </LoadboardContext.Provider>
  );
};

export const useLoadboard = () => useContext(LoadboardContext);