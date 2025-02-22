"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  ChartConfiguration,
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  PointElement
);

interface AnalysisData {
  race: { percentages: Record<string, number> };
  sex: { percentages: Record<string, number>; raw_counts: Record<string, number> };
  age: { percentages: Record<string, number> };
  political_affiliation: { percentages: Record<string, number> };
  children: { percentages: Record<string, number> };
  income: { raw_counts: Record<string, number> };
  marital_status: { percentages: Record<string, number> };
  religion: { raw_counts: Record<string, number> };
  industry: { raw_counts: Record<string, number> };
  property_owner: { percentages: Record<string, number>; raw_counts: Record<string, number> };
}

export default function AnalysisCharts() {
  const raceRef = useRef<HTMLCanvasElement | null>(null);
  const sexRef = useRef<HTMLCanvasElement | null>(null);
  const ageRef = useRef<HTMLCanvasElement | null>(null);
  const politicalRef = useRef<HTMLCanvasElement | null>(null);
  const childrenRef = useRef<HTMLCanvasElement | null>(null);
  const incomeRef = useRef<HTMLCanvasElement | null>(null);
  const maritalStatusRef = useRef<HTMLCanvasElement | null>(null);
  const religionRef = useRef<HTMLCanvasElement | null>(null);
  const industryRef = useRef<HTMLCanvasElement | null>(null);
  const propertyOwnerRef = useRef<HTMLCanvasElement | null>(null);

  const [chartInstances, setChartInstances] = useState<Record<string, Chart>>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchDataAndRenderCharts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/conversation/analyze");
        const data: AnalysisData = response.data.analysis;

        const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"];

        const createChart = (
          ref: React.RefObject<HTMLCanvasElement | null>,
          config: ChartConfiguration,
          key: string
        ) => {
          if (chartInstances[key]) chartInstances[key].destroy();
          const canvas = ref.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              const newChart = new Chart(ctx, config);
              setChartInstances((prev) => ({ ...prev, [key]: newChart }));
            }
          }
        };

        // Race Chart
        createChart(raceRef, {
          type: "bar",
          data: {
            labels: Object.keys(data.race.percentages),
            datasets: [{
              label: "Race Percentages",
              data: Object.values(data.race.percentages),
              backgroundColor: colors,
            }]
          },
          options: {
            responsive: true,
            layout: { padding: { left: 20, right: 20 } },
            scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
            plugins: { legend: { display: false } },
          }
        }, "raceChart");

        // Sex Chart - Stacked Ratio with Label Fixes
        createChart(sexRef, {
          type: "bar",
          data: {
            labels: ['Gender'],
            datasets: Object.entries(data.sex.percentages).map(([label, value], index) => ({
              label,
              data: [value],
              backgroundColor: colors[index],
            }))
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            layout: { padding: { left: 30, right: 30 } },
            scales: {
              x: {
                stacked: true,
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Percentage (%)' },
                ticks: { callback: (value) => `${value}%` },
              },
              y: {
                stacked: true,
                ticks: { autoSkip: false, maxRotation: 0, minRotation: 0, padding: 15 },
              },
            },
            plugins: {
              legend: { display: true, position: 'right' },
              tooltip: {
                callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}%` },
              },
            },
            clip: false,
          }
        }, "sexChart");

        // Age Chart
        createChart(ageRef, {
          type: "line",
          data: {
            labels: Object.keys(data.age.percentages),
            datasets: [{
              label: "Age Distribution",
              data: Object.values(data.age.percentages),
              fill: true,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "#4BC0C0",
              tension: 0.4,
            }]
          },
          options: {
            responsive: true,
            layout: { padding: { left: 20, right: 20 } },
            scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
          }
        }, "ageChart");

        // Political Affiliation Chart
        createChart(politicalRef, {
          type: "pie",
          data: {
            labels: Object.keys(data.political_affiliation.percentages),
            datasets: [{
              data: Object.values(data.political_affiliation.percentages),
              backgroundColor: colors,
            }]
          },
          options: { responsive: true }
        }, "politicalChart");

        // Children Chart
        createChart(childrenRef, {
          type: "pie",
          data: {
            labels: Object.keys(data.children.percentages),
            datasets: [{
              data: Object.values(data.children.percentages),
              backgroundColor: colors.slice(0, 2),
            }]
          },
          options: { responsive: true }
        }, "childrenChart");

        // Income Chart
        createChart(incomeRef, {
          type: "bar",
          data: {
            labels: Object.keys(data.income.raw_counts),
            datasets: [{
              label: "Income Distribution",
              data: Object.values(data.income.raw_counts),
              backgroundColor: colors,
            }]
          },
          options: {
            responsive: true,
            layout: { padding: { left: 20, right: 20 } },
            scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
            plugins: { legend: { display: false } },
          }
        }, "incomeChart");

        // Marital Status Chart
        createChart(maritalStatusRef, {
          type: "pie",
          data: {
            labels: Object.keys(data.marital_status.percentages),
            datasets: [{
              data: Object.values(data.marital_status.percentages),
              backgroundColor: colors.slice(0, 4),
            }]
          },
          options: { responsive: true }
        }, "maritalStatusChart");

        // Religion Chart
        createChart(religionRef, {
          type: "bar",
          data: {
            labels: Object.keys(data.religion.raw_counts),
            datasets: [{
              label: "Religion Distribution",
              data: Object.values(data.religion.raw_counts),
              backgroundColor: colors,
            }]
          },
          options: {
            responsive: true,
            layout: { padding: { left: 20, right: 20 } },
            scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
            plugins: { legend: { display: false } },
          }
        }, "religionChart");

        // Industry Chart
        createChart(industryRef, {
          type: "bar",
          data: {
            labels: Object.keys(data.industry.raw_counts),
            datasets: [{
              label: "Industry Distribution",
              data: Object.values(data.industry.raw_counts),
              backgroundColor: colors,
            }]
          },
          options: {
            indexAxis: "y",
            responsive: true,
            layout: { padding: { left: 30, right: 30 } },
            scales: {
              x: { beginAtZero: true },
              y: { ticks: { autoSkip: false, padding: 15 } },
            },
            plugins: { legend: { display: false } },
          }
        }, "industryChart");

        // Property Owner Chart - Stacked Ratio with Label Fixes
        createChart(propertyOwnerRef, {
          type: "bar",
          data: {
            labels: ['Property Ownership'],
            datasets: Object.entries(data.property_owner.percentages).map(([label, value], index) => ({
              label,
              data: [value],
              backgroundColor: colors[index],
            }))
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            layout: { padding: { left: 40, right: 40 } },
            scales: {
              x: {
                stacked: true,
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Percentage (%)' },
                ticks: { callback: (value) => `${value}%` },
              },
              y: {
                stacked: true,
                ticks: { autoSkip: false, maxRotation: 0, minRotation: 0, padding: 15 },
              },
            },
            plugins: {
              legend: { display: true, position: 'right' },
              tooltip: {
                callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}%` },
              },
            },
            clip: false,
          }
        }, "propertyOwnerChart");

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndRenderCharts();

    return () => {
      Object.values(chartInstances).forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-10 py-10">
      <h2 className="text-2xl font-bold">Race - Bar Chart</h2>
      <canvas ref={raceRef}></canvas>

      <h2 className="text-2xl font-bold">Sex - Stacked Ratio</h2>
      <canvas ref={sexRef}></canvas>

      <h2 className="text-2xl font-bold">Age - Bell Curve (Line Chart)</h2>
      <canvas ref={ageRef}></canvas>

      <h2 className="text-2xl font-bold">Political Affiliation - Pie Chart</h2>
      <canvas ref={politicalRef}></canvas>

      <h2 className="text-2xl font-bold">Children - Pie Chart</h2>
      <canvas ref={childrenRef}></canvas>

      <h2 className="text-2xl font-bold">Income - Bar Chart</h2>
      <canvas ref={incomeRef}></canvas>

      <h2 className="text-2xl font-bold">Marital Status - Pie Chart</h2>
      <canvas ref={maritalStatusRef}></canvas>

      <h2 className="text-2xl font-bold">Religion - Bar Chart</h2>
      <canvas ref={religionRef}></canvas>

      <h2 className="text-2xl font-bold">Industry - Horizontal Bar Chart</h2>
      <canvas ref={industryRef}></canvas>

      <h2 className="text-2xl font-bold">Property Ownership - Stacked Ratio</h2>
      <canvas ref={propertyOwnerRef}></canvas>
    </div>
  );
}
