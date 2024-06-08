import React, { useContext, useState, useEffect } from "react";
import { GalleryContext } from "../context/GalleryContext";
import "../styles/ArtistBiographyCardsStyles.css";
import axios from "axios";

const ArtistBiographyCards = ({ artists, period }) => {
  const { centuryData, loading: globalLoading } = useContext(GalleryContext);
  const [artistsInfo, setArtistsInfo] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  useEffect(() => {
    async function fetchArtistInfo() {
      setLocalLoading(true); // Start loading
      const info = [];
      try {
        for (const century of Object.keys(centuryData)) {
          const artists = centuryData[century];
          if (Array.isArray(artists)) {
            for (const artist of artists) {
              try {
                console.log(`Fetching Wikipedia data for ${artist.name}`);
                // Wikipedia API search to get the page title
                const searchResponse = await axios.get(
                  `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
                    artist.name
                  )}&format=json&origin=*`
                );
                const searchResults = searchResponse.data.query.search;
                if (searchResults.length > 0) {
                  const pageTitle = searchResults[0].title;
                  console.log(`Found Wikipedia page: ${pageTitle}`);
                  // Wikipedia API to fetch the artist's summary
                  const artistResponse = await axios.get(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
                      pageTitle
                    )}`
                  );
                  const artistData = artistResponse.data;
                  console.log(
                    `Fetched Wikipedia summary for ${artist.name}:`,
                    artistData
                  );
                  info.push({
                    name: artist.name,
                    count: artist.count,
                    bio: artistData.extract,
                    imageUrl: artistData.thumbnail
                      ? artistData.thumbnail.source
                      : "",
                  });
                } else {
                  console.log(`No Wikipedia page found for ${artist.name}`);
                  info.push({
                    name: artist.name,
                    count: artist.count,
                    bio: "Biography not available.",
                    imageUrl: "",
                  });
                }
              } catch (error) {
                console.error("Error fetching artist details:", error);
                info.push({
                  name: artist.name,
                  count: artist.count,
                  bio: "Biography not available.",
                  imageUrl: "",
                });
              }
            }
          }
        }
        setArtistsInfo(info);
      } catch (error) {
        console.error("Error fetching artist info:", error);
      } finally {
        setLocalLoading(false);
      }
    }
    fetchArtistInfo();
  }, [centuryData]);

  if (globalLoading || localLoading) {
    // Check the loading state
    return (
      <div className="loading-container_analyze">
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
        <div className="mt-3">Please wait, data is being fetched.</div>
      </div>
    );
  }
  const century = `${period}th Century`;

  return (
    <div>
      <h1 className="biography-title">
        Biographies of Renowned Artists from {century}
      </h1>
      <div className="artist-bio-container">
        {artistsInfo.map((artist, index) => (
          <div key={index} className="artist-bio-card">
            {artist.imageUrl ? (
              <img
                src={artist.imageUrl || "path/to/placeholder/image.jpg"} // Placeholder image
                alt={`Portrait of ${artist.name}`}
                className="artist-bio-image"
              />
            ) : (
              <div className="artist-bio-image-placeholder">
                No Image Available
              </div>
            )}
            <div className="artist-bio-info">
              <h2>{artist.name}</h2>
              <p>Number of Artworks: {artist.count}</p>
              <p>Biography: {artist.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ArtistBiographyCards;
