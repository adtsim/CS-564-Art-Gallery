import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import InfoPiece from "./components/InfoPiece";
import { GalleryProvider } from "./context/GalleryContext";
import SearchArtworks from "./components/SearchArtworks";
import Signup from "./components/Signup";
import Login from "./components/Login";


function App() {
  return (
    <GalleryProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/info-piece/:id" element={<InfoPiece />} />
          <Route path="/search-artworks" element={<SearchArtworks />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </GalleryProvider>
  );
}

export default App;
