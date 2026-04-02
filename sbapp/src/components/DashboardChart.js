import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./DashboardChart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DashboardChart({ labels, data }) {

  const chartData = {
    labels: labels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Bookings",
        data: data || [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(201,168,76,0.12)",
        borderColor: "#c9a84c",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: "rgba(201,168,76,0.22)",
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "#1a1a1a",
        borderColor: "rgba(201,168,76,0.2)",
        borderWidth: 1,
        titleColor: "#c9a84c",
        bodyColor: "#8a7d6a",
        padding: 12,
        callbacks: {
          label: (ctx) => `  ${ctx.parsed.y} booking${ctx.parsed.y !== 1 ? "s" : ""}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.03)" },
        ticks: { color: "#4a4035", font: { family: "Outfit", size: 12 } },
        border: { color: "rgba(255,255,255,0.04)" }
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: {
          color: "#4a4035",
          stepSize: 1,
          precision: 0,
          font: { family: "Outfit", size: 11 }
        },
        border: { color: "rgba(255,255,255,0.04)" }
      }
    }
  };

  return (
    <div className="dc-wrap">
      <div className="dc-header">
        <div>
          <p className="dc-eyebrow">Analytics</p>
          <h3 className="dc-title">Booking <em>Overview</em></h3>
        </div>
        <div className="dc-legend">
          <span className="dc-legend-dot" />
          <span className="dc-legend-label">Monthly Bookings</span>
        </div>
      </div>
      <div className="dc-chart-wrap">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default DashboardChart;
