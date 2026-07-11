"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button as ShadButton } from "@/components/ui/button";

interface Props
  extends React.ComponentProps<typeof ShadButton> {
  animate?: boolean;
}
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
export default function Button({
  animate = true,
  children,
  ...props
}: Props) {
  return (
    <motion.div
      whileHover={
        animate
          ? {
            y: -1,
          }
          : undefined
      }
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}

      whileTap={
        animate
          ? {
            scale: 0.98,
          }
          : undefined
      }
      variants={variants}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
    >
      <ShadButton
        {...props}
        className={[
          "font-geist-sans font-medium",
          props.className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </ShadButton>
    </motion.div>
  );
}