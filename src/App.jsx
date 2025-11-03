// src/App.jsx

import React, { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import imagesLoaded from "imagesloaded";

// --- 1. IMPORT CART ICON ---
import { FaShoppingCart } from "react-icons/fa";

import CardNav from "./components/CardNav.jsx";
import "./components/CardNav.css";
import MagicBento from "./components/MagicBento.jsx";
import "./components/MagicBento.css";
import Dock from "./components/Dock.jsx";
import "./components/Dock.css";
import { ColorfulText } from "./components/ColorfulText.jsx";
// Add these imports with your other imports
import TrendingCarousel from "./components/TrendingCarousel.jsx";
import "./components/TrendingCarousel.css";

import "./index.css";
import "./App.css";

// NEW: polished brand wordmark
import logoWordmark from "./assets/brand/wordmark.svg";

// Your image imports
import handImage from "./assets/hand.jpeg";
import girlImage from "./assets/girl.jpg";
import angryImage from "./assets/angry.jpeg";
import danceImage from "./assets/dancing.jpeg";
import demonImage from "./assets/demon.jpg";
import bikeImage from "./assets/bike.jpeg";
import lundImage from "./assets/lund.jpeg";
import duduImage from "./assets/dudu.png";
import dhoriImage from "./assets/dhori.png";
import humanImage from "./assets/human.jpeg";
import whaleImage from "./assets/whale.jpeg";
import narutoImage from "./assets/naruto.jpg";
import onePieceImage from "./assets/one-piece.jpg";
import spyImage from "./assets/spy.jpg";
import animeImage from "./assets/anime-pfp.jpg";
import characterImage from "./assets/character-pfp.jpg";
import vehicleImage from "./assets/vehicle-pfp.jpg";
import buildingImage from "./assets/building-pfp.jpg";
import electronicsImage from "./assets/electronics-pfp.jpg";

// --- Data for your slides ---
const slidesData = [
  {
    bg: "https://via.placeholder.com/1200x400/333/FFF?text=Hero+Background",
    title: (
      <>
        THE FUTURE OF 3D <ColorfulText>DUDU</ColorfulText> IS HERE
      </>
    ),
    desc: "The POWERSTAR of Bihar PAWAN SINGH is here to revolutionize your 3D experience.",
    btnText: "Explore Now",
    assetImg: duduImage,
  },
  {
    bg: "https://via.placeholder.com/1200x400/555/FFF?text=Slide+2",
    title: (
      <>
        <ColorfulText>DHORI</ColorfulText> IS A GAME-CHANGER FOR 3D ASSETS
      </>
    ),
    desc: "Amrapali's DHORI is transforming the way you interact with 3D models. Experience innovation like never before.",
    btnText: "View Collection",
    assetImg: dhoriImage,
  },
];

// --- Masonry Breakpoints ---
const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
  480: 1,
};

// --- Sample Data for your new CardNav ---
const navItems = [
  {
    label: "3D Models",
    bgColor: "#f4f4f5",
    textColor: "#18181b",
    links: [
      { label: "Vehicles", href: "#" },
      { label: "Characters", href: "#" },
      { label: "Environments", href: "#" },
    ],
  },
  {
    label: "Anime",
    bgColor: "#fef2f2",
    textColor: "#991b1b",
    links: [
      { label: "Action", href: "#" },
      { label: "Slice of Life", href: "#" },
      { label: "Trending", href: "#" },
    ],
  },
  {
    label: "Community",
    bgColor: "#eff6ff",
    textColor: "#1e40af",
    links: [
      { label: "Forums", href: "#" },
      { label: "Discord", href: "#" },
      { label: "Creators", href: "#" },
    ],
  },
];

// Data for Categories Section
const categoryData = [
  { name: "Models", img: handImage, href: "#" },
  { name: "Characters", img: characterImage, href: "#" },
  { name: "Anime", img: animeImage, href: "#" },
  { name: "Poses", img: danceImage, href: "#" },
  { name: "Expressions", img: angryImage, href: "#" },
  {
    name: "Vehicles",
    img: vehicleImage,
    href: "#",
  },
  {
    name: "Buildings",
    img: buildingImage,
    href: "#",
  },
  {
    name: "Nature",
    img: whaleImage,
    href: "#",
  },
  {
    name: "Electronics",
    img: electronicsImage,
    href: "#",
  },
];

// TRANSFORM YOUR DATA FOR THE DOCK
const dockItems = categoryData.map((item) => ({
  label: item.name,
  icon: <img src={item.img} alt={item.name} />,
  onClick: () => console.log(`Clicked ${item.name}`),
}));

const SLIDE_INTERVAL_MS = 2700; // centralized for dots animation + autoplay

// NEW: control the hero's vertical footprint here
const HERO_MIN_HEIGHT = 340; // was ~420 via CSS; lower = shorter hero
const HERO_MEDIA_MAX_HEIGHT = 300; // cap the media (image) height so it doesn't force the hero taller

// --- APP COMPONENT ---
function App() {
  // --- STATE ---
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- REFS ---
  const autoSlideIntervalRef = useRef(null); // Ref to hold the interval ID

  // --- RIPPLE EFFECT HANDLER ---
  const handleRipple = (e) => {
    const button = e.currentTarget;
    const x = e.clientX - button.getBoundingClientRect().left;
    const y = e.clientY - button.getBoundingClientRect().top;

    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // --- CAROUSEL HANDLERS ---
  const stopAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slidesData.length);
    }, SLIDE_INTERVAL_MS);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    startAutoSlide(); // Reset the timer when a dot is clicked
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slidesData.length) % slidesData.length
    );
    startAutoSlide();
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    startAutoSlide();
  };

  // --- SIDE EFFECTS (useEffect) ---
  useEffect(() => {
    startAutoSlide();
    return () => {
      stopAutoSlide();
    };
  }, []);

  // Scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  // imagesLoaded effect
  useEffect(() => {
    const grids = document.querySelectorAll(".masonry-grid");
    grids.forEach((grid) => {
      imagesLoaded(grid, () => {});
    });
  }, []);

  // --- RENDER ---
  return (
    <div className="app-container">
      <CardNav
        logo={logoWordmark} // UPDATED: polished logo asset
        logoAlt="ModelMart Logo"
        items={navItems}
        baseColor="#ffffffff"
        menuColor="#0f172a" // cleaner, darker icon color
        buttonBgColor="#FF6600"
        buttonTextColor="#FFFFFF"
      />

      <main className="container">
        {/* HERO CAROUSEL (improved styles/controls, same data) */}
        <section
          className="hero-carousel"
          onMouseEnter={stopAutoSlide}
          onMouseLeave={startAutoSlide}
          aria-roledescription="carousel"
          aria-label="Hero"
        >
          {/* Track */}
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slidesData.map((slide, index) => (
              <div
                key={index}
                className="carousel-slide"
                style={{
                  backgroundImage: `url('${slide.bg}')`,
                  minHeight: `${HERO_MIN_HEIGHT}px`, // LOWER HEIGHT
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${slidesData.length}`}
              >
                <div className="hero-content">
                  <h2>{slide.title}</h2>
                  <p>{slide.desc}</p>
                  <button className="btn btn-primary" onClick={handleRipple}>
                    {slide.btnText}
                  </button>
                </div>
                {/* Cap the asset height so it can't force the hero taller */}
                <img
                  src={slide.assetImg}
                  alt="Featured Asset"
                  className="hero-asset-image"
                  style={{
                    maxHeight: `${HERO_MEDIA_MAX_HEIGHT}px`,
                    width: "55%",
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Arrows (overlay) */}
          <div className="hero-arrows" aria-hidden>
            <button
              className="hero-arrow"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              className="hero-arrow"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              ›
            </button>
          </div>

          {/* Dots with progress fill */}
          <div
            className="carousel-dots"
            role="tablist"
            aria-label="Select hero slide"
          >
            {slidesData.map((_, index) => (
              <button
                key={index}
                className={index === currentSlide ? "dot active" : "dot"}
                onClick={() => handleDotClick(index)}
                aria-selected={index === currentSlide}
                aria-label={`Go to slide ${index + 1}`}
                type="button"
              >
                <span
                  className="dot-fill"
                  style={{ animationDuration: `${SLIDE_INTERVAL_MS}ms` }}
                />
              </button>
            ))}
          </div>
        </section>

        <Dock
          items={dockItems}
          baseItemSize={64}
          magnification={80}
          distance={150}
          panelHeight={100}
        />

        {/* --- 2. UPDATED MASONRY SECTIONS --- */}
        <section className="product-section animate-on-scroll">
          <h3>New Arrivals</h3>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {/* Item 1 */}
            <div className="masonry-item">
              <img src={narutoImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>Naruto Uzumaki</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$19.99</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>
            {/* Item 2 */}
            <div className="masonry-item">
              <img src={onePieceImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>One Piece</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$24.99</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>
            {/* Item 3 */}
            <div className="masonry-item">
              <img src={demonImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>Demon Slayer</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$29.99</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>
            {/* Item 4 (Fixed classNameWarning) */}
            <div className="masonry-item">
              <img src={spyImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>Spy X Fanlily</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$14.99</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          </Masonry>
        </section>

        <section className="product-section animate-on-scroll">
          <h3>Trending Models</h3>

          {/* Keep your existing TrendingCarousel usage as is */}
          <TrendingCarousel>
            <div className="masonry-item">
              <img src={narutoImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>Haikyuu</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$19.99</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>

            <div className="masonry-item">
              <img src={spyImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>SM Z Dek Ssummer</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$22.00</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>

            <div className="masonry-item">
              <img src={demonImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>SM Z Dek Ssummer</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$22.00</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>

            <div className="masonry-item">
              <img src={whaleImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>SM Z Dek Ssummer</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$22.00</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>

            <div className="masonry-item">
              <img src={humanImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>SM Z Dek Ssummer</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$22.00</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>

            <div className="masonry-item">
              <img src={girlImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>SM Z Dek Ssummer</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$22.00</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>

            <div className="masonry-item">
              <img src={angryImage} alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>SM Z Dek Ssummer</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$22.00</span>
                </div>
                <button
                  className="add-to-cart-btn"
                  aria-label="Add to cart"
                  onClick={handleRipple}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          </TrendingCarousel>
        </section>

        {/* --- BENTO GRID is in the correct place --- */}
        <MagicBento />
      </main>

      <footer className="main-footer">
        <p>Elbrectn tehlmen besis, nbebts aem, Nba elbeelctan</p>
      </footer>
    </div>
  );
}

export default App;
