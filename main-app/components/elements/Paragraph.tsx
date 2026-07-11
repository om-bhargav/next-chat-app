"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props extends HTMLMotionProps<"p"> {
  animate?: boolean;
}

export default function Paragraph({
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
      transition={{
        duration: 0.5,
        delay: 0.1,
      }}
      className={cn(
        "font-sans",
        "text-muted-foreground leading-8 text-base md:text-sm",
        className
      )}
      {...props}
    >
      {children}
    </motion.p>
  );
}