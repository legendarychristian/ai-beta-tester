"use client";
import { useEffect, useRef } from "react";
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
import { demograph_data } from "./Hero"; // Import demograph_data

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
  const refs = {
    race: useRef<HTMLCanvasElement | null>(null),
    sex: useRef<HTMLCanvasElement | null>(null),
    age: useRef<HTMLCanvasElement | null>(null),
    political: useRef<HTMLCanvasElement | null>(null),
    children: useRef<HTMLCanvasElement | null>(null),
    income: useRef<HTMLCanvasElement | null>(null),
    maritalStatus: useRef<HTMLCanvasElement | null>(null),
    religion: useRef<HTMLCanvasElement | null>(null),
    industry: useRef<HTMLCanvasElement | null>(null),
    propertyOwner: useRef<HTMLCanvasElement | null>(null),
  };

  const chartInstancesRef = useRef<Record<string, Chart>>({});

  const createChart = (ref: React.RefObject<HTMLCanvasElement>, config: ChartConfiguration, key: string) => {
    if (chartInstancesRef.current[key]) {
      chartInstancesRef.current[key].destroy();
    }

    const canvas = ref.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const newChart = new Chart(ctx, config);
        chartInstancesRef.current[key] = newChart;
      }
    }
  };

  useEffect(() => {
    const data = demograph_data; // Use demograph_data directly

    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"];

    createChart(refs.race, {
      type: "bar",
      data: {
        labels: Object.keys(data.race.percentages),
        datasets: [{
          label: "Race Percentages",
          data: Object.values(data.race.percentages),
          backgroundColor: colors,
        }],
      },
      options: {
        responsive: true,
        layout: { padding: { left: 20, right: 20 } },
        scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
        plugins: { legend: { display: false } },
      },
    }, "raceChart");

    createChart(refs.sex, {
      type: "bar",
      data: {
        labels: ["Gender"],
        datasets: Object.entries(data.sex.percentages).map(([label, value], index) => ({
          label,
          data: [value],
          backgroundColor: colors[index],
        })),
      },
      options: {
        indexAxis: "y",
        responsive: true,
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
            callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}%` },
          },
        },
      },
    }, "sexChart");

    createChart(refs.age, {
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
        }],
      },
      options: {
        responsive: true,
        layout: { padding: { left: 20, right: 20 } },
        scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
      },
    }, "ageChart");

    createChart(refs.political, {
      type: "pie",
      data: {
        labels: Object.keys(data.political_affiliation.percentages),
        datasets: [{
          data: Object.values(data.political_affiliation.percentages),
          backgroundColor: colors,
        }],
      },
      options: { responsive: true },
    }, "politicalChart");

    createChart(refs.children, {
      type: "pie",
      data: {
        labels: Object.keys(data.children.percentages),
        datasets: [{
          data: Object.values(data.children.percentages),
          backgroundColor: colors.slice(0, 2),
        }],
      },
      options: { responsive: true },
    }, "childrenChart");

    createChart(refs.income, {
      type: "bar",
      data: {
        labels: Object.keys(data.income.raw_counts),
        datasets: [{
          label: "Income Distribution",
          data: Object.values(data.income.raw_counts),
          backgroundColor: colors,
        }],
      },
      options: {
        responsive: true,
        layout: { padding: { left: 20, right: 20 } },
        scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
        plugins: { legend: { display: false } },
      },
    }, "incomeChart");

    createChart(refs.maritalStatus, {
      type: "pie",
      data: {
        labels: Object.keys(data.marital_status.percentages),
        datasets: [{
          data: Object.values(data.marital_status.percentages),
          backgroundColor: colors.slice(0, 4),
        }],
      },
      options: { responsive: true },
    }, "maritalStatusChart");

    createChart(refs.religion, {
      type: "bar",
      data: {
        labels: Object.keys(data.religion.raw_counts),
        datasets: [{
          label: "Religion Distribution",
          data: Object.values(data.religion.raw_counts),
          backgroundColor: colors,
        }],
      },
      options: {
        responsive: true,
        layout: { padding: { left: 20, right: 20 } },
        scales: { y: { beginAtZero: true, ticks: { padding: 10 } } },
        plugins: { legend: { display: false } },
      },
    }, "religionChart");

    createChart(refs.industry, {
      type: "bar",
      data: {
        labels: Object.keys(data.industry.raw_counts),
        datasets: [{
          label: "Industry Distribution",
          data: Object.values(data.industry.raw_counts),
          backgroundColor: colors,
        }],
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
      },
    }, "industryChart");

    createChart(refs.propertyOwner, {
      type: "bar",
      data: {
        labels: ["Property Ownership"],
        datasets: Object.entries(data.property_owner.percentages).map(([label, value], index) => ({
          label,
          data: [value],
          backgroundColor: colors[index],
        })),
      },
      options: {
        indexAxis: "y",
        responsive: true,
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
          tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}%` } },
        },
      },
    }, "propertyOwnerChart");

    return () => {
      Object.values(chartInstancesRef.current).forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-10 py-10">
      <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
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
        <h2 className="text-xl font-bold">Property Ownership - Stacked Ratio</h2>
        <canvas ref={refs.propertyOwner}></canvas>
      </div>
    </div>
  );
}
