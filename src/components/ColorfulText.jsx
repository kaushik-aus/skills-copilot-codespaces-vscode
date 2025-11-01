// src/components/ColorfulText.jsx

import React from "react";
import { motion } from "framer-motion";

export const ColorfulText = ({
  children,
  className,
  // I've set your orange theme colors as the default
  colors = ["#ff3700ff", "#ff9900ff", "#ff00aaff", "#e60049ff"],
}) => {
  const text = children;
  const chars = text.split(""); // Split the word into characters

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      style={{ display: "inline-flex" }} // Use inline-flex to keep it on the same line
      variants={container}
      initial="hidden"
      animate="visible" // Animate when it first appears
      className={className}
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          style={{ color: colors[index % colors.length] }}
          variants={child}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};
