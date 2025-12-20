import type { LocaleType } from "@/types"

import { getDictionary } from "@/lib/get-dictionary"
import { ensureLocalizedPathname } from "@/lib/i18n"

import {
  FloatingIconsHero,
  defaultHeroIcons,
} from "@/components/ui/floating-icons-hero-section"
import { ShaderBackgroundWrapper } from "@/components/ui/shader-background-wrapper"
import { LandingFooter } from "@/components/layout/landing-footer"
import { LandingHeader } from "@/components/layout/landing-header"

// New imports
import IntroAnimation from "@/components/ui/scroll-morph-hero"
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline"
import "../landing-animations.css"

const rolesData = [
  {
    id: 1,
    title: "Student",
    date: "Learning",
    content: "Embark on a personalized learning journey. Access world-class courses, track your growth with advanced analytics, and earn verified credentials that open doors.",
    category: "Learner",
    icon: "graduationCap",
    relatedIds: [2, 4], // Instructor, Freelancer
    status: "in-progress" as const,
    energy: 100,
    features: [
      "Curated AI Learning Paths",
      "Interactive Quizzes & Assignments",
      "Real-time Progress Tracking",
      "Blockchain-Verified Certificates"
    ]
  },
  {
    id: 2,
    title: "Instructor",
    date: "Teaching",
    content: "Transform your expertise into income. Build engaging courses, mentor students globally, and leverage powerful tools to manage your education business.",
    category: "Educator",
    icon: "users",
    relatedIds: [1, 5], // Student, Organizer
    status: "completed" as const,
    energy: 90,
    features: [
      "Advanced Course Creation Studio",
      "Detailed Student Analytics",
      "Automated Revenue Payouts",
      "Live Session Management"
    ]
  },
  {
    id: 3,
    title: "Admin",
    date: "System",
    content: "Maintain total control over your platform. Orchestrate user roles, oversee financial flows, and ensure system integrity with enterprise-grade tools.",
    category: "Operations",
    icon: "shield",
    relatedIds: [1, 2, 4, 5],
    status: "in-progress" as const,
    energy: 60,
    features: [
      "System-wide Analytics Dashboard",
      "User & Content Management",
      "Financial Oversight & Refunds",
      "Security & Audit Logs"
    ]
  },
  {
    id: 4,
    title: "Freelancer",
    date: "Working",
    content: "Monetize your skills on your own terms. Connect with clients, showcase your portfolio, and deliver projects via a seamless, secure workspace.",
    category: "Professional",
    icon: "briefcase",
    relatedIds: [1, 5],
    status: "pending" as const,
    energy: 85,
    features: [
      "Global Talent Marketplace",
      "Self-Branding Profile Tools",
      "Direct Client Messaging",
      "Secure Project Milestones"
    ]
  },
  {
    id: 5,
    title: "Organizer",
    date: "Events",
    content: "Empower your organization. Manage teams, assign private training, and track skill development across your entire workforce.",
    category: "Community",
    icon: "layout",
    relatedIds: [1, 2, 4],
    status: "completed" as const,
    energy: 75,
    features: [
      "Multi-level Team Management",
      "Private Course Library",
      "Role-Based Access Control",
      "Enterprise Performance Reports"
    ]
  },
];

export default async function LandingPage(props: {
  params: Promise<{ lang: string }>
}) {
  const params = (await props.params) as { lang: LocaleType }
  const dictionary = await getDictionary(params.lang)

  return (
    <div className="dark relative flex min-h-screen flex-col w-full text-foreground antialiased">
      {/* Fixed Shader Background */}
      <ShaderBackgroundWrapper />

      {/* Main Content */}
      <div className="relative z-10 w-full">
        <LandingHeader dictionary={dictionary} />

        <main className="flex-1 w-full">
          {/* Hero Section - FloatingIconsHero - Full Width */}
          <FloatingIconsHero
            title="A World of Innovation"
            subtitle="Explore a universe of possibilities with our platform, connecting you to the tools and technologies that shape the future."
            ctaText="Join the Revolution"
            ctaHref={ensureLocalizedPathname("/auth/register", params.lang)}
            icons={defaultHeroIcons}
          />
           
          {/* Scroll Morph Hero Section */}
          <section className="w-full relative z-20">
             <IntroAnimation />
          </section>

          {/* Radial Orbital Timeline Section */}
          <section className="w-full relative z-30">
            <RadialOrbitalTimeline timelineData={rolesData} />
          </section>

        </main>

        <LandingFooter dictionary={dictionary} />
      </div>
    </div>
  )
}
