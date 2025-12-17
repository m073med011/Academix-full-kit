"use client"

import Link from "next/link"
import { FaPlay, FaUserPlus, FaRocket, FaChartLine, FaGraduationCap, FaBuilding, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { HiSparkles } from "react-icons/hi"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useCallback, useEffect, useState } from "react"

import { NeuralNetwork } from "./neural-network"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="hero-glow top-20 -left-40 hidden lg:block"></div>
      <div className="hero-glow top-40 right-0 opacity-50 hidden lg:block"></div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16 2xl:gap-20 items-center lg:min-h-0 lg:py-6 xl:py-2 2xl:py-2">

          {/* Dashboard - Mobile Order 1 (Top), Desktop Order 2 (Right) */}
          <div className="relative h-auto lg:h-[550px] xl:h-[600px] 2xl:h-[650px] dashboard-container order-1 lg:order-2 w-full flex items-center justify-center lg:block ">
            {/* Neural Network - Desktop only, positioned behind dashboard */}
            <div className="hidden lg:block">
              <NeuralNetwork />
            </div>

            {/* Main Dashboard Mockup - Centered on mobile, rotated on desktop */}
            <div className="relative lg:absolute lg:bottom-[-10%] lg:right-[-22%] xl:right-[-25%] w-[95%] xs:w-[90%] sm:w-[85%] md:w-[75%] lg:w-[82%] xl:w-[80%] mx-auto lg:mx-0 floating lg:floating-rotated z-10">
              <div className="gradient-border rounded-md xs:rounded-lg sm:rounded-xl md:rounded-2xl p-0.5">
                <div className="bg-dark-800 rounded-md xs:rounded-lg sm:rounded-xl md:rounded-2xl p-1 xs:p-1.5 sm:p-2 md:p-3 lg:p-4 mockup-shadow">
                  <div className="flex items-center space-x-0.5 xs:space-x-1 sm:space-x-1.5 md:space-x-2 mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 lg:mb-4">
                    <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                    <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-dark-700 rounded-sm xs:rounded-md sm:rounded-lg md:rounded-xl p-1 xs:p-1.5 sm:p-2 md:p-3 lg:p-4">
                    <div className="grid grid-cols-3 gap-0.5 xs:gap-1 sm:gap-2 md:gap-3 lg:gap-4 mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 lg:mb-4">
                      <div className="bg-dark-600 rounded-sm xs:rounded-md sm:rounded-lg p-0.5 xs:p-1 sm:p-1.5 md:p-2.5 lg:p-3">
                        <div className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-xs text-gray-400 mb-0.5 xs:mb-1">
                          Students
                        </div>
                        <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-base lg:text-lg xl:text-xl font-bold text-accent-cyan">
                          2,847
                        </div>
                      </div>
                      <div className="bg-dark-600 rounded-sm xs:rounded-md sm:rounded-lg p-0.5 xs:p-1 sm:p-1.5 md:p-2.5 lg:p-3">
                        <div className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-xs text-gray-400 mb-0.5 xs:mb-1">
                          Courses
                        </div>
                        <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-base lg:text-lg xl:text-xl font-bold text-accent-purple">
                          124
                        </div>
                      </div>
                      <div className="bg-dark-600 rounded-sm xs:rounded-md sm:rounded-lg p-0.5 xs:p-1 sm:p-1.5 md:p-2.5 lg:p-3">
                        <div className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-xs text-gray-400 mb-0.5 xs:mb-1">
                          Revenue
                        </div>
                        <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-base lg:text-lg xl:text-xl font-bold text-green-400">
                          $48.5K
                        </div>
                      </div>
                    </div>
                    <div className="bg-dark-600 rounded-sm xs:rounded-md sm:rounded-lg p-0.5 xs:p-1 sm:p-1.5 md:p-2.5 lg:p-3 mb-1 xs:mb-1.5 sm:mb-2 md:mb-3 lg:mb-4">
                      <div className="flex justify-between items-center mb-0.5 xs:mb-1 sm:mb-1.5 md:mb-2">
                        <span className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-xs lg:text-sm text-gray-400">
                          Monthly Growth
                        </span>
                        <span className="text-green-400 text-[6px] xs:text-[7px] sm:text-[8px] md:text-xs lg:text-sm font-semibold">+24%</span>
                      </div>
                      <div className="h-6 xs:h-8 sm:h-12 md:h-14 lg:h-16 xl:h-20 flex items-end space-x-0.5 xs:space-x-1 sm:space-x-1.5 md:space-x-2">
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-4 xs:h-5 sm:h-6 md:h-8"></div>
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-5 xs:h-6 sm:h-8 md:h-10 lg:h-12"></div>
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-4 xs:h-5 sm:h-7 md:h-9 lg:h-10"></div>
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-6 xs:h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16"></div>
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-5 xs:h-7 sm:h-9 md:h-11 lg:h-12 xl:h-14"></div>
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-6 xs:h-8 sm:h-12 md:h-14 lg:h-16 xl:h-20"></div>
                      </div>
                    </div>
                    {/* New Section - Recent Activity */}
                    <div className="bg-dark-600 rounded-sm xs:rounded-md sm:rounded-lg p-0.5 xs:p-1 sm:p-1.5 md:p-2.5 lg:p-3">
                      <div className="flex justify-between items-center mb-0.5 xs:mb-1 sm:mb-1.5 md:mb-2 lg:mb-3">
                        <span className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-xs lg:text-sm text-gray-400">
                          Recent Activity
                        </span>
                        <span className="text-[5px] xs:text-[6px] sm:text-[7px] md:text-[9px] lg:text-[10px] text-accent-cyan font-medium">
                          View All
                        </span>
                      </div>
                      <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5 md:space-y-2">
                        <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                          <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <FaUserPlus className="text-green-400 text-[4px] xs:text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-300 truncate block">
                              New student enrolled
                            </span>
                          </div>
                          <span className="text-[5px] xs:text-[6px] sm:text-[7px] md:text-[9px] lg:text-[10px] text-gray-500 flex-shrink-0">
                            2m
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                          <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                            <FaPlay className="text-accent-purple text-[4px] xs:text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs text-gray-300 truncate block">
                              Course completed
                            </span>
                          </div>
                          <span className="text-[5px] xs:text-[6px] sm:text-[7px] md:text-[9px] lg:text-[10px] text-gray-500 flex-shrink-0">
                            15m
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content - Mobile Order 2 (Middle), Desktop Order 1 (Left) */}
          <div className="relative z-10 pt-0 w-full order-2 lg:order-1 text-center lg:text-left px-2 xs:px-4 sm:px-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6">
              <HiSparkles className="text-cyan-400 text-[9px] xs:text-[10px] sm:text-xs md:text-sm" />
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-medium text-cyan-300">Next-Gen Learning Platform</span>
            </div>

            <h1 className="text-[1.35rem] leading-[1.2] xs:text-[1.5rem] xs:leading-tight sm:text-[1.75rem] sm:leading-tight md:text-3xl md:leading-tight lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 lg:mb-5">
              Welcome to <span className="gradient-text">ACADEMIX</span>
              <br className="hidden xs:block" />
              <span className="text-gray-300 block xs:inline"> Transform Your Learning Journey</span>
            </h1>

            <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-sm xl:text-base text-gray-400 mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-7 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 xs:px-0">
              The all-in-one education platform designed for teachers, students, freelancers, and organizations. Experience seamless course creation, interactive learning, and data-driven insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col xs:flex-row justify-center lg:justify-start gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 mb-4 xs:mb-5 sm:mb-6 md:mb-7 lg:mb-9 px-2 xs:px-0">
              <Link href="/en/sign-in" className="w-full xs:w-auto">
                <Button className="w-full xs:w-auto bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-3.5 rounded-lg font-semibold transition-all duration-300 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 text-[10px] xs:text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1.5 xs:gap-2">
                  <FaRocket className="text-[9px] xs:text-[10px] sm:text-xs" />
                  Start Learning Free
                </Button>
              </Link>
              <Button className="w-full xs:w-auto px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-3.5 rounded-lg font-semibold border-2 border-gray-600 hover:border-cyan-500/50 hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-purple-500/5 transition-all duration-300 text-white text-[10px] xs:text-[11px] sm:text-xs md:text-sm backdrop-blur-sm">
                View Pricing
              </Button>
            </div>

            {/* Feature Slider */}
            <div className="relative mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-7 max-w-xl mx-auto lg:mx-0">
              <div className="overflow-hidden px-6 xs:px-7 sm:px-0" ref={emblaRef}>
                <div className="flex -mx-1 xs:-mx-1.5 sm:mx-0">
                  {/* Slide 1 */}
                  <div className="flex-[0_0_100%] min-w-0 px-1 xs:px-1.5 sm:px-0">
                    <div className="flex items-start gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 p-2 xs:p-2.5 sm:p-3 md:p-4 rounded-lg xs:rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group shadow-lg shadow-cyan-500/5">
                      <div className="flex-shrink-0 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <FaChartLine className="text-cyan-400 text-xs xs:text-sm sm:text-base md:text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold text-gray-100 mb-0.5 xs:mb-1">Advanced Analytics</h3>
                        <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-400 leading-relaxed">Track progress with real-time dashboards and comprehensive reporting tools</p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 2 */}
                  <div className="flex-[0_0_100%] min-w-0 px-1 xs:px-1.5 sm:px-0">
                    <div className="flex items-start gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 p-2 xs:p-2.5 sm:p-3 md:p-4 rounded-lg xs:rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group shadow-lg shadow-purple-500/5">
                      <div className="flex-shrink-0 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <FaPlay className="text-purple-400 text-xs xs:text-sm sm:text-base md:text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold text-gray-100 mb-0.5 xs:mb-1">Interactive Content</h3>
                        <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-400 leading-relaxed">Engage learners with multimedia lessons, quizzes, and live sessions</p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 3 */}
                  <div className="flex-[0_0_100%] min-w-0 px-1 xs:px-1.5 sm:px-0">
                    <div className="flex items-start gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 p-2 xs:p-2.5 sm:p-3 md:p-4 rounded-lg xs:rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group shadow-lg shadow-blue-500/5">
                      <div className="flex-shrink-0 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <FaGraduationCap className="text-blue-400 text-xs xs:text-sm sm:text-base md:text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold text-gray-100 mb-0.5 xs:mb-1">Flexible Learning</h3>
                        <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-400 leading-relaxed">Access courses anytime, anywhere with mobile-optimized experience</p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 4 */}
                  <div className="flex-[0_0_100%] min-w-0 px-1 xs:px-1.5 sm:px-0">
                    <div className="flex items-start gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 p-2 xs:p-2.5 sm:p-3 md:p-4 rounded-lg xs:rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group shadow-lg shadow-green-500/5">
                      <div className="flex-shrink-0 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg xs:rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <FaBuilding className="text-green-400 text-xs xs:text-sm sm:text-base md:text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold text-gray-100 mb-0.5 xs:mb-1">Enterprise Ready</h3>
                        <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-400 leading-relaxed">Scale effortlessly with multi-tenant architecture and custom branding</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <Button
                onClick={scrollPrev}
                className="absolute left-0 xs:left-1 sm:left-0 top-1/2 -translate-y-1/2 w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-dark-800/90 backdrop-blur-sm border border-gray-600 hover:border-cyan-500 hover:bg-dark-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg z-10"
                aria-label="Previous slide"
              >
                <FaChevronLeft className="text-gray-400 hover:text-cyan-400 text-[9px] xs:text-[10px] sm:text-xs" />
              </Button>
              <Button
                onClick={scrollNext}
                className="absolute right-0 xs:right-1 sm:right-0 top-1/2 -translate-y-1/2 w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-dark-800/90 backdrop-blur-sm border border-gray-600 hover:border-cyan-500 hover:bg-dark-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg z-10"
                aria-label="Next slide"
              >
                <FaChevronRight className="text-gray-400 hover:text-cyan-400 text-[9px] xs:text-[10px] sm:text-xs" />
              </Button>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-1 xs:gap-1.5 sm:gap-2 mt-2.5 xs:mt-3 sm:mt-4">
                {scrollSnaps.map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={`h-0.5 xs:h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                      index === selectedIndex
                        ? "w-4 xs:w-5 sm:w-6 md:w-8 bg-gradient-to-r from-cyan-500 to-purple-500"
                        : "w-0.5 xs:w-1 sm:w-1.5 bg-gray-600 hover:bg-gray-500"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs">
                <div className="flex -space-x-1 xs:-space-x-1.5 sm:-space-x-2">
                  <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-dark-900 flex items-center justify-center text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] font-bold">A</div>
                  <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-dark-900 flex items-center justify-center text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] font-bold">B</div>
                  <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-dark-900 flex items-center justify-center text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] font-bold">C</div>
                </div>
                <span className="text-gray-400">
                  <strong className="text-cyan-400">50,000+</strong> educators
                </span>
              </div>
              <div className="hidden xs:block w-px h-2.5 xs:h-3 sm:h-4 bg-gray-600"></div>
              <div className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-400">
                <strong className="text-cyan-400">2M+</strong> learners worldwide
              </div>
            </div>
          </div>

          {/* Neural Network - Mobile only, positioned below all content */}
          <div className="lg:hidden order-3 w-full flex items-center justify-center py-12 xs:py-14 sm:py-16 md:py-20 overflow-hidden">
            <div className="w-full max-w-lg mx-auto px-6 xs:px-8">
              <NeuralNetwork />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 xs:bottom-5 sm:bottom-6 md:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 scroll-indicator hidden md:block">
        <div className="w-4 h-7 sm:w-5 sm:h-8 md:w-6 md:h-10 border-2 border-gray-600 rounded-full flex justify-center pt-1.5 sm:pt-2">
          <div className="w-0.5 h-1.5 sm:w-1 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}
