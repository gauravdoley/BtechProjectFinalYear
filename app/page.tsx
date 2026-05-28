"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "./components/Hero";

export default function RootHeroPage() {
  const router = useRouter();

  // Ensure we clear out custom theme styles when on the landing page
  useEffect(() => {
    if (typeof document !== "undefined" && document.body) {
      document.body.className = "theme-teal"; // Default aesthetic theme
    }
  }, []);

  return (
    <main className="theme-teal">
      <Hero onStartLearning={() => router.push("/client")} />
    </main>
  );
}
