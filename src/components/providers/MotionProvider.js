"use client";

import { motion, MotionConfig } from "framer-motion";

export default function MotionProvider({ children }) {
  return (
    <MotionConfig transition={{ 
      type: "spring", 
      damping: 20, 
      stiffness: 100,
      mass: 1
    }}>
      {children}
    </MotionConfig>
  );
}
