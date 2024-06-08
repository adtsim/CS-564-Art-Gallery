// TopPiecesCard.jsx
import React, { useEffect, useState } from "react";
import apiService from "../services/apiService";
import "../styles/GalleryStyles.css";
import "../styles/AnalyzeStyles.css";

const GalleryCard = ({ artists, period }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Artists being passed to fetchTopPieces:", artists);
    if (artists.length > 0) {
      setLoading(true); // Start loading
      apiService.fetchGallery(artists).then((data) => {
        setGallery(data);
        setLoading(false); // End loading
      });
    }
  }, [artists]);

  if (loading) {
    // Check the loading state
    return (
      <div className="chart-container">
        <div className="loading-container_analyze">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
          <div className="mt-3">Please wait, data is being fetched.</div>
        </div>
      </div>
    );
  }

  const century = `${period}th Century`;
  return (
    <div>
      <h1 className="gallery-title">
        Gallery of Masterpieces from the {century} by Renowned Artists
      </h1>

      <div className="top-pieces-container">
        {gallery.length > 0
          ? gallery.map((piece, index) => (
              <div key={index} className="top-piece-card">
                <img
                  src={piece.image}
                  alt={`Artwork titled "${piece.title}" by ${piece.artist}`}
                  className="top-piece-image"
                />
                <div className="top-piece-info">
                  <h2>{piece.title}</h2>
                  <p>Artist: {piece.artist}</p>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default GalleryCard;
