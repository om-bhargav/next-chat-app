"use client";
import Contact from "@/components/home/Contact";
import About from "@/components/home/About";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import Hero from "@/components/home/Hero";


export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <Hero />
      {/* FEATURES */}
      <Features />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* ABOUT */}
      <About />

      {/* CONTACT */}
      <Contact />
    </main>
  );
}