"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  animate?: boolean;
  children: React.ReactNode;
} & HTMLMotionProps<"h1">;

const variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const motionComponents = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
};

export default function Heading({
  as = "h2",
  animate = true,
  className,
  children,
  ...props
}: HeadingProps) {
  const MotionComponent = motionComponents[as];

  return (
    <MotionComponent
      variants={variants}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className={cn(
        "font-geist-sans font-bold tracking-tight",
        {
          "text-5xl lg:text-6xl": as === "h1",
          "text-4xl lg:text-4xl": as === "h2",
          "text-3xl lg:text-3xl": as === "h3",
          "text-2xl lg:text-2xl": as === "h4",
          "text-xl lg:text-2xl": as === "h5",
          "text-lg lg:text-xl": as === "h6",
        },
        className
      )}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}