import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Helper to aggregate data by date
const aggregateByDate = (data, range) => {
    const formatMap = {
      weekly: 'dddd',      // e.g., Monday
      monthly: 'DD MMM',   // e.g., 02 Apr
      yearly: 'MMM YYYY',  // e.g., Apr 2025
    };
    const format = formatMap[range];
  
    const now = dayjs();
    let filteredData = data;
  
    if (range === 'weekly') {
      const weekAgo = now.subtract(6, 'day').startOf('day'); // 7 days including today
      filteredData = data.filter(item => {
        const date = dayjs(item.date);
        return date.isAfter(weekAgo) || date.isSame(weekAgo, 'day');
      });
    }
  
    const grouped = {};
  
    filteredData.forEach((item) => {
      const key = dayjs(item.date).format(format);
      grouped[key] = (grouped[key] || 0) + item.amount;
    });
  
    return {
      labels: Object.keys(grouped),
      amounts: Object.values(grouped),
    };
  };

const BarChart = ({ data }) => {
  const [range, setRange] = useState('weekly');

  const { labels, amounts } = aggregateByDate(data, range);
// Helper: generate random hex color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Generate color for each bar
  const barColors = amounts.map(() => getRandomColor());
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: amounts,
        backgroundColor: barColors, // use random colors
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        {['weekly', 'monthly', 'yearly'].map((option) => (
          <button
            key={option}
            onClick={() => setRange(option)}
            className={`px-3 py-1 rounded-md ${
              range === option ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      <div className="h-72">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BarChart;
