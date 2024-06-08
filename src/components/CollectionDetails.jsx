import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArtworksByMaker } from "../services/apiService";

function CollectionDetails() {
  const { maker } = useParams();
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const getArtworks = async () => {
      const allArtworks = await fetchArtworksByMaker(decodeURIComponent(maker));
      setArtworks(allArtworks);
    };
    getArtworks();
  }, [maker]);

  return (
    <div>
      <h1>Artworks by {decodeURIComponent(maker)}</h1>
      {artworks.map((artwork) => (
        <div key={artwork.id}>
          <h2>{artwork.title}</h2>
          {artwork.webImage && artwork.webImage.url ? (
            <img
              src={artwork.webImage.url}
              alt={artwork.title}
              style={{ width: "100%", maxWidth: "400px" }}
            />
          ) : (
            <p>No image available.</p>
          )}
          <p>{artwork.longTitle || "No description available."}</p>
        </div>
      ))}
    </div>
  );
}

export default CollectionDetails;
