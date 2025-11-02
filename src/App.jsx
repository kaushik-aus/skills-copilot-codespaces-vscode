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

import "./index.css";
import "./App.css";

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

// --- APP COMPONENT ---
function App() {
  // --- STATE ---
  const [currentSlide, setCurrentSlide] = useState(0);
  // Removed scrollAmount state

  // --- REFS ---
  // Removed cardRowRef, prevBtnRef, nextBtnRef
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
    }, 2700); // Your 2.7 second speed
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    startAutoSlide(); // Reset the timer when a dot is clicked
  };

  // --- SIDE EFFECTS (useEffect) ---

  // Carousel auto-slide effect
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
        logo="https://via.placeholder.com/120x40/FF6600/FFFFFF?text=ModelMart"
        logoAlt="ModelMart Logo"
        items={navItems}
        baseColor="#ffffffff"
        menuColor="#ff6302ff"
        buttonBgColor="#FF6600"
        buttonTextColor="#FFFFFF"
      />

      <main className="container">
        <section
          className="hero-carousel"
          onMouseEnter={stopAutoSlide}
          onMouseLeave={startAutoSlide}
        >
          {/* --- This is the sliding track --- */}
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slidesData.map((slide, index) => (
              <div
                key={index}
                className={"carousel-slide"} // active class no longer needed here
                style={{ backgroundImage: `url('${slide.bg}')` }}
              >
                <div className="hero-content">
                  <h2>{slide.title}</h2>
                  <p>{slide.desc}</p>
                  <button className="btn btn-primary" onClick={handleRipple}>
                    {slide.btnText}
                  </button>
                </div>
                <img
                  src={slide.assetImg}
                  alt="Featured Asset"
                  className="hero-asset-image"
                />
              </div>
            ))}
          </div>
          {/* --- End of track --- */}
          <div className="carousel-dots">
            {slidesData.map((_, index) => (
              <span
                key={index}
                className={index === currentSlide ? "dot active" : "dot"}
                onClick={() => handleDotClick(index)}
              ></span>
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

        {/* --- "New Arrivals" scroller is removed --- */}

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
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {/* Item 1 */}
            <div className="masonry-item">
              <img src="https://via.placeholder.com/300x300" alt="Asset" />
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
            {/* Item 2 */}
            <div className="masonry-item">
              <img src="https://via.placeholder.com/300x300" alt="Asset" />
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
            {/* Item 3 (Fixed URL) */}
            <div className="masonry-item">
              <img src="https://via.placeholder.com/300x300" alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>Stnn Tocer Partall</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$35.50</span>
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
            {/* Item 4 */}
            <div className="masonry-item">
              <img src="https://via.placeholder.com/300x300" alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>Carm Or</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$9.00</span>
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
            {/* Item 5 (Fixed URL) */}
            <div className="masonry-item">
              <img src="https://via.placeholder.com/300x280" alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>Bacea a Flrt</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$18.99</span>
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
            {/* Item 6 */}
            <div className="masonry-item">
              <img src="https://via.placeholder.com/300x220" alt="Asset" />
              <div className="item-info">
                <div className="item-details">
                  <h4>Mata Of Bayal</h4>
                  <p>Steptoame Dri Renpart</p>
                  <span className="item-price">$21.00</span>
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
