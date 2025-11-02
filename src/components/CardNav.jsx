// src/components/CardNav.jsx
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import "./CardNav.css";

import { TextFlip } from "./TextFlip.jsx";
import { FaSearch, FaShoppingCart } from "react-icons/fa";

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
        // Force reflow for measurement
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
      // Prevent hard crashes and surface a helpful log
      // You’ll still see the red overlay with the real error/stack in dev
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

  // React will call this with `null` on unmount, so it will clear safely.
  const setCardRef = (i) => (el) => {
    cardsRef.current[i] = el || null;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""}`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top">
          <div className="card-nav-left">
            <div
              className={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
              onClick={toggleMenu}
              role="button"
              aria-label={isExpanded ? "Close menu" : "Open menu"}
              tabIndex={0}
              style={{ color: menuColor || "#000" }}
            >
              <div className="hamburger-line" />
              <div className="hamburger-line" />
            </div>

            <div className="card-nav-search">
              <FaSearch className="card-nav-search-icon" aria-hidden="true" />
              <input type="text" className="card-nav-search-input" />

              <div className="card-nav-search-text">
                <span className="search-text-static">Search</span>
                <TextFlip words={searchWords} />
              </div>
            </div>
          </div>

          <div className="card-nav-right">
            <button className="card-nav-icon-btn" aria-label="Cart">
              <FaShoppingCart />
              <span>Cart</span>
            </button>
            <button
              type="button"
              className="card-nav-cta-button"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              Sign In
            </button>
          </div>
        </div>

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
                    aria-label={lnk.ariaLabel}
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
