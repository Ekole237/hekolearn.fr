"use client";

import { motion } from "framer-motion";
import { Resource } from "@/types/resources";

const typeVariants = {
  document: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  video: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
    transition: { type: "spring", stiffness: 400, damping: 30 }
  },
  exercise: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 25 }
  },
  tool: {
    initial: { rotate: -10, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 10, opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

interface ResourceTransitionProps {
  children: React.ReactNode;
  resource: Resource;
  className?: string;
}

export function ResourceTransition({ children, resource, className }: ResourceTransitionProps) {
  const variant = typeVariants[resource.type as keyof typeof typeVariants] || typeVariants.document;

  return (
    <motion.div
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variant}
      className={className}
    >
      {children}
    </motion.div>
  );
}
