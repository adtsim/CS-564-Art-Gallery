// Analyze.jsx
// This module is responsible for rendering the data visualization component of the Art Gallery application.
// It uses the GalleryContext for accessing shared data and handling user interactions to fetch new data based on selected criteria.

import React, { useContext, useMemo, useState, useEffect } from "react";
import { GalleryContext } from "../context/GalleryContext";
import { Bar } from "react-chartjs-2";
import "../styles/AnalyzeStyles.css";
import ArtworkPieChart from "./ArtworkPieChart.jsx";
import GalleryCard from "./Gallery.jsx";
import ArtistBiographyCards from "./ArtistBiographyCards.jsx";
import BarGraphContainer from "./BarGraph.jsx";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale,

  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// The Analyze component visualizes the number of artworks by different artists using a bar chart.
const Analyze = () => {
  // Using GalleryContext to access and manipulate the global state
  const {
    data,

    loading,
    updateSelection,
    fetchCenturyData,
    fetchData,
  } = useContext(GalleryContext);

  const [view, setView] = useState("bargraph");
  const [type, setType] = useState("painting"); // State to track selected type
  const [period, setPeriod] = useState("17"); // State to track selected period

  useEffect(() => {
    // Only fetch century data when the view is 'piechart'
    if (view === "piechart" || view === "biography") {
      fetchCenturyData(type, period);
    } else {
      fetchData(); // Only fetch data for views other than 'piechart'
    }
  }, [view, type, fetchCenturyData, period, fetchData]); // Make sure to include fetchCenturyData in the dependency array

  //const [topPiecesData, setTopPiecesData] = useState([]);

  // Handle change events on input elements, triggering data refetching
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSelection({ [name]: value });
    if (name === "type") setType(value);
    if (name === "period") setPeriod(value);
  };

  const handleViewChange = (e) => {
    setView(e.target.value);
  };
  // This useMemo will calculate sorted and filtered list of artists based on the fetched data
  const sortedAndFilteredArtists = useMemo(() => {
    // First, sort artists by the number of artworks
    const sortedArtists = Object.keys(data).sort((a, b) => data[b] - data[a]);
    // Filter out artists with zero artworks
    const nonZeroArtists = sortedArtists.filter((artist) => data[artist] > 0);
    // Return top 10 artists for display
    return nonZeroArtists.slice(0, 10);
  }, [data]);

  // Render the component with conditionally displayed content based on loading state
  return (
    <div className="analyze-container">
      <label htmlFor="type">Type:</label>
      <select
        id="type"
        className="select-input"
        name="type"
        onChange={handleChange}
      >
        <option value="painting">Paintings</option>
        <option value="drawing">Drawings</option>
        <option value="sculpture">Sculptures</option>
      </select>

      <label htmlFor="period">Period:</label>
      <select
        id="period"
        className="select-input"
        name="period"
        onChange={handleChange}
        disabled={view === "piechart" || view === "biography"}
      >
        <option value="17">17th Century</option>
        <option value="18">18th Century</option>
        <option value="19">19th Century</option>
      </select>

      <label htmlFor="view">View:</label>
      <select
        id="view"
        className="select-input"
        name="view"
        onChange={handleViewChange}
      >
        <option value="bargraph">Bar Graph</option>
        <option value="gallery">Gallery</option>
        <option value="piechart">Pie Chart</option>
        <option value="biography">Biography</option>
      </select>
      {loading ? (
        <div className="loading-container_analyze">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
          <div className="mt-3">Please wait, data is being fetched.</div>
        </div>
      ) : view === "bargraph" ? (
        <BarGraphContainer
          sortedAndFilteredArtists={sortedAndFilteredArtists}
          data={data}
          period={period}
          style={{ position: "absolute" }}
        />
      ) : view === "gallery" ? (
        <GalleryCard artists={sortedAndFilteredArtists} period={period} />
      ) : view === "piechart" ? (
        <ArtworkPieChart />
      ) : view === "biography" ? (
        <ArtistBiographyCards
          artists={sortedAndFilteredArtists}
          period={period}
        />
      ) : null}
    </div>
  );
};

export default Analyze;
