import Link from "next/link"
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  CheckCircle2,
  Globe2,
  Layout,
  Lock,
  PieChart,
  Play,
  Settings,
  Zap,
} from "lucide-react"

import type { LocaleType } from "@/types"

import { getDictionary } from "@/lib/get-dictionary"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Iphone15Pro } from "@/components/ui/iphone-15-pro"
import { Safari } from "@/components/ui/safari"
import { LandingFooter } from "@/components/layout/landing-footer"
import { LandingHeader } from "@/components/layout/landing-header"

export default async function LandingPage(props: {
  params: Promise<{ lang: string }>
}) {
  const params = (await props.params) as { lang: LocaleType }
  const dictionary = await getDictionary(params.lang)

  return (
    <div className="flex min-h-screen flex-col mx-auto w-full bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
      <LandingHeader dictionary={dictionary} />

      <main className="flex-1 w-full overflow-hidden">
        {/* Hero Section */}
        <header className="container mx-auto px-4 py-16 md:py-24 md:pb-12 text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-balance">
            {dictionary.landingPage.hero.title}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-balance">
            {dictionary.landingPage.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold"
              asChild
            >
              <Link
                href={ensureLocalizedPathname("/auth/register", params.lang)}
              >
                {dictionary.landingPage.hero.startNow}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base font-semibold"
              asChild
            >
              <Link href="#features">
                {dictionary.landingPage.hero.learnMore}
              </Link>
            </Button>
          </div>

          <div className="relative mx-auto w-full max-w-5xl lg:mb-20">
            {/* Desktop Mockup */}
            <div className="hidden md:block relative w-full">
              <Safari
                imageSrc="/images/Screens/DashBoard.png"
                className="w-full h-full shadow-2xl rounded-xl border border-border/50"
              />
              {/* Glow effect */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-primary/20 blur-[100px] rounded-full opacity-50" />
            </div>

            {/* Mobile Mockup */}
            <div className="block md:hidden relative w-full max-w-[300px] mx-auto">
              <Iphone15Pro
                imageSrc="/images/misc/mobile.jpg" // Ensure this image exists or fallback will be used
                className="w-full h-auto shadow-2xl"
              />
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-primary/20 blur-[80px] rounded-full opacity-50" />
            </div>
          </div>
        </header>

        {/* Cross system enterprises */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {dictionary.landingPage.crossSystem.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {dictionary.landingPage.crossSystem.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-muted/30 border-none shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
              <div className="w-full h-40 bg-muted rounded-lg mb-6 flex items-center justify-center">
                <Layout className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold text-xl mb-2">
                {dictionary.landingPage.crossSystem.cards.content.title}
              </h3>
              <p className="text-muted-foreground">
                {dictionary.landingPage.crossSystem.cards.content.description}
              </p>
            </Card>
            <Card className="bg-muted/30 border-none shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
              <div className="mb-6 text-primary">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl mb-2">
                {dictionary.landingPage.crossSystem.cards.integration.title}
              </h3>
              <p className="text-muted-foreground mb-4 flex-1">
                {
                  dictionary.landingPage.crossSystem.cards.integration
                    .description
                }
              </p>
              <Link
                href="#"
                className="text-primary text-sm font-medium hover:underline inline-flex items-center"
              >
                {dictionary.landingPage.crossSystem.cards.integration.learnMore}{" "}
                <ArrowRight className="w-4 h-4 ml-1 rtl:rotate-180" />
              </Link>
            </Card>
            <Card className="bg-muted/30 border-none shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
              <div className="w-full h-40 bg-muted rounded-lg mb-6 flex items-center justify-center">
                <BarChart2 className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold text-xl mb-2">
                {dictionary.landingPage.crossSystem.cards.analytics.title}
              </h3>
              <p className="text-muted-foreground">
                {dictionary.landingPage.crossSystem.cards.analytics.description}
              </p>
            </Card>
            <Card className="bg-muted/30 border-none shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
              <div className="mb-6 text-primary">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl mb-2">
                {dictionary.landingPage.crossSystem.cards.management.title}
              </h3>
              <p className="text-muted-foreground">
                {
                  dictionary.landingPage.crossSystem.cards.management
                    .description
                }
              </p>
            </Card>
            <Card className="bg-muted/30 border-none shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
              <div className="w-full h-40 bg-muted rounded-lg mb-6 flex items-center justify-center">
                <Play className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold text-xl mb-2">
                {dictionary.landingPage.crossSystem.cards.media.title}
              </h3>
              <p className="text-muted-foreground">
                {dictionary.landingPage.crossSystem.cards.media.description}
              </p>
            </Card>
            <Card className="bg-muted/30 border-none shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full">
              <div className="mb-6 text-primary">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl mb-2">
                {dictionary.landingPage.crossSystem.cards.security.title}
              </h3>
              <p className="text-muted-foreground">
                {dictionary.landingPage.crossSystem.cards.security.description}
              </p>
            </Card>
          </div>
        </section>

        {/* ROI Section */}
        <section className="container mx-auto px-4 py-20 bg-muted/20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              {dictionary.landingPage.roi.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-full aspect-video bg-background border rounded-xl mb-6 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                <PieChart className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {dictionary.landingPage.roi.cards.intent.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dictionary.landingPage.roi.cards.intent.description}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-full aspect-video bg-background border rounded-xl mb-6 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                <Globe2 className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {dictionary.landingPage.roi.cards.gaps.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dictionary.landingPage.roi.cards.gaps.description}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-full aspect-video bg-background border rounded-xl mb-6 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                <BarChart2 className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {dictionary.landingPage.roi.cards.metrics.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dictionary.landingPage.roi.cards.metrics.description}
              </p>
            </div>
          </div>
        </section>

        {/* Analysis Section */}
        <section className="container mx-auto px-4 py-20 border-t">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              {dictionary.landingPage.analysis.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center px-4">
              <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">
                {dictionary.landingPage.analysis.cards.realtime.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                {dictionary.landingPage.analysis.cards.realtime.description}
              </p>
            </div>
            <div className="text-center px-4">
              <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">
                {dictionary.landingPage.analysis.cards.commitment.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                {dictionary.landingPage.analysis.cards.commitment.description}
              </p>
            </div>
            <div className="text-center px-4">
              <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">
                {dictionary.landingPage.analysis.cards.diverse.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                {dictionary.landingPage.analysis.cards.diverse.description}
              </p>
            </div>
          </div>
        </section>

        {/* Feature Split 1 */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-muted/30 rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="h-64 md:h-80 bg-background rounded-xl shadow-lg border flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-muted-foreground/20" />
              </div>
              <div>
                <span className="text-primary font-bold text-sm uppercase tracking-wider">
                  {dictionary.landingPage.featureSplit1.badge}
                </span>
                <h2 className="text-3xl font-bold mt-2 mb-4 leading-tight">
                  {dictionary.landingPage.featureSplit1.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {dictionary.landingPage.featureSplit1.description}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-background" />
                    <div className="w-8 h-8 rounded-full bg-muted-foreground/20 border-2 border-background" />
                    <div className="w-8 h-8 rounded-full bg-muted-foreground/40 border-2 border-background" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {dictionary.landingPage.featureSplit1.users}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Middle Feature */}
        <section className="container max-w-5xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-10">
            {dictionary.landingPage.interactive.title}
          </h2>
          <div className="w-full h-80 bg-muted/50 rounded-2xl mx-auto flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
            <Play className="w-20 h-20 text-muted-foreground/20" />
          </div>
        </section>

        {/* Feature Split 2 */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4">
                {dictionary.landingPage.featureSplit2.title}
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                {dictionary.landingPage.featureSplit2.description}
              </p>
              <Link
                href="#"
                className="text-primary font-semibold hover:underline inline-flex items-center"
              >
                {dictionary.landingPage.featureSplit2.learnMore}{" "}
                <ArrowRight className="ml-2 w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
            <div className="order-1 md:order-2 h-64 md:h-80 bg-muted/50 rounded-2xl flex items-center justify-center border">
              <Settings className="w-16 h-16 text-muted-foreground/20" />
            </div>
          </div>
        </section>

        {/* Promotive Section */}
        <section className="container max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {dictionary.landingPage.promotive.title}
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            {dictionary.landingPage.promotive.description}
          </p>
        </section>

        {/* New Feature Box */}
        <section className="container mx-auto px-4 py-16 mb-12">
          <div className="bg-primary/5 rounded-3xl p-8 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge
                  variant="outline"
                  className="mb-4 border-orange-500 text-orange-500"
                >
                  {dictionary.landingPage.authorTools.badge}
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  {dictionary.landingPage.authorTools.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed max-w-md">
                  {dictionary.landingPage.authorTools.description}
                </p>
                <Button variant="outline">
                  {dictionary.landingPage.authorTools.readMore}
                </Button>
              </div>
              <div className="h-48 md:h-64 bg-background rounded-xl border flex items-center justify-center shadow-lg">
                <BookOpen className="w-12 h-12 text-muted-foreground/20" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-20 px-4 mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {dictionary.landingPage.cta.title}
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg">
            {dictionary.landingPage.cta.description}
          </p>
          <Button
            size="lg"
            className="h-14 px-10 text-lg shadow-xl shadow-primary/20"
          >
            {dictionary.landingPage.cta.button}
          </Button>
        </section>
      </main>

      <LandingFooter dictionary={dictionary} />
    </div>
  )
}
