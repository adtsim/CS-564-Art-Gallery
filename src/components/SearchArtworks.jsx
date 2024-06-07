import React, { useState } from "react";
import apiService from "../services/apiService";
import "../styles/searchArtwork.css"; 

import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const SearchArtworks = () => {
  const [query, setQuery] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Array of popular artists for search options
  const artists = ["Rembrandt", "Vermeer", "Van Gogh", "Frans Hals", "Jan Steen", "Jacob van Ruisdael"];

  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    // Set loading to true when search is initiated
    setLoading(true); 
    // Clear any previous errors
    setError(null); 
    try {
        // Fetch artworks by maker from API
      const results = await apiService.fetchArtworksByMaker(query); 
      // Set fetched artworks to state
      setArtworks(results); 
      // Set loading to false after fetching data
      setLoading(false); 
    } catch (error) {
        // Set error if fetching artworks fails
      setError(error); 
      // Set loading to false in case of error
      setLoading(false); 
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSearch} className="mb-4">
        {/* Label for search form */}
        <Form.Group controlId="searchQuery">
          <Form.Label>Search Artworks by Title or Artist</Form.Label>
          {/* Dropdown to select artist */}
          <Form.Control
            as="select"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-2"
          >
            <option value="">Select an artist</option>
            {artists.map((artist, index) => (
              <option key={index} value={artist}>{artist}</option>
            ))}
          </Form.Control>
          {/* Input field to enter search query */}
          <Form.Control
            type="text"
            placeholder="Enter title or artist name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-2"
          />
        </Form.Group>
        {/* Button to initiate search */}
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
      {/* Display loading message while fetching data */}
      {loading && <div>Loading...</div>}
      {/* Display error message if fetching data fails */}
      {error && <div>Error fetching artworks: {error.message}</div>}
      {/* Display artworks */}
      <Row>
        {artworks.map((artwork, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              {/* Display artwork image */}
              {artwork.webImage && (
                <Card.Img variant="top" src={artwork.webImage.url} alt={artwork.title} />
              )}
              <Card.Body>
                {/* Display artwork title and artist */}
                <Card.Title>{artwork.title}</Card.Title>
                <Card.Text>{artwork.principalOrFirstMaker}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchArtworks;
