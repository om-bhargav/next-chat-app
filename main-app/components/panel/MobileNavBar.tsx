"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainLinks } from "@/config";

export default function MobileBottomBar() {
  const pathname = usePathname();
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center md:hidden">
      <div className="mx-4 flex w-full max-w-md items-center justify-between rounded-full border bg-background/90 p-2 shadow-2xl backdrop-blur-xl">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative flex flex-1 items-center justify-center transition-all duration-300"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-300",
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300",
                    active
                      ? "bg-primary-foreground/15"
                      : "group-hover:bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 transition-transform duration-300",
                      active && "scale-105"
                    )}
                  />
                </div>

                <span
                  className={cn(
                    "overflow-hidden text-sm font-medium transition-all duration-300",
                    active
                      ? "max-w-24 opacity-100"
                      : "max-w-0 opacity-0"
                  )}
                >
                  {link.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}