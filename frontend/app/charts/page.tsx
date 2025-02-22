"use client";
import AnalysisCharts from "../components/AnalysisCharts";
export default function Charts() {

    return (
        //   <div>
        //     <h1>Chart Page</h1>
        //     <pre>{JSON.stringify(data, null, 2)}</pre>
        //   </div>
        <div className="min-h-screen flex flex-col items-center">
            <AnalysisCharts />
        </div>
    );
}