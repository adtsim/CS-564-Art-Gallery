import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Analyze from "./components/Analyze";
import InfoPiece from "./components/InfoPiece";
import { GalleryProvider } from "./context/GalleryContext";
import SearchArtworks from "./components/SearchArtworks";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Collections from "../src/components/Collections";
import CollectionDetails from "../src/components/CollectionDetails";
import CompareArtworks from "./components/CompareArtworks";

function App() {
  return (
    <GalleryProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/info-piece/:id" element={<InfoPiece />} />
          <Route path="/search-artworks" element={<SearchArtworks />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/collections" element={<Collections />} />
          <Route
            path="/collection-details/:maker"
            element={<CollectionDetails />}
          />
          <Route path="/compare-artworks" element={<CompareArtworks />} />
        </Routes>
      </Router>
    </GalleryProvider>
  );
}

export default App;
