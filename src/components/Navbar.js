import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the menu when navigating to a new route
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="flex">
            <img src={logo} alt="Weather Logo" />
            <h2 className="logo-text">WeatherWise</h2>
          </div>
        </Link>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? (
          <FaTimes size={30} color="white" />
        ) : (
          <FaBars size={30} color="white" />
        )}
      </div>
      <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/forecast" onClick={closeMenu}>
            Forecast
          </Link>
        </li>
        <li>
          <Link to="/map" onClick={closeMenu}>
            Map
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
