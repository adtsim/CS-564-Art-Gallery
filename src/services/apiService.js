// apiService.js
// This service module handles all API interactions for the Art Gallery application,
// encapsulating the logic needed to fetch data from the Rijksmuseum API.

import axios from "axios";
const apiKey = process.env.VITE_APP_APOD_API_KEY;

const API_URL = "https://www.rijksmuseum.nl/api/en/collection";

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

//Fetches a list of artists based on the specified type and period. This function handles constructing the API URL and parsing the response.
const fetchArtists = async (type = "painting", period = "17") => {
  let url = `${API_URL}?key=${apiKey}&type=${type}&ps=100&imgonly=true`;
  if (period) {
    url += `&f.dating.period=${period}`;
  }
  try {
    const response = await axios.get(url);
    const artists = new Set();
    response.data.artObjects.forEach((artObject) => {
      if (artObject.principalOrFirstMaker) {
        artists.add(artObject.principalOrFirstMaker);
      }
    });
    return Array.from(artists).slice(0, 20);
  } catch (error) {
    console.error("Error fetching painting artists:", error);
    return [];
  }
};

// Fetches detailed count data for each artist. This involves querying the API for each artist and collating the results.
const fetchData = async (type = "painting", period = "17") => {
  const artists = await fetchArtists(type, period);
  let artistCounts = {};
  let delay = 100;

  for (let artist of artists) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    let url = `${API_URL}?key=${apiKey}&involvedMaker=${encodeURIComponent(
      artist
    )}&type=${type}&ps=100&imgonly=true&f.dating.period=${period}`;
    if (period) {
      console.log("Period specified", period);
      url += `&f.dating.period=${period}`;
    }

    try {
      const response = await axios.get(url);
      artistCounts[artist] = response.data.count;
      console.log("Name of the artist", artistCounts[artist], artist);
      console.log("No of artists", response.data.count);
      delay = 100;
    } catch (error) {
      console.error("Error fetching data for artist:", artist, error);
      delay += 500;
    }
  }

  console.log("Total artist count fetched", artistCounts);
  return artistCounts;
};

const fetchGalleryArtist = async (artistName) => {
  const url = `${API_URL}?key=${apiKey}&toppieces=true&involvedMaker=${encodeURIComponent(
    artistName
  )}&ps=100&imgonly=true`;
  try {
    const response = await axios.get(url);
    // Filter to ensure artworks are only by the specified artist
    const validArtworks = response.data.artObjects.filter(
      (obj) => obj.principalOrFirstMaker === artistName
    );
    if (validArtworks.length > 0) {
      // Optionally sort by some criteria to choose the "top" piece
      validArtworks.sort((a, b) => b.someMetric - a.someMetric);
      const topArtwork = validArtworks[0];
      return [
        {
          artist: topArtwork.principalOrFirstMaker,
          title: topArtwork.title,
          image: topArtwork.webImage.url, // Make sure 'webImage' and 'url' are the correct keys
        },
      ];
    }
    return [];
  } catch (error) {
    console.error(`Error fetching top pieces for artist: ${artistName}`, error);
    return [];
  }
};

const fetchArtworksByTypeAndPeriod = async (type = "painting") => {
  const centuryData = {
    "17th Century": [],
    "18th Century": [],
    "19th Century": [],
  };

  const centuries = ["17", "18", "19"]; // Correspond to f.dating.period values

  for (let century of centuries) {
    let artistData = {};
    let totalArtworks = 0; // Total artworks in the century
    const artists = await fetchArtists(type, century);

    // Fetch artworks count for each artist
    for (let artist of artists) {
      let countUrl = `${API_URL}?key=${apiKey}&involvedMaker=${encodeURIComponent(
        artist
      )}&type=${type}&ps=1&imgonly=true&f.dating.period=${century}`;
      try {
        const countResponse = await axios.get(countUrl);
        const artworkCount = countResponse.data.count;
        if (artworkCount > 0) {
          artistData[artist] = artworkCount;
          totalArtworks += artworkCount;
        }
        console.log("Artwork count", countResponse, artworkCount);
        console.log("Name of the artist and Period", artist, century);
      } catch (error) {
        console.error("Error fetching count for artist:", artist, error);
      }
    }

    // Calculate percentage contribution of each artist
    const sortedContributions = Object.keys(artistData)
      .map((artist) => ({
        name: artist,
        count: artistData[artist],
        percentage: ((artistData[artist] / totalArtworks) * 100).toFixed(2), // Format as a percentage
      }))
      .sort((a, b) => b.percentage - a.percentage) // Sort by percentage in descending order
      .slice(0, 3); // Take the top 3 artists

    const centuryKey = `${century}th Century`;
    centuryData[centuryKey] = sortedContributions;
  }

  return centuryData;
};

const fetchGallery = async (artists) => {
  let allTopPieces = [];
  for (let artistName of artists) {
    console.log("Artist being processed:", artistName);
    const topPieces = await fetchGalleryArtist(artistName);
    allTopPieces = [...allTopPieces, ...topPieces];
  }
  return allTopPieces;
};
export const getPieceById = async (id) => {
  const url = `${API_URL}/${id}?key=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data.artObject;
  } catch (error) {
    console.error("Error fetching artwork by ID:", error);
    return null; // Return null on error
  }
};

export const fetchCollections = async () => {
  try {
    // Request a single page of 100 painting items from the Rijksmuseum API
    const response = await axios.get(`${API_URL}`, {
      params: {
        key: apiKey,
        ps: 100, // Only fetch 100 items
        p: 1, // Fetch the first page
        type: "painting", // Only paintings
      },
    });

    // Check if the response has art objects and return them, otherwise return an empty array
    return response.data && response.data.artObjects
      ? response.data.artObjects
      : [];
  } catch (error) {
    console.error("Error fetching collections: ", error);
    return []; // Return an empty array on error to ensure downstream processing doesn't fail
  }
};

export const fetchArtworkCountsByMaterialAndCentury = async (
  material,
  century
) => {
  const url = `${API_URL}?key=${apiKey}&material=${material}&f.dating.period=${century}&format=json`;
  try {
    const response = await axios.get(url);
    return response.data.count;
  } catch (error) {
    console.error("Error fetching artwork counts:", error);
    return 0; // Return 0 in case of an error
  }
};

const apiService = {
  getPieceById,
  fetchArtworksByMaker,
  fetchArtists,
  fetchData,
  fetchGallery,
  fetchArtworksByTypeAndPeriod,
  fetchCollections,
  fetchArtworkCountsByMaterialAndCentury,
};

export default apiService;
