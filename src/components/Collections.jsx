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

  useEffect(() => {
    const getCollections = async () => {
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
    color: "black",
    padding: "8px",
    display: "block",
    borderRadius: "5px",
    transition: "background-color 0.3s, color 0.3s",
  };

  const hoverStyle = {
    ...linkStyle,
    backgroundColor: "#f0f0f0",
    color: "#505050",
  };

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
        <h1>Artists</h1>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {Object.keys(makersData).map((maker, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <Link
                to={`/collection-details/${encodeURIComponent(maker)}`}
                style={linkStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
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
        <Bar data={data} options={{ scales: { y: { beginAtZero: true } } }} />
      </div>
    </div>
  );
}

export default Collections;
