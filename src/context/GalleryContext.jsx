// GalleryContext.jsx
// This module defines the context for the Art Gallery application, managing global state that includes
// data about artworks, loading states, and user-selected filters for the art types and periods.

import React, { createContext, useState, useCallback, useEffect } from "react";
import apiService from "../services/apiService";

// Creating a context object for sharing state across the Art Gallery application
export const GalleryContext = createContext();

// This component provides the context to its child components, making data and state management functions available throughout the application.
export const GalleryProvider = ({ children }) => {
  // State to store artwork data
  const [data, setData] = useState({});
  // State to manage the loading status during data fetching
  const [loading, setLoading] = useState(false);
  // State to store user-selected filters for type and period of artworks
  const [selection, setSelection] = useState({
    type: "painting",
    period: "17",
  });
  const [centuryData, setCenturyData] = useState({
    "17th Century": 0,
    "18th Century": 0,
    "19th Century": 0,
  });
  // Utility function to log state changes - used for debugging and ensuring state integrity
  const logState = (message, state) => {
    console.log(`${message}: `, state);
  };

  // Fetch data based on the current selection of type and period
  const fetchData = useCallback(() => {
    logState("Fetching data with selection", selection);
    setLoading(true);
    apiService
      .fetchData(selection.type, selection.period)
      .then((data) => {
        setData(data);
        setLoading(false);
        logState("Data fetched successfully", data);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      })
      .finally(() => {
        // Assume additional processing here
        setLoading(false); // Only set this after all processing is complete
        logState("Data fetching and processing complete");
      });
  }, [selection]);

  const fetchCenturyData = useCallback(async (type, period) => {
    setLoading(true);
    try {
      const fetchedCenturyData = await apiService.fetchArtworksByTypeAndPeriod(
        type,
        period
      );
      setCenturyData(fetchedCenturyData);
    } catch (error) {
      console.error("Error in fetchCenturyData:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to update the selection based on user input, triggering a re-fetch of data
  const updateSelection = (newSelection) => {
    logState("Updating selection from", selection);
    logState("Updating selection to", { ...selection, ...newSelection });
    setSelection((prev) => ({ ...prev, ...newSelection }));
  };

  // The context provider wraps its children with the provided state and functions
  return (
    <GalleryContext.Provider
      value={{
        data,
        centuryData,
        loading,
        updateSelection,
        fetchCenturyData,
        fetchData,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export default GalleryProvider;
