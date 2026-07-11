import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";
import { geistSans, geistMono, inter } from "@/fonts";
import { SITE_NAME } from "@/config";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `${SITE_NAME} developed by om bhargav`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning    
      >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        </body>
    </html>
  );
}
