import React, { useEffect, useMemo, useRef } from "react";

/**
 * Single-line, infinite carousel with subtle edge fade via CSS mask.
 * Props:
 * - speedPxPerSec: number (default 100)
 * - edgeFade: number in px (default 64) – controls how wide the edge fade is
 */
export default function TrendingCarousel({
  children,
  speedPxPerSec = 100,
  edgeFade = 64,
}) {
  const trackRef = useRef(null);

  // Duplicate children once for seamless looping
  const clones = useMemo(
    () =>
      React.Children.map(children, (child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              "aria-hidden": true,
              key: `clone-${i}`,
            })
          : child
      ),
    [children]
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const compute = () => {
      const cs = getComputedStyle(el);
      const gap = parseFloat(cs.gap || "0");
      // Width of the first set (only originals)
      const childrenArr = Array.from(el.children);
      const half = Math.floor(childrenArr.length / 2) || childrenArr.length;
      const originals = childrenArr.slice(0, half);

      const width = originals.reduce((acc, node, idx) => {
        const rect = node.getBoundingClientRect();
        return acc + rect.width + (idx < originals.length - 1 ? gap : 0);
      }, 0);

      const duration = Math.max(10, width / speedPxPerSec);
      el.style.setProperty("--carousel-distance", `${width}px`);
      el.style.setProperty("--carousel-duration", `${duration}s`);
    };

    const ro = new ResizeObserver(() => compute());
    ro.observe(el);
    compute();

    const onResize = () => compute();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [children, speedPxPerSec]);

  return (
    <div
      className="trending-carousel trending--masked"
      style={{ ["--edge-fade"]: `${edgeFade}px` }}
      data-trending-carousel
    >
      <div className="trending-track" ref={trackRef}>
        {children}
        {clones}
      </div>
    </div>
  );
}
