"use client";
import { useEffect, useRef } from "react";
import { useDemographic } from "../context/DemographicContext";

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
  ChartType,
  ChartData,
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

interface AnalysisChartsProps {
  demographData: Record<string, any> | null;
}

type ChartRefs = {
  [K in "race" | "sex" | "age" | "political" | "children" | "income" | "maritalStatus" | "religion" | "industry" | "propertyOwner"]: HTMLCanvasElement | null;
};

const ensureNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return 0;
};

export default function AnalysisCharts({ demographData }: AnalysisChartsProps) {
  const refs = {
    race: useRef<HTMLCanvasElement>(null),
    sex: useRef<HTMLCanvasElement>(null),
    age: useRef<HTMLCanvasElement>(null),
    political: useRef<HTMLCanvasElement>(null),
    children: useRef<HTMLCanvasElement>(null),
    income: useRef<HTMLCanvasElement>(null),
    maritalStatus: useRef<HTMLCanvasElement>(null),
    religion: useRef<HTMLCanvasElement>(null),
    industry: useRef<HTMLCanvasElement>(null),
    propertyOwner: useRef<HTMLCanvasElement>(null),
  };

  const chartInstancesRef = useRef<Record<string, Chart>>({});

  const createChart = (
    canvas: HTMLCanvasElement | null,
    config: ChartConfiguration,
    key: string
  ) => {
    if (!canvas) return;

    if (chartInstancesRef.current[key]) {
      chartInstancesRef.current[key].destroy();
    }

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const newChart = new Chart(ctx, config);
      chartInstancesRef.current[key] = newChart;
    }
  };

  useEffect(() => {
    if (!demographData) return;

    const data = demographData;
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"];

    // Race Chart
    createChart(refs.race.current, {
      type: "bar" as const,
      data: {
        labels: Object.keys(data.race.percentages),
        datasets: [{
          label: "Race Percentages",
          data: Object.values(data.race.percentages).map(value => ensureNumber(value)),
          backgroundColor: colors,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: { padding: { left: 20, right: 20 } },
        scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
        plugins: { legend: { display: false } },
      },
    }, "raceChart");

    // Sex Chart
    createChart(refs.sex.current, {
      type: "bar" as const,
      data: {
        labels: ["Gender"],
        datasets: Object.entries(data.sex.percentages).map(([label, value], index) => ({
          label,
          data: [ensureNumber(value)],
          backgroundColor: colors[index],
        })),
      },
      options: {
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: true,
        layout: { padding: { left: 30, right: 30 } },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            max: 100,
            title: { display: true, text: "Percentage (%)" },
            ticks: { callback: (value) => `${value}%` },
          },
          y: {
            stacked: true,
            ticks: { padding: 15 },
          },
        },
        plugins: {
          legend: { display: true, position: "right" },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw as number}%`
            },
          },
        },
      },
    }, "sexChart");

    // Age Chart
    createChart(refs.age.current, {
      type: "line" as const,
      data: {
        labels: Object.keys(data.age.percentages),
        datasets: [{
          label: "Age Distribution",
          data: Object.values(data.age.percentages).map(value => ensureNumber(value)),
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "#4BC0C0",
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: { padding: { left: 20, right: 20 } },
        scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
      },
    }, "ageChart");

    // Political Chart
    createChart(refs.political.current, {
      type: "pie" as const,
      data: {
        labels: Object.keys(data.political_affiliation.percentages),
        datasets: [{
          data: Object.values(data.political_affiliation.percentages).map(value => ensureNumber(value)),
          backgroundColor: colors,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          }
        }
      },
    }, "politicalChart");

    // Children Chart
    createChart(refs.children.current, {
      type: "pie" as const,
      data: {
        labels: Object.keys(data.children.percentages),
        datasets: [{
          data: Object.values(data.children.percentages).map(value => ensureNumber(value)),
          backgroundColor: colors.slice(0, 2),
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          }
        }
      },
    }, "childrenChart");

    // Income Chart
    createChart(refs.income.current, {
      type: "bar" as const,
      data: {
        labels: Object.keys(data.income.raw_counts),
        datasets: [{
          label: "Income Distribution",
          data: Object.values(data.income.raw_counts).map(value => ensureNumber(value)),
          backgroundColor: colors,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: { padding: { left: 20, right: 20 } },
        scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
        plugins: { legend: { display: false } },
      },
    }, "incomeChart");

    // Marital Status Chart
    createChart(refs.maritalStatus.current, {
      type: "pie" as const,
      data: {
        labels: Object.keys(data.marital_status.percentages),
        datasets: [{
          data: Object.values(data.marital_status.percentages).map(value => ensureNumber(value)),
          backgroundColor: colors.slice(0, 4),
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          }
        }
      },
    }, "maritalStatusChart");

    // Religion Chart
    createChart(refs.religion.current, {
      type: "bar" as const,
      data: {
        labels: Object.keys(data.religion.raw_counts),
        datasets: [{
          label: "Religion Distribution",
          data: Object.values(data.religion.raw_counts).map(value => ensureNumber(value)),
          backgroundColor: colors,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: { padding: { left: 20, right: 20 } },
        scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
        plugins: { legend: { display: false } },
      },
    }, "religionChart");

    // Industry Chart
    createChart(refs.industry.current, {
      type: "bar" as const,
      data: {
        labels: Object.keys(data.industry.raw_counts),
        datasets: [{
          label: "Industry Distribution",
          data: Object.values(data.industry.raw_counts).map(value => ensureNumber(value)),
          backgroundColor: colors,
        }],
      },
      options: {
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: true,
        layout: { padding: { left: 30, right: 30 } },
        scales: {
          x: { beginAtZero: true },
          y: { ticks: { autoSkip: false, padding: 15 } },
        },
        plugins: { legend: { display: false } },
      },
    }, "industryChart");

    // Property Owner Chart
    createChart(refs.propertyOwner.current, {
      type: "bar" as const,
      data: {
        labels: ["Property Ownership"],
        datasets: Object.entries(data.property_owner.percentages).map(([label, value], index) => ({
          label,
          data: [ensureNumber(value)],
          backgroundColor: colors[index],
        })),
      },
      options: {
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: true,
        layout: { padding: { left: 40, right: 40 } },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            max: 100,
            title: { display: true, text: "Percentage (%)" },
            ticks: { callback: (value) => `${value}%` },
          },
          y: { stacked: true, ticks: { padding: 15 } },
        },
        plugins: {
          legend: { display: true, position: "right" },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw as number}%`
            },
          },
        },
      },
    }, "propertyOwnerChart");

    return () => {
      Object.values(chartInstancesRef.current).forEach((chart) => chart.destroy());
    };
  }, [demographData]);

  return (
    <div className="flex flex-wrap justify-center gap-48 bg-[#ECFCF8] text-black">
      <div className="w-full flex justify-center items-center">
        <h1 className="text-6xl font-thin font-openSans text-center pt-12">Demographic Analysis</h1>
      </div>
      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4 px-4">
        <h2 className="text-xl font-bold">Race - Bar Chart</h2>
        <canvas ref={refs.race}></canvas>
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">Sex - Stacked Ratio</h2>
        <canvas ref={refs.sex}></canvas>
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">Age - Bell Curve (Line Chart)</h2>
        <canvas ref={refs.age}></canvas>
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">Political Affiliation - Pie Chart</h2>
        <canvas ref={refs.political}></canvas>
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">Children - Pie Chart</h2>
        <canvas ref={refs.children}></canvas>
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">Income - Bar Chart</h2>
        <canvas ref={refs.income}></canvas>
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">Marital Status - Pie Chart</h2>
        <canvas ref={refs.maritalStatus}></canvas>
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">Religion - Bar Chart</h2>
        <canvas ref={refs.religion}></canvas>
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">Industry - Horizontal Bar Chart</h2>
        <canvas ref={refs.industry}></canvas>
      </div>

      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">Ownership - Stacked Ratio</h2>
        <canvas ref={refs.propertyOwner}></canvas>
      </div>
    </div>
  );
}