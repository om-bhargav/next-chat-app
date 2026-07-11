"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge as ShadBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeProps
  extends React.ComponentProps<typeof ShadBadge> {
  animate?: boolean;
}

export default function Badge({
  children,
  className,
  animate = true,
  ...props
}: BadgeProps) {
  return (
    <motion.div
      initial={
        animate
          ? {
              opacity: 0,
              y: 10,
            }
          : undefined
      }
      whileInView={
        animate
          ? {
              opacity: 1,
              y: 0,
            }
          : undefined
      }
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
      }}
      className="inline-flex"
    >
      <ShadBadge
        {...props}
        className={cn(
          "font-geist-sans font-medium",
          "rounded-full px-3 py-1",
          className
        )}
      >
        {children}
      </ShadBadge>
    </motion.div>
  );
}