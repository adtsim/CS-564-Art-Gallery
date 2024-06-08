import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCollections } from "../services/apiService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Collections() {
  const [makersData, setMakersData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCollections = async () => {
      try {
        const allCollections = await fetchCollections();
        const makersCount = {};
        allCollections.forEach((collection) => {
          const maker = collection.principalOrFirstMaker;
          if (maker) {
            if (!makersCount[maker]) {
              makersCount[maker] = 0;
            }
            makersCount[maker] += 1;
          }
        });
        setMakersData(makersCount);
      } catch (err) {
        setError("Failed to load collections.");
      }
    };
    getCollections();
  }, []);

  const data = {
    labels: Object.keys(makersData),
    datasets: [
      {
        label: "Number of Artworks",
        data: Object.values(makersData),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // Inline CSS for hover effects
  const linkStyle = {
    textDecoration: "none",
    color: "white",
    padding: "8px",
    display: "block",
    borderRadius: "5px",
    transition: "background-color 0.3s, color 0.3s",
  };

  const hoverStyle = {
    ...linkStyle,
    backgroundColor: "#2c3e50",
    color: "#505050",
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ffffff", // White color for y-axis labels
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Light white grid lines
          borderColor: "#ffffff", // White border
          borderWidth: 2,
        },
      },
      x: {
        ticks: {
          color: "#ffffff", // White color for x-axis labels
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Light white grid lines
          borderColor: "#ffffff", // White border
          borderWidth: 2,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff", // White color for legend labels
        },
      },
    },
  };

  if (error) {
    return <div style={{ color: "white" }}>{error}</div>;
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        alignItems: "flex-start", // Align items at the top
      }}
    >
      <div style={{ width: "40%", overflowY: "auto", maxHeight: "400px" }}>
        <h1 style={{ color: "white" }}>Artists</h1>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {Object.keys(makersData).map((maker, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <Link
                to={`/collection-details/${encodeURIComponent(maker)}`}
                aria-label={`View details for collection by ${maker}`}
                style={linkStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    hoverStyle.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {maker}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: "55%" }}>
        <Bar data={data} options={chartOptions} />
      </div>
    </div>
  );
}

export default Collections;
