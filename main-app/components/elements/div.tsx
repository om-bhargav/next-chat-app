"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MotionDivProps extends HTMLMotionProps<"div"> {
    delay?: number;
    duration?: number;
    y?: number;
}

export default function Div({
    children,
    className,
    delay = 0,
    duration = 0.5,
    y = 20,
    ...props
}: MotionDivProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 40,
                scale: 0.96,
                filter: "blur(50px)",
            }}

            whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
            }}

            transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1], // smooth easeOutExpo-like
            }}

            viewport={{ once: true, amount: 0.15 }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}