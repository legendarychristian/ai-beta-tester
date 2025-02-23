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

    // Marital Status Chart
    createChart(refs.children.current, {
      type: "pie" as const,
      data: {
        labels: Object.keys(data.children.percentages),
        datasets: [{
          data: Object.values(data.children.percentages).map(value => ensureNumber(value)),
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
    <div className="w-full p-8 bg-transparent">
      <h1 className="text-4xl font-openSans font-thin text-center mb-12">Demographic Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Race */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg flex flex-col bg-[#E8F8FF]">
          <h2 className="text-xl font-openSans font-thin mb-4 text-center">Race</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <canvas ref={refs.race} />
            </div>
          </div>
        </div>

        {/* Sex */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg flex flex-col bg-[#E8F8FF]">
          <h2 className="text-xl font-openSans font-thin mb-4 text-center">Sex</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <canvas ref={refs.sex} />
            </div>
          </div>
        </div>

        {/* Age */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg flex flex-col bg-[#E8F8FF]">
          <h2 className="text-xl font-openSans font-thin mb-4 text-center">Age</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <canvas ref={refs.age} />
            </div>
          </div>
        </div>

        {/* Political */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg flex flex-col bg-[#E8F8FF]">
          <h2 className="text-xl font-openSans font-thin mb-4 text-center">Political Affiliation</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <canvas ref={refs.political} />
            </div>
          </div>
        </div>

        {/* Income */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg flex flex-col bg-[#E8F8FF]">
          <h2 className="text-xl font-openSans font-thin mb-4 text-center">Income</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <canvas ref={refs.income} />
            </div>
          </div>
        </div>

        {/* Marital Status */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg flex flex-col bg-[#E8F8FF]">
          <h2 className="text-xl font-openSans font-thin mb-4 text-center">Marital Status</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <canvas ref={refs.maritalStatus} />
            </div>
          </div>
        </div>

        {/* Religion */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg flex flex-col bg-[#E8F8FF]">
          <h2 className="text-xl font-openSans font-thin mb-4 text-center">Religion</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <canvas ref={refs.religion} />
            </div>
          </div>
        </div>

        {/* Industry */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg flex flex-col bg-[#E8F8FF]">
          <h2 className="text-xl font-openSans font-thin mb-4 text-center">Industry</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <canvas ref={refs.industry} />
            </div>
          </div>
        </div>

        {/* Property Owner */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg flex flex-col bg-[#E8F8FF]">
          <h2 className="text-xl font-openSans font-thin mb-4 text-center">Property Ownership</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <canvas ref={refs.propertyOwner} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}