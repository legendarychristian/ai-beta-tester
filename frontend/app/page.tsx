"use client";
import { useEffect, useRef } from "react";
import Hero from "./components/Hero";
import AnalysisCharts from "./components/AnalysisCharts";
import { useDemographic } from "./context/DemographicContext";

export default function Home() {
  const chartsRef = useRef<HTMLDivElement>(null);
  const { demographicData } = useDemographic();

  useEffect(() => {
    document.body.classList.add("no-scroll"); // Default: no scroll
  }, []);

  const scrollToCharts = () => {
    chartsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div>
      <Hero onLoadingComplete={scrollToCharts} />
      <div ref={chartsRef}>
        <AnalysisCharts demographData={demographicData} />
      </div>
      {/* <div ref={conversationRef}>
        <Conversation />
      </div> */}
    </div>
  );
}
