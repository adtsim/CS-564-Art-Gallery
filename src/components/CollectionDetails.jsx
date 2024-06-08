import React from "react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArtworksByMaker } from "../services/apiService";

function CollectionDetails() {
  const { maker } = useParams();
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getArtworks = async () => {
      try {
        const allArtworks = await fetchArtworksByMaker(
          decodeURIComponent(maker)
        );
        setArtworks(allArtworks);
      } catch (err) {
        setError("Failed to load artworks.");
      }
    };
    getArtworks();
  }, [maker]);

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
  if (error) {
    return <div style={{ color: "white" }}>{error}</div>;
  }
  return (
    <div style={{ color: "white" }}>
      <h1 style={{ color: "white" }}>
        Artworks by {decodeURIComponent(maker)}
      </h1>
      {artworks.map((artwork) => (
        <div key={artwork.id}>
          <h2 style={{ color: "white" }}>{artwork.title}</h2>
          {artwork.webImage && artwork.webImage.url ? (
            <img
              src={artwork.webImage.url}
              alt={artwork.title}
              style={{ width: "100%", maxWidth: "400px" }}
            />
          ) : (
            <p>No image available.</p>
          )}
          <p style={{ color: "white" }}>
            {artwork.longTitle || "No description available."}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CollectionDetails;
