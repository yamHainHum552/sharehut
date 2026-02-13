import LandingHero from "@/components/landing/LandingHero";
import FeaturesSection from "@/components/landing/FeatureSection";
import FooterCTA from "@/components/landing/FooterCTA";
import { cookies } from "next/headers";
export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <main className="relative min-h-screen bg-neutral-950 text-white">
      <LandingHero isLoggedIn={!!token} />
      <FeaturesSection />
      <FooterCTA />
    </main>
  );
}
