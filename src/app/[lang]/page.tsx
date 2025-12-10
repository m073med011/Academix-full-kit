import { FeaturesSection } from "@/components/pages/landing/features-section"
import { FooterSection } from "@/components/pages/landing/footer-section"
import { HeroSection } from "@/components/pages/landing/hero-section"
import { PricingSection } from "@/components/pages/landing/pricing-section"
import { TrustedBySection } from "@/components/pages/landing/trusted-by-section"
import { ComingSoonSection } from "@/components/pages/landing/coming-soon-section"
import { FAQSection } from "@/components/pages/landing/faq-section"
import "./landing.css"

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white overflow-x-hidden font-sans">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TrustedBySection />
      <ComingSoonSection />
      <FAQSection />
      <FooterSection />
      
    </div>
  )
}
