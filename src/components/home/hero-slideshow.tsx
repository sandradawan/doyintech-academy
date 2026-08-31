"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Dim rotating hero backgrounds.
 * Unsplash CDN (stable). Pinterest blocks hotlinking in production.
 */
const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80",
    alt: "Laptop with code on screen",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
    alt: "Developer workspace",
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80",
    alt: "Code on monitor",
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
    alt: "Students learning together",
  },
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80",
    alt: "Online learning setup",
  },
] as const;

const INTERVAL_MS = 5000;

export function HeroSlideshow({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
          style={{ backgroundImage: `url(${slide.src})` }}
          role="img"
          aria-label={slide.alt}
        />
      ))}
      <div className="absolute inset-0 bg-black/55 dark:bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/40" />
    </div>
  );
}
