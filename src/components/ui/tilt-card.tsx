"use client";

import React from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  return (
    <motion.div
      className={`relative transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10 ${className}`}
      whileHover={{ 
        y: -8,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30 
      }}
    >
      {children}
    </motion.div>
  );
}
