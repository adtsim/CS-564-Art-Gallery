import { useEffect, useState } from "react";
import { fetchArtworkCountsByMaterialAndCentury } from "../services/apiService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ArtworkComparison() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const materials = ["chalk", "ink", "pencil"];
    const centuries = { 18: 1700, 19: 1800, 20: 1900, 21: 2000 };
    const loadData = async () => {
      const dataForChart = [];

      for (const material of materials) {
        const countsByCentury = {};
        for (const [century] of Object.entries(centuries)) {
          countsByCentury[century] =
            await fetchArtworkCountsByMaterialAndCentury(material, century);
        }
        dataForChart.push({
          material,
          "18th Century": countsByCentury[18],
          "19th Century": countsByCentury[19],
          "20th Century": countsByCentury[20],
          "21st Century": countsByCentury[21],
        });
      }

      setData(dataForChart);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>
          {`
            .spinner {
              border: 4px solid rgba(0, 0, 0, 0.1);
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border-left-color: #09f;
              animation: spin 1s ease infinite;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h1>Artwork Comparison Across Centuries</h1>
      <p>
        Comparing the number of chalk, ink, and pencil art made across the 18th,
        19th, 20th, and 21st centuries.
      </p>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="material" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="18th Century" fill="#f384d8" />
          <Bar dataKey="19th Century" fill="#8884d8" />
          <Bar dataKey="20th Century" fill="#82ca9d" />
          <Bar dataKey="21st Century" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ArtworkComparison;
