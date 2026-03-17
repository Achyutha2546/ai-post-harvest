import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TrendChart({ chartData }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: {
            family: "'Inter', sans-serif",
            weight: 600
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: { family: "'Inter', sans-serif" },
          color: '#94a3b8'
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { family: "'Inter', sans-serif" },
          color: '#94a3b8'
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Actual Price',
        data: chartData.prices,
        borderColor: '#6366f1', // indigo-500
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderWidth: 3,
        pointBackgroundColor: '#1e293b',
        pointBorderColor: '#6366f1',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Moving Average (Trend)',
        data: chartData.ma,
        borderColor: '#a855f7', // purple-500
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/5 hover:border-white/10 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white drop-shadow-sm">Price Trend Analysis</h3>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
          <span className="text-sm font-medium text-slate-300">Actual</span>
          <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] ml-3"></span>
          <span className="text-sm font-medium text-slate-300">MA</span>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
