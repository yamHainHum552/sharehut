import LandingHero from "@/components/landing/LandingHero";
import FeaturesSection from "@/components/landing/FeatureSection";
import FooterCTA from "@/components/landing/FooterCTA";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-white">
      <LandingHero />
      <FeaturesSection />
      <FooterCTA />
    </main>
  );
}
