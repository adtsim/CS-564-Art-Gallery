import React, { createContext, useState, useEffect } from "react";
import apiService from "../services/apiService";

export const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [data, setData] = useState({});

  const fetchData = async () => {
    const artistData = await apiService.fetchData();
    console.log(artistData);
    setData(artistData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <GalleryContext.Provider value={{ data, fetchData }}>
      {children}
    </GalleryContext.Provider>
  );
};
