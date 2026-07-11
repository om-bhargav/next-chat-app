"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../elements/Button";

export default function ThemeButton() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="flex-1! w-full! shadow-md min-h-8 rounded-lg bg-white/[0.05] border-0"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="flex-1! w-full! min-h-8 rounded-lg shadow-md bg-white/[0.05] dark:hover:bg-white/[0.1] text-[#9490b8] hover:text-[#f0eeff] border-0"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title="Toggle theme"
    >
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}