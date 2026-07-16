"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MessageCircle,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ThemeButton from "../global/ThemeButton";
import { SignOutButton } from "@clerk/nextjs";
import { mainLinks, SITE_NAME } from "@/config";
import Image from "next/image";
import { useUserStore } from "@/context";
export function PanelSidebar() {
    const [expanded, setExpanded] = useState(false);
    const pathname = usePathname();
    const { fullname, email } = useUserStore();

    return (
        <aside
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            className={cn(
                "group max-md:hidden relative flex h-screen flex-col border-r transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                "bg-sidebar shadow-md border-white/[0.07]",
                expanded ? "w-60" : "w-[72px]"
            )}
        >
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center border-b border-white/[0.07] px-4">
                <div
                    className={cn(
                        "flex relative shrink-0  items-center justify-center rounded-xl",
                        expanded ? "h-8 w-10" : "h-8 w-10 flex-1"
                    )}
                >
                    <Image src={"/logo.png"} fill alt={"Logo"} className="object-fit" />
                </div>

                <div
                    className={cn(
                        "ml-3 transition-all duration-200",
                        expanded
                            ? "opacity-100 translate-x-0 delay-[50ms]"
                            : "hidden -translate-x-2 pointer-events-none"
                    )}
                >
                    <p className="whitespace-nowrap text-sm font-medium">
                        {SITE_NAME}
                    </p>
                    <p className="whitespace-nowrap text-[11px] text-[#6a6690]">
                        Real-time Messaging
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-hidden px-3 py-3">
                {/* Section: Main */}
                <p
                    className={cn(
                        "mb-1.5 px-1 text-[10px] font-medium uppercase tracking-widest text-[#6a6690] transition-all duration-150 whitespace-nowrap",
                        expanded ? "opacity-100 delay-75" : "opacity-0"
                    )}
                >
                    Main
                </p>

                <div className="space-y-0.5">
                    {mainLinks.map((link) => {
                        const Icon = link.icon;
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "group/item relative flex h-10 place-items-center rounded-[10px] px-2.5 transition-all duration-150",
                                    active
                                        ? "bg-[#534AB7] text-white shadow-[0_2px_12px_rgba(83,74,183,0.4)]"
                                        : "text-[#9490b8] hover:bg-gray-200/50 dark:hover:bg-white/6 dark:hover:text-[#f0eeff]"
                                )}
                            >
                                {/* Active left bar */}
                                {active && (
                                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white/50" />
                                )}

                                <Icon className={cn("size-4.5 shrink-0", expanded ? "" : "flex-1")} />

                                <span
                                    className={cn(
                                        "ml-3 whitespace-nowrap text-[13.5px] transition-all duration-200",
                                        expanded
                                            ? "opacity-100 delay-[60ms]"
                                            : "opacity-0 hidden w-0 overflow-hidden"
                                    )}
                                >
                                    {link.label}
                                </span>

                                {/* {link?.badge && expanded && (
                                    <Badge
                                        className={cn(
                                            "ml-auto text-[11px] font-medium px-1.5 py-0 h-5 rounded-full border-0",
                                            active
                                                ? "bg-white/20 text-white"
                                                : "bg-[#7F77DD]/20 text-[#AFA9EC]"
                                        )}
                                    >
                                        {link.badge}
                                    </Badge>
                                )} */}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className="shrink-0 border-t border-white/[0.07] p-2.5 space-y-1.5">
                {/* User row */}
                <div className="flex items-center rounded-[10px] px-2 py-1.5 cursor-pointer hover:bg-white/[0.06] transition-colors overflow-hidden">
                    <div
                        className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-[9px] text-xs font-medium text-white",
                            "bg-gradient-to-br from-primary to-[#7F77DD] ring-1 ring-[#AFA9EC]/25"
                        )}
                    >
                        {fullname?.slice(0, 2)}
                    </div>
                    <div
                        className={cn(
                            "ml-2.5 transition-all duration-200 whitespace-nowrap",
                            expanded ? "opacity-100 delay-[60ms]" : "opacity-0 pointer-events-none"
                        )}
                    >
                        <p className="text-[13px] font-medium">{fullname}</p>
                        <p className="text-[11px] text-[#6a6690]">{email}</p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className={cn(`flex gap-1.5`, expanded ? "flex-row" : "flex-col")}>
                    <div className="flex-1 w-full">
                        <ThemeButton />
                    </div>
                    <SignOutButton redirectUrl="/sign-in">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="flex-1 shadow-md min-h-8 w-full rounded-lg bg-white/[0.05] hover:bg-[#A32D2D]/30 text-[#9490b8] hover:text-[#F09595] border-0"
                            title="Log out"
                        >
                            <LogOut className="size-4" />
                        </Button>
                    </SignOutButton>
                </div>
            </div>
        </aside>
    );
}