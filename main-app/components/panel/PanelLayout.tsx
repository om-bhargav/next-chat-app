"use client";
import MobileBottomBar from "./MobileNavBar";
import { PanelSidebar } from "./PanelSidebar";


interface PanelLayoutProps {
    children: React.ReactNode;
}

export default function PanelLayout({
    children,
}: PanelLayoutProps) {

    return (
        <div className="flex h-screen overflow-hidden bg-sidebar">
            {/* Sidebar */}
            <PanelSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
            <MobileBottomBar />
        </div>
    );
}