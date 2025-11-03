// src/components/CardNav.jsx
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import "./CardNav.css";

import { TextFlip } from "./TextFlip.jsx";
// Use stable Lucide icon names that are available across versions
import { LuSearch, LuShoppingCart, LuUser, LuEllipsis } from "react-icons/lu";

// Fallback logo if none is provided via props
import defaultWordmark from "../assets/brand/wordmark.svg";

const CardNav = ({
  logo,
  logoAlt,
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#ffffffff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const searchWords = ["models...", "anime...", "characters...", "vehicles..."];

  const safeTargets = () => cardsRef.current.filter(Boolean);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;
    const isMobile = window.matchMedia?.("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content");
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;
        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";
        // Force reflow
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        contentEl.offsetHeight;
        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight || 0;
        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;
        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    try {
      gsap.set(navEl, { height: 60, overflow: "hidden" });
      const targets = safeTargets();
      if (targets.length) {
        gsap.set(targets, { y: 50, opacity: 0 });
      }

      const tl = gsap.timeline({ paused: true });
      tl.to(navEl, {
        height: calculateHeight,
        duration: 0.4,
        ease,
      });

      if (targets.length) {
        tl.to(
          targets,
          { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
          "-=0.1"
        );
      }

      return tl;
    } catch (e) {
      console.error("GSAP timeline error in CardNav:", e);
      return null;
    }
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => {
      tl?.kill?.();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;
      if (isExpanded) {
        const newHeight = calculateHeight();
        if (navRef.current) gsap.set(navRef.current, { height: newHeight });
        tlRef.current.kill?.();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        } else {
          tlRef.current = null;
        }
      } else {
        tlRef.current.kill?.();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        } else {
          tlRef.current = null;
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback?.("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i) => (el) => {
    cardsRef.current[i] = el || null;
  };

  const logoSrc = logo || defaultWordmark;

  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""}`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top">
          {/* Left: hamburger + brand */}
          <div className="card-nav-left">
            <div
              className={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
              onClick={toggleMenu}
              role="button"
              aria-label={isExpanded ? "Close menu" : "Open menu"}
              tabIndex={0}
              style={{ color: menuColor || "#0f172a" }}
            >
              <div className="hamburger-line" />
              <div className="hamburger-line" />
            </div>

            <a className="logo-container" href="/" aria-label="Home">
              <img src={logoSrc} alt={logoAlt || "Logo"} />
            </a>
          </div>

          {/* Center: wide search */}
          <div className="card-nav-center">
            <div className="card-nav-search">
              <LuSearch className="card-nav-search-icon" aria-hidden="true" />
              <input type="text" className="card-nav-search-input" />
              <div className="card-nav-search-text">
                <span className="search-text-static">Search</span>
                <TextFlip
                  words={[
                    "models...",
                    "anime...",
                    "characters...",
                    "vehicles...",
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="card-nav-right">
            <button
              className="card-nav-icon-btn"
              type="button"
              aria-label="Login"
            >
              <LuUser />
              <span>Login</span>
            </button>

            <button
              className="card-nav-icon-btn"
              aria-label="Cart"
              type="button"
            >
              <LuShoppingCart />
              <span>Cart</span>
            </button>

            <a
              className="card-nav-text-link"
              href="#"
              aria-label="Become a Seller"
            >
              Become a Seller
            </a>
          </div>
        </div>

        {/* Expanded content */}
        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel || lnk.label}
                  >
                    <GoArrowUpRight
                      className="nav-card-link-icon"
                      aria-hidden="true"
                    />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
