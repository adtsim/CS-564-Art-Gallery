// apiService.js
// This service module handles all API interactions for the Art Gallery application,
// encapsulating the logic needed to fetch data from the Rijksmuseum API.

import axios from "axios";

const API_URL = "https://www.rijksmuseum.nl/api/en/collection";
const apiKey = "KntueOG1";



export const fetchArtworksByMaker = async (maker) => {
  try {
    const response = await axios.get(
      `${API_URL}?key=${apiKey}&q=${encodeURIComponent(maker)}&ps=100`
    );
    return response.data.artObjects;
  } catch (error) {
    console.error("Error fetching artworks by maker: ", error);
    return [];
  }
};

export const getPieceById = async (id) => {
  //const url = `${API_URL}/${objectNumber}?key=${apiKey}`;
  const url =  `${API_URL}/${id}?key=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data.artObject;
  } catch (error) {
    console.error("Error fetching artwork by ID:", error);
    return null; // Return null on error
  }
};

const apiService = {

  getPieceById,
  fetchArtworksByMaker,
};

export default apiService;
