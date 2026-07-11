"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconProps {
  icon: LucideIcon;
  className?: string;
  animate?: boolean;
}

export default function Icon({
  icon: Icon,
  className,
  animate = true,
}: IconProps) {
  return (
    <motion.div
      initial={
        animate
          ? {
              opacity: 0,
              scale: 0.8,
            }
          : undefined
      }
      whileInView={
        animate
          ? {
              opacity: 1,
              scale: 1,
            }
          : undefined
      }
      viewport={{ once: true }}
      transition={{
        duration: 0.3,
      }}
    >
      <Icon
        className={cn(
          "size-5 text-primary",
          className
        )}
      />
    </motion.div>
  );
}