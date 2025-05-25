"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface DemographicContextType {
  demographicData: Record<string, any> | null;
  setDemographicData: (data: Record<string, any>) => void;
}

// Create the context
const DemographicContext = createContext<DemographicContextType | undefined>(undefined);

// Custom hook for easier usage
export const useDemographic = () => {
  const context = useContext(DemographicContext);
  if (!context) {
    throw new Error("useDemographic must be used within a DemographicProvider");
  }
  return context;
};

// Provider component
export const DemographicProvider = ({ children }: { children: ReactNode }) => {
  const [demographicData, setDemographicData] = useState<Record<string, any> | null>(null);

  return (
    <DemographicContext.Provider value={{ demographicData, setDemographicData }}>
      {children}
    </DemographicContext.Provider>
  );
};
