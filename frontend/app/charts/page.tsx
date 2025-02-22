"use client";
import AnalysisCharts from "../components/AnalysisCharts";
import { useDemographic } from "../DemographicContext";
export default function Charts() {
  const { demographicData } = useDemographic();  // Access the global data

    return (
        <div className="min-h-screen flex flex-col items-center">
            <AnalysisCharts demographData={demographicData} />
        </div>
    );
}