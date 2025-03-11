// Create a context and provider in a separate file (e.g., WorkOpportunitiesContext.tsx)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WorkOpportunity {
  id: string;
  // Define other properties based on your actual data structure
  totalCost?: { value?: number };
  costPerDistance?: { value?: number };
  // Add other properties as needed
}

interface WorkOpportunitiesContextType {
  workOpportunities: WorkOpportunity[];
  getWorkOpportunityById: (id: string) => WorkOpportunity | undefined;
}

const WorkOpportunitiesContext = createContext<WorkOpportunitiesContextType>({
  workOpportunities: [],
  getWorkOpportunityById: () => undefined
});

export function WorkOpportunitiesProvider({ children }: { children: ReactNode }) {
  const [workOpportunities, setWorkOpportunities] = useState<WorkOpportunity[]>([]);

  useEffect(() => {
    const handleWorkOppsEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.workOpportunities) {
        setWorkOpportunities(customEvent.detail.workOpportunities);
      }
    };

    // Listen for work opportunities updates
    window.addEventListener('pat-workOpportunities', handleWorkOppsEvent);

    return () => {
      window.removeEventListener('pat-workOpportunities', handleWorkOppsEvent);
    };
  }, []);

  const getWorkOpportunityById = (id: string) => {
    return workOpportunities.find(opp => opp.id === id);
  };

  return (
    <WorkOpportunitiesContext.Provider value={{ 
      workOpportunities, 
      getWorkOpportunityById 
    }}>
      {children}
    </WorkOpportunitiesContext.Provider>
  );
}

// Custom hook to use the work opportunities context
export function useWorkOpportunities() {
  return useContext(WorkOpportunitiesContext);
}