"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface DemographicContextProps {
    demographicData: Record<string, any> | null;
    setDemographicData: (data: Record<string, any> | null) => void;
}

const DemographicContext = createContext<DemographicContextProps | undefined>(undefined);

export const DemographicProvider = ({ children }: { children: ReactNode }) => {
    const [demographicData, setDemographicData] = useState<Record<string, any> | null>(null);

    return (
        <DemographicContext.Provider value={{ demographicData, setDemographicData }}>
            {children}
        </DemographicContext.Provider>
    );
};

export const useDemographic = () => {
    const context = useContext(DemographicContext);
    if (!context) {
        throw new Error("useDemographic must be used within a DemographicProvider");
    }
    return context;
};