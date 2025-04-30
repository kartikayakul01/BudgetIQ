import React from 'react';
import { Doughnut } from 'react-chartjs-2'; // Use Doughnut instead of Pie
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaBeer, FaShoppingCart, FaCar, FaHome, FaUtensils, FaLaptop, FaHeart } from 'react-icons/fa'; // Import icons

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Function to generate a random color
const generateRandomColor = () => {
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  return randomColor;
};

const DoughnutChart = ({ data }) => {
  // Step 1: Normalize category names and aggregate amounts
  const normalizedData = data.reduce((acc, expense) => {
    const category = expense.category.toLowerCase(); // Normalize to lowercase
    if (acc[category]) {
      acc[category] += expense.amount; // Aggregate the amounts
    } else {
      acc[category] = expense.amount;
    }
    return acc;
  }, {});

  // Convert the aggregated data back to an array for charting
  const aggregatedData = Object.keys(normalizedData).map(category => ({
    category,
    amount: normalizedData[category],
  }));

  // Step 2: Generate random colors for each category
  const backgroundColors = aggregatedData.map(() => generateRandomColor());

  // Step 3: Prepare the data for the doughnut chart
  const chartData = {
    labels: aggregatedData.map(expense => expense.category),
    datasets: [
      {
        data: aggregatedData.map(expense => expense.amount),
        backgroundColor: backgroundColors,  // Use the generated random colors
        hoverOffset: 4,
      },
    ],
  };

  // Icons to be displayed for each category (you can modify this list later)
  const icons = [
    <FaBeer />,
    <FaShoppingCart />,
    <FaCar />,
    <FaHome />,
    <FaUtensils />,
    <FaLaptop />,
    <FaHeart />,
  ];

  // Step 4: Chart options to control size and responsiveness
  const chartOptions = {
    responsive: true,  // Make chart responsive
    maintainAspectRatio: false,  // Allow the chart to adjust its aspect ratio based on container size
    plugins: {
      legend: {
        position: 'bottom',  // Position of the legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label;
            const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1); // Capitalize first letter
            return `${capitalizedLabel}: $${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Expense Category Distribution</h3>
      
      {/* Doughnut Chart */}
      <div className="relative h-72 w-full">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default DoughnutChart;
