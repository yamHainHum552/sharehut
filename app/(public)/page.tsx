import LandingHero from "@/components/landing/LandingHero";
import FeaturesSection from "@/components/landing/FeatureSection";
import FooterCTA from "@/components/landing/FooterCTA";
import { cookies } from "next/headers";
import CookieBanner from "@/components/landing/CookieBanner";
import QuickStart from "@/components/landing/QuickStart";
import TestimonialsSection from "@/components/landing/Testimonials";
import BrandStatsSection from "@/components/landing/BrandStaticSection";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isLoggedIn = !!token;

  return (
    <main className="relative min-h-screen bg-neutral-950 text-white">
      <LandingHero isLoggedIn={isLoggedIn} />

      {/* 👇 Only show QuickStart if NOT logged in */}
      {!isLoggedIn && <QuickStart />}
      <BrandStatsSection />

      <FeaturesSection />
      <TestimonialsSection />
      <FooterCTA />
      <CookieBanner />
    </main>
  );
}
