"use client";

import { useEffect } from "react";
import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    const { setTheme } = useTheme();
    useEffect(() => {
        setTheme("dark");
    }, []);
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}