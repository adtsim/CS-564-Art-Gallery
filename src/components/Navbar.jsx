import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import "../styles/navbar.css";

const NavigationBar = () => {
  return (
    // Navigation bar component
    <Navbar bg="dark" variant="dark" expand="lg">
      {/* Brand name */}
      <Navbar.Brand href="/">Art Gallery</Navbar.Brand>
      {/* Navbar toggle button */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {/* Navbar collapse section */}
      <Navbar.Collapse id="basic-navbar-nav">
        {/* Left-aligned links */}
        <Nav className="mr-auto">
          {/* Home link */}
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          {/* Search Artworks link */}
          <Nav.Link as={Link} to="/search-artworks">
            Search Artworks
          </Nav.Link>
        </Nav>
        {/* Right-aligned links */}
        <Nav className="ml-auto">
          {/* Sign Up button */}
          <Button as={Link} to="/signup" variant="outline-light" className="mr-2">
            Sign Up
          </Button>
          {/* Login button */}
          <Button as={Link} to="/login" variant="outline-light">
            Login
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
