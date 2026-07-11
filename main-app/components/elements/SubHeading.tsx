"use client";

import { motion,HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props extends HTMLMotionProps<"p"> {
  animate?: boolean;
}

export default function SubHeading({
  animate = true,
  className,
  children,
  ...props
}: Props) {
  return (
    <motion.p
      initial={animate ? { opacity: 0, y: 15 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className={cn(
        "font-geist-sans",
        "text-primary font-medium tracking-wide uppercase",
        className
      )}
      {...props}
    >
      {children}
    </motion.p>
  );
}