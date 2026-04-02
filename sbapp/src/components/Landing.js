import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  FaUtensils, FaLaptop, FaTshirt, FaHeartbeat, FaDumbbell, FaBus,
  FaHome, FaBook, FaSpa, FaTools, FaShoppingCart, FaFilm,
  FaBuilding, FaPlane, FaCalendarAlt, FaSearch, FaMapMarkerAlt, FaChevronRight, FaChevronDown
} from "react-icons/fa";
import "./Landing.css";
import AuthModal from "../components/AuthModal";
import ChatBot from "../components/ChatBot";
function Landing() {
  const [categories,     setCategories]     = useState([]);
  const [scrolled,       setScrolled]       = useState(false);
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [openDropdown,   setOpenDropdown]   = useState(null);
  const [showAuth,       setShowAuth]       = useState(false);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const token = localStorage.getItem("token");
  const name  = localStorage.getItem("name");

  const sliderImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032",
    "https://images.unsplash.com/photo-1581578731548-c64695ce6958?q=80&w=2070"
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [sliderImages.length]);

  useEffect(() => {
    axios.get("http://localhost:8086/api/fetch")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  // ✅ Search handler
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter what you are looking for");
      return;
    }
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(searchLocation)}`;
  };

  const getIcon = (name) => {
    const icons = {
      "Food Service": <FaUtensils />, "Electronics": <FaLaptop />, "Clothing": <FaTshirt />,
      "Healthcare": <FaHeartbeat />, "Sports": <FaDumbbell />, "Transportation": <FaBus />,
      "Home Services": <FaHome />, "Education": <FaBook />, "Beauty & Wellness": <FaSpa />,
      "Repair & Maintenance": <FaTools />, "Grocery & Daily Needs": <FaShoppingCart />,
      "Entertainment": <FaFilm />, "Real Estate": <FaBuilding />, "Travel & Tourism": <FaPlane />,
      "Event Management": <FaCalendarAlt />
    };
    return icons[name] || <FaTools />;
  };

  return (
    <div className="premium-app">
      <nav className={`premium-nav ${scrolled ? "nav-glassy" : ""}`}>
        <div className="nav-wrapper">
          <div className="brand-box">
            <h2 className="brand-logo">Quick<span>Serve</span></h2>
          </div>

          <div className="nav-central-links">
            <Link to="/OurStory">Our Story</Link>
            <Link to="/TheBlueprint">The Blueprint</Link>
            <Link to="/Categories">Categories</Link>
            <Link to="/Inquiry">Inquiry</Link>
          </div>

          <div className="nav-actions">

            {/* PARTNER DROPDOWN */}
            <div
              className="dropdown-wrapper"
              onMouseEnter={() => setOpenDropdown("partner")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`action-outline ${openDropdown === "partner" ? "active" : ""}`}>
                Partner <FaChevronDown className={`drop-chevron ${openDropdown === "partner" ? "rotate" : ""}`} />
              </button>

              <div className={`dropdown-menu ${openDropdown === "partner" ? "show" : ""}`}>
                <Link to="/PrroviderLogin">Sign In</Link>
                <Link to="/ServiceRegister">Sign Up</Link>
              </div>
            </div>

            {/* JOIN NOW → MODAL */}
            <div className="dropdown-wrapper">
              {token ? (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

                  <div style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    padding: "8px 16px",
                    borderRadius: "25px",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    border: "1px solid rgba(255,255,255,0.2)"
                  }}>
                    👤 {name}
                  </div>

                  <div
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("username");
                      window.location.reload();
                    }}
                    style={{
                      background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
                      padding: "8px 18px",
                      borderRadius: "25px",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "0.3s",
                      boxShadow: "0 4px 12px rgba(255, 65, 108, 0.4)"
                    }}
                    onMouseEnter={(e) => { e.target.style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
                  >
                    Logout
                  </div>

                  <div
                    style={{
                      background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
                      padding: "8px 18px",
                      borderRadius: "25px",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "0.3s",
                      boxShadow: "0 4px 12px rgba(245,158,11,0.35)"
                    }}
                    onMouseEnter={(e) => { e.target.style.transform = "scale(1.05)"; }}
                    onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
                  >
                    <Link to="/UserBooking" style={{ color: "inherit", textDecoration: "none" }}>Track ur booking</Link>
                  </div>

                </div>
              ) : (
                <button
                  className="action-solid"
                  onClick={() => setShowAuth(true)}
                >
                  Join Now
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="immersive-hero">
        {sliderImages.map((img, idx) => (
          <div
            key={idx}
            className={`hero-layer ${idx === activeIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="hero-vignette"></div>

        <div className="hero-main-content">
          <div className="top-label">
            <span className="dot"></span>
            <p>Elevating Service Standards</p>
          </div>
          <h1 className="hero-title">
            The Future of <br /> <span>Local Services.</span>
          </h1>
          <p className="hero-subtitle">Bespoke online & offline solutions tailored for the modern lifestyle.</p>

          {/* ✅ UPDATED SEARCH BAR */}
          <div className="docked-search">
            <div className="dock-item">
              <FaSearch className="dock-icon" />
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="dock-separator"></div>
            <div className="dock-item">
              <FaMapMarkerAlt className="dock-icon" />
              <input
                type="text"
                placeholder="Select Location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button className="dock-btn" onClick={handleSearch}>
              Find Experts
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bento-section">
        <div className="bento-header">
          <p className="pre-title">Curated Marketplace</p>
          <h2>Signature Categories</h2>
        </div>

        <div className="bento-grid">
          {categories.map((cat, index) => (
            <div className="bento-card" key={cat.cid} style={{ "--delay": `${index * 0.05}s` }}>
              <div className="card-glass-bg"></div>
              <div className="card-inner">
                <div className="card-icon-sphere">
                  {getIcon(cat.cname)}
                </div>
                <div className="card-text">
                  <h3>{cat.cname}</h3>
                  <p>Premium verified providers</p>

                  <button
                    className="luxury-link"
                    onClick={() => {
                      window.location.href = `/category/${cat.cid}`;
                    }}
                  >
                    Explore <FaChevronRight className="chevron" />
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={showAuth}
        closeModal={() => setShowAuth(false)}
      />

      <footer className="luxury-footer">
        <div className="footer-top">
          <h2>Quick<em>Serve</em></h2>
          <p>Redefining quality in service marketplaces.</p>
        </div>
        <div className="footer-bottom">
          <p>© 2026 QuickServe Signature. All Rights Reserved.</p>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
}

export default Landing;
