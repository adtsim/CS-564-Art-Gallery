// This component is responsible for rendering a pie chart based on the artwork types and centuries.

import React, { useContext, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { GalleryContext } from "../context/GalleryContext";
import "../styles/ArtworkPieChartStyles.css";

ChartJS.register(Tooltip, Legend, ArcElement);

const ArtworkPieChart = () => {
  const { centuryData, loading } = useContext(GalleryContext);

  const pieChartData = useMemo(() => {
    if (!centuryData || Object.keys(centuryData).length === 0) {
      return {
        labels: [],
        datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }],
      };
    }

    const labels = [];
    const data = [];
    const backgroundColors = ["#FF6384", "#36A2EB", "#FFCE56"];
    const hoverBackgroundColors = [
      "#FF375F", // Brighter or darker shade for hover state of pink
      "#318CE7", // Brighter or darker shade for hover state of blue
      "#FFD700", // Brighter or darker shade for hover state of yellow
    ];
    const detailedData = {};

    Object.entries(centuryData).forEach(([century, artists]) => {
      if (Array.isArray(artists)) {
        const totalArtworks = artists.reduce(
          (acc, artist) => acc + artist.count,
          0
        );
        labels.push(`${century}`);
        data.push(totalArtworks);
        detailedData[century] = artists
          .map((artist) => `${artist.name}: ${artist.count} artworks`)
          .join(", ");
      }
    });

    return {
      labels: labels,
      datasets: [
        {
          label: "Artwork Distribution by Century",
          data: data,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverBackgroundColors,
        },
      ],
      detailedData: detailedData,
    };
  }, [centuryData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Changes the color of the legend labels to white
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: function (tooltipItem) {
            return centuryData[tooltipItem.label]
              ? centuryData[tooltipItem.label].map(
                  (artist) => `${artist.name}: ${artist.count} artworks`
                )
              : [];
          },
        },
      },
    },
  };
  if (loading) {
    return (
      <div className="loading-container-analyze">
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
        <div className="mt-3">Please wait, data is being fetched.</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h1 className="pie-chart-title">
        Top 3 Artists of the 17th, 18th, and 19th Centuries: A Legacy of
        Artworks.
      </h1>
      <div style={{ width: "100%", maxWidth: "60%" }}>
        <Pie
          style={{ position: "absolute" }}
          data={pieChartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default ArtworkPieChart;
