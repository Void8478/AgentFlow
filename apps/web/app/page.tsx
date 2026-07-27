"use client";

import React from "react";
import { AuroraBackground } from "@/components/landing/AuroraBackground";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { OpenSourceSection } from "@/components/landing/OpenSourceSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <AuroraBackground>
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />
        <ArchitectureSection />
        <HowItWorks />
        <OpenSourceSection />
      </main>
      <Footer />
    </AuroraBackground>
  );
}
