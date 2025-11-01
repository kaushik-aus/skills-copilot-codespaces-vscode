// src/components/TextFlip.jsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * TextFlip
 * - Width-animates the viewport to the current word's width.
 * - Cross-fades and slides words inside a clipped viewport.
 * - Named export to match: import { TextFlip } from "./TextFlip.jsx";
 */
export const TextFlip = ({
  words = [],
  duration = 3000,
  className,
  enterY = 14,
  exitY = -14,
  widthTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  wordTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}) => {
  const [index, setIndex] = React.useState(0);
  const measureRef = React.useRef(null);
  const [measuredWidth, setMeasuredWidth] = React.useState(0);

  const current = words.length ? words[index] : "";

  // Cycle words
  React.useEffect(() => {
    if (!words.length) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      duration
    );
    return () => clearInterval(id);
  }, [words, duration]);

  // Measure current word width to animate viewport width
  React.useLayoutEffect(() => {
    if (measureRef.current) {
      const w = measureRef.current.offsetWidth || 0;
      setMeasuredWidth(w);
    }
  }, [current]);

  return (
    <span className={`textflip ${className || ""}`}>
      {/* Width-animated viewport */}
      <motion.span
        className="textflip-viewport"
        animate={{ width: measuredWidth }}
        initial={false}
        transition={widthTransition}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current}
            className="textflip-word"
            initial={{ opacity: 0, y: enterY }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: exitY }}
            transition={wordTransition}
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </motion.span>

      {/* Hidden measurement node (styles must match .textflip-word) */}
      <span ref={measureRef} className="textflip-measure" aria-hidden="true">
        {current}
      </span>
    </span>
  );
};

export default TextFlip;
