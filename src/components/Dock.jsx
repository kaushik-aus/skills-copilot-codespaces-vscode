// src/components/Dock.jsx

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Children, cloneElement, useRef } from "react";

import "./Dock.css";

// This component is now a simple wrapper for the text
function DockLabel({ children, className = "" }) {
  return <div className={`dock-label ${className}`}>{children}</div>;
}

// This component now receives the animated 'size' prop
function DockIcon({ children, className = "", size }) {
  return (
    <motion.div
      className={`dock-icon ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </motion.div>
  );
}

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}) {
  const ref = useRef(null);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    // This item is now a flex column, and its width animates
    <motion.div
      ref={ref}
      style={{ width: size }} // The item's width animates
      onClick={onClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
    >
      {/* We map over children and pass the 'size' prop to the DockIcon */}
      {Children.map(children, (child) => {
        if (child.type.name === "DockIcon") {
          return cloneElement(child, { size: size });
        }
        if (child.type.name === "DockLabel") {
          return cloneElement(child); // Label doesn't need props
        }
        return null;
      })}
    </motion.div>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  baseItemSize = 50,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  return (
    <motion.div style={{ scrollbarWidth: "none" }} className="dock-outer">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
