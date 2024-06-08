// BarGraph.jsx
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "../styles/BarGraph.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarGraphContainer = ({ sortedAndFilteredArtists, data, period }) => {
  // Prepare data for rendering in the Bar chart
  const chartData = useMemo(
    () => ({
      labels: sortedAndFilteredArtists,
      datasets: [
        {
          label: "Number of Artworks",
          data: sortedAndFilteredArtists.map((artist) => data[artist]),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    }),
    [sortedAndFilteredArtists, data]
  );

  // Define chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(...Object.values(data)) + 10,
          suggestedMin: 0,
          ticks: {
            color: "#ffffff", // Ensure this is visible against the chart's background
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)", // Light white grid lines
            borderColor: "#ffffff", // Visible white border
            borderWidth: 2,
          },
        },
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)", // Same as y-axis for consistency
            borderColor: "#ffffff", // White border for the x-axis
            borderWidth: 2,
          },
          ticks: {
            color: "#ffffff", // White text for x-axis labels
            font: {
              size: 14, // Adjust the font size as necessary
            },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff", // Ensures legend labels are visible
          },
        },
      },
      layout: {
        padding: {
          left: 35, // Adds padding on the left
          right: 35, // Adds padding on the right
        },
      },
    }),
    [data]
  );
  const century = `${period}th Century`;
  return (
    <div className="">
      <h1 className="pie-chart-title">
        Artists and their artwork of the {century}
      </h1>
      <div className="analyze-container">
        <Bar
          data={chartData}
          options={chartOptions}
          style={{ position: "absolute" }}
        />
      </div>
    </div>
  );
};

export default BarGraphContainer;
