"use client";
import AnalysisCharts from "../components/AnalysisCharts";
import { useState, useEffect } from 'react';
import { useDemographic } from "../DemographicContext";
import LoadingScreen from '../components/LoadingScreen';

export default function Charts() {
  const { demographicData } = useDemographic();  // Access the global data
  const [isLoading, setIsLoading] = useState(true);  // Loading state

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);  // 3-second delay
    return () => clearTimeout(timer);  // Cleanup
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <AnalysisCharts demographData={demographicData} />
      )}
    </div>
  );
}
