"use client";

import { FaBolt, FaChartLine, FaChartPie, FaComments, FaCreditCard, FaShieldAlt, FaBell, FaTicketAlt, FaRoute, FaSitemap, FaTable, FaColumns, FaTasks, FaStickyNote } from "react-icons/fa";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

export function FeaturesSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
    },
    [Autoplay({ delay: 3500, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  // All features data
  const allFeatures = [
    {
      icon: <FaCreditCard className="text-accent-purple text-sm" />,
      bgGradient: "from-accent-purple/20 to-accent-cyan/20",
      borderColor: "border-accent-purple/30",
      title: "Flexible Subscriptions",
      subtitle: "& Billing",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Subscription Plans</span>
            <span className="text-[10px] text-accent-cyan">Manage</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-dark-700 rounded-lg p-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
                <span className="text-xs">Basic Plan</span>
              </div>
              <span className="text-accent-purple text-xs font-medium">$9/mo</span>
            </div>
            <div className="flex items-center justify-between bg-dark-700 rounded-lg p-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                <span className="text-xs">Pro Plan</span>
              </div>
              <span className="text-accent-cyan text-xs font-medium">$29/mo</span>
            </div>
            <div className="flex items-center justify-between bg-dark-700 rounded-lg p-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-pink"></div>
                <span className="text-xs">Enterprise</span>
              </div>
              <span className="text-accent-pink text-xs font-medium">$99/mo</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaComments className="text-accent-cyan text-sm" />,
      bgGradient: "from-accent-cyan/20 to-accent-blue/20",
      borderColor: "border-accent-cyan/30",
      title: "Private & Group",
      subtitle: "Chats",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-dark-700">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-pink-500 border-2 border-dark-900"></div>
              <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-dark-900"></div>
              <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-dark-900"></div>
            </div>
            <span className="text-xs text-gray-400">Python Study Group</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-pink-500 flex-shrink-0"></div>
              <div className="bg-dark-700 rounded-lg rounded-tl-none px-2.5 py-1.5">
                <p className="text-[10px] text-gray-300">Can someone explain recursion? 🤔</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex-shrink-0"></div>
              <div className="bg-dark-700 rounded-lg rounded-tl-none px-2.5 py-1.5">
                <p className="text-[10px] text-gray-300">Sure! It&apos;s when a function calls itself 💡</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-500 flex-shrink-0"></div>
              <div className="bg-dark-700 rounded-lg rounded-tl-none px-2.5 py-1.5">
                <p className="text-[10px] text-gray-300">Great explanation! 🎉</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaChartPie className="text-accent-pink text-sm" />,
      bgGradient: "from-accent-pink/20 to-accent-purple/20",
      borderColor: "border-accent-pink/30",
      title: "Personalized",
      subtitle: "Dashboards",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-dark-700 rounded-lg p-2">
              <div className="text-[10px] text-gray-500 mb-0.5">Students</div>
              <div className="text-sm font-bold text-accent-cyan">1,247</div>
            </div>
            <div className="bg-dark-700 rounded-lg p-2">
              <div className="text-[10px] text-gray-500 mb-0.5">Revenue</div>
              <div className="text-sm font-bold text-green-400">$24.5K</div>
            </div>
          </div>
          <div className="bg-dark-700 rounded-lg p-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-gray-400">Weekly Activity</span>
              <span className="text-[10px] text-green-400">+18%</span>
            </div>
            <div className="h-12 flex items-end gap-1">
              <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-purple/50 rounded-sm h-4"></div>
              <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-purple/50 rounded-sm h-7"></div>
              <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-purple/50 rounded-sm h-5"></div>
              <div className="flex-1 bg-gradient-to-t from-accent-cyan to-accent-cyan/50 rounded-sm h-10"></div>
              <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-purple/50 rounded-sm h-8"></div>
              <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-purple/50 rounded-sm h-6"></div>
              <div className="flex-1 bg-gradient-to-t from-accent-cyan to-accent-cyan/50 rounded-sm h-12"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaShieldAlt className="text-green-400 text-sm" />,
      bgGradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      title: "Secure Payments",
      subtitle: "Protected transactions",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            Bank-level encryption for all transactions. PCI DSS compliant payment processing.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <FaShieldAlt className="text-green-400 text-sm" />
            </div>
            <span className="text-xs text-green-400 font-medium">256-bit SSL</span>
          </div>
        </div>
      )
    },
    {
      icon: <FaBolt className="text-blue-400 text-sm" />,
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      title: "Payments",
      subtitle: "with Paystack",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <div>
              <span className="text-xs font-medium">Paystack</span>
              <p className="text-[10px] text-gray-500">Connected</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
      )
    },
    {
      icon: <FaChartLine className="text-orange-400 text-sm" />,
      bgGradient: "from-orange-500/20 to-yellow-500/20",
      borderColor: "border-orange-500/30",
      title: "Course Analytics",
      subtitle: "Track performance",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <p className="text-xs text-gray-400 leading-relaxed mb-3">
            Detailed insights on student engagement, completion rates, and revenue metrics.
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-dark-700 rounded p-1.5 text-center">
              <div className="text-xs font-bold text-orange-400">94%</div>
              <div className="text-[8px] text-gray-500">Completion</div>
            </div>
            <div className="bg-dark-700 rounded p-1.5 text-center">
              <div className="text-xs font-bold text-green-400">+32%</div>
              <div className="text-[8px] text-gray-500">Growth</div>
            </div>
            <div className="bg-dark-700 rounded p-1.5 text-center">
              <div className="text-xs font-bold text-cyan-400">4.8★</div>
              <div className="text-[8px] text-gray-500">Rating</div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaComments className="text-blue-400 text-sm" />,
      bgGradient: "from-blue-500/20 to-indigo-500/20",
      borderColor: "border-blue-500/30",
      title: "Real-time Chat",
      subtitle: "Instant messaging",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-dark-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
              <span className="text-xs text-gray-300">Sarah Wilson</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-start">
              <div className="bg-dark-700 rounded-xl rounded-tl-sm px-3 py-1.5 max-w-[80%]">
                <p className="text-[10px] text-gray-300">Hey! Did you finish the assignment?</p>
                <span className="text-[8px] text-gray-500">10:23 AM</span>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl rounded-tr-sm px-3 py-1.5 max-w-[80%]">
                <p className="text-[10px] text-white">Yes! Just submitted it 😊</p>
                <span className="text-[8px] text-blue-200">10:24 AM</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaBell className="text-purple-400 text-sm" />,
      bgGradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      title: "Notifications System",
      subtitle: "Stay updated",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Recent Notifications</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">3 new</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 bg-dark-700 rounded-lg p-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px]">📝</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-300 leading-tight">New assignment posted in Math 101</p>
                <span className="text-[8px] text-gray-500">5 mins ago</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1"></div>
            </div>
            <div className="flex items-start gap-2 bg-dark-700 rounded-lg p-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px]">💬</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-300 leading-tight">3 new messages from instructor</p>
                <span className="text-[8px] text-gray-500">1 hour ago</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-1"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaTicketAlt className="text-yellow-400 text-sm" />,
      bgGradient: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      title: "Coupons & Discounts",
      subtitle: "Special offers",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Active Coupons</span>
            <span className="text-[10px] text-accent-cyan">View all</span>
          </div>
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-yellow-400">SUMMER50</span>
                <span className="text-xs font-bold text-yellow-400">50% OFF</span>
              </div>
              <p className="text-[9px] text-gray-400">Valid until Aug 31, 2024</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-purple-400">STUDENT25</span>
                <span className="text-xs font-bold text-purple-400">25% OFF</span>
              </div>
              <p className="text-[9px] text-gray-400">For verified students only</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaRoute className="text-indigo-400 text-sm" />,
      bgGradient: "from-indigo-500/20 to-blue-500/20",
      borderColor: "border-indigo-500/30",
      title: "Learning Path",
      subtitle: "Structured progress",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Your Progress</span>
            <span className="text-[10px] text-green-400">60% Complete</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px]">✓</span>
              </div>
              <div className="flex-1 bg-dark-700 rounded-lg p-2">
                <p className="text-[10px] text-gray-300">Basics of Programming</p>
              </div>
            </div>
            <div className="ml-3 w-0.5 h-3 bg-green-500"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-indigo-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px]">2</span>
              </div>
              <div className="flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent border border-indigo-500/30 rounded-lg p-2">
                <p className="text-[10px] text-gray-300">Algorithms</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaSitemap className="text-teal-400 text-sm" />,
      bgGradient: "from-teal-500/20 to-green-500/20",
      borderColor: "border-teal-500/30",
      title: "Organization Management",
      subtitle: "All-in-one system",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">System Modules</span>
            <span className="text-[10px] text-teal-400">8 Active</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/30 rounded-lg p-2 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">📚</span>
              <span className="text-[9px] text-gray-300">Learning</span>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-lg p-2 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">💰</span>
              <span className="text-[9px] text-gray-300">Money</span>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-lg p-2 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">📊</span>
              <span className="text-[9px] text-gray-300">Dashboard</span>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-lg p-2 flex flex-col items-center justify-center">
              <span className="text-lg mb-1">⚙️</span>
              <span className="text-[9px] text-gray-300">Settings</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaTable className="text-emerald-400 text-sm" />,
      bgGradient: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30",
      title: "Transaction Table",
      subtitle: "Organized records",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-dark-700">
            <span className="text-[9px] text-gray-500 flex-1">Date</span>
            <span className="text-[9px] text-gray-500 flex-1">Type</span>
            <span className="text-[9px] text-gray-500 flex-1 text-right">Amount</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 bg-dark-700 rounded p-1.5">
              <span className="text-[9px] text-gray-400 flex-1">Dec 08</span>
              <span className="text-[9px] text-gray-300 flex-1">Course</span>
              <span className="text-[9px] text-green-400 flex-1 text-right font-medium">+$49</span>
            </div>
            <div className="flex items-center gap-2 bg-dark-700 rounded p-1.5">
              <span className="text-[9px] text-gray-400 flex-1">Dec 07</span>
              <span className="text-[9px] text-gray-300 flex-1">Subscription</span>
              <span className="text-[9px] text-green-400 flex-1 text-right font-medium">+$29</span>
            </div>
            <div className="flex items-center gap-2 bg-dark-700 rounded p-1.5">
              <span className="text-[9px] text-gray-400 flex-1">Dec 06</span>
              <span className="text-[9px] text-gray-300 flex-1">Refund</span>
              <span className="text-[9px] text-red-400 flex-1 text-right font-medium">-$15</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaColumns className="text-violet-400 text-sm" />,
      bgGradient: "from-violet-500/20 to-purple-500/20",
      borderColor: "border-violet-500/30",
      title: "Kanban Board",
      subtitle: "Visual workflow",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex gap-2">
            <div className="flex-1 min-w-[60px]">
              <div className="bg-gray-700/30 rounded-t px-2 py-1 mb-1">
                <span className="text-[9px] text-gray-400">To Do</span>
              </div>
              <div className="bg-dark-700 rounded p-1.5 border-l-2 border-blue-500">
                <p className="text-[8px] text-gray-300">Design UI</p>
              </div>
            </div>
            <div className="flex-1 min-w-[60px]">
              <div className="bg-yellow-700/30 rounded-t px-2 py-1 mb-1">
                <span className="text-[9px] text-yellow-400">Doing</span>
              </div>
              <div className="bg-dark-700 rounded p-1.5 border-l-2 border-yellow-500">
                <p className="text-[8px] text-gray-300">API Dev</p>
              </div>
            </div>
            <div className="flex-1 min-w-[60px]">
              <div className="bg-green-700/30 rounded-t px-2 py-1 mb-1">
                <span className="text-[9px] text-green-400">Done</span>
              </div>
              <div className="bg-dark-700 rounded p-1.5 border-l-2 border-green-500">
                <p className="text-[8px] text-gray-300">Setup</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaTasks className="text-rose-400 text-sm" />,
      bgGradient: "from-rose-500/20 to-pink-500/20",
      borderColor: "border-rose-500/30",
      title: "Task List",
      subtitle: "Stay organized",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Today&apos;s Tasks</span>
            <span className="text-[10px] text-rose-400">2/4</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-dark-700 rounded-lg p-2">
              <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px]">✓</span>
              </div>
              <p className="text-[10px] text-gray-400 line-through flex-1">Complete assignment</p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/30 rounded-lg p-2">
              <div className="w-4 h-4 rounded border-2 border-rose-500 flex-shrink-0"></div>
              <p className="text-[10px] text-gray-300 flex-1">Prepare presentation</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <FaStickyNote className="text-amber-400 text-sm" />,
      bgGradient: "from-amber-500/20 to-yellow-500/20",
      borderColor: "border-amber-500/30",
      title: "Notes",
      subtitle: "Quick capture",
      content: (
        <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Recent Notes</span>
            <span className="text-[10px] text-amber-400">+ New</span>
          </div>
          <div className="space-y-2">
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border-l-4 border-amber-500 rounded-r-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-gray-300">Math formulas</span>
                <span className="text-[8px] text-gray-500">2h ago</span>
              </div>
              <p className="text-[9px] text-gray-400 leading-tight">Quadratic equation: ax² + bx + c = 0...</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border-l-4 border-blue-500 rounded-r-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-gray-300">Meeting ideas</span>
                <span className="text-[8px] text-gray-500">1d ago</span>
              </div>
              <p className="text-[9px] text-gray-400 leading-tight">Discuss new features...</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-gray-400 text-sm">Discover all the powerful features that make our platform exceptional</p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {allFeatures.map((feature, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.333%] px-2.5">
                  <div className="bg-dark-800 rounded-2xl p-5 border border-dark-600 card-hover h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${feature.bgGradient} border ${feature.borderColor} flex items-center justify-center`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{feature.title}</h3>
                        <p className="text-xs text-gray-500">{feature.subtitle}</p>
                      </div>
                    </div>
                    {feature.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex 
                    ? "bg-accent-cyan w-8" 
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
