import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaVideo, FaMobileAlt, FaChartLine } from "react-icons/fa"

export function ComingSoonSection() {
  const features = [
    {
      title: "Live Integrations",
      description:
        "Soon we will be able to integrate live video calls, screen sharing, and interactive whiteboards into our platform.",
      icon: FaVideo,
    },
    {
      title: "Social Functions",
      description:
        "Connect with peers, share resources, and collaborate on projects seamlessly across all devices.",
      icon: FaMobileAlt,
    },
    {
      title: "Parent Specific tools",
      description:
        "Track progress, receive updates, and communicate with educators in real-time through dedicated tools.",
      icon: FaChartLine,
    },
  ]

  return (
    <section className="py-20 bg-[#0d0d12] relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Visual Object */}
          <div className="relative h-[500px] lg:h-[600px] dashboard-container flex items-center justify-center">
            {/* Dashboard Glow Effects */}
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-cyan-500/30 rounded-full blur-[80px] opacity-60"></div>
            <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-500/30 rounded-full blur-[90px] opacity-60"></div>
            <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-blue-500/20 rounded-full blur-[70px] opacity-50"></div>
            
            <div className="w-[85%] z-10 relative">
              <div className="gradient-border rounded-2xl p-1">
                <div className="bg-dark-800 rounded-2xl p-4 mockup-shadow">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-dark-700 rounded-xl p-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-dark-600 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">
                          Features
                        </div>
                        <div className="text-xl font-bold text-accent-cyan">
                          24
                        </div>
                      </div>
                      <div className="bg-dark-600 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">
                          Updates
                        </div>
                        <div className="text-xl font-bold text-accent-purple">
                          89
                        </div>
                      </div>
                      <div className="bg-dark-600 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">
                          Users
                        </div>
                        <div className="text-xl font-bold text-green-400">
                          5.2K
                        </div>
                      </div>
                    </div>
                    <div className="bg-dark-600 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">
                          Development Progress
                        </span>
                        <span className="text-green-400 text-sm">+65%</span>
                      </div>
                      <div className="h-20 flex items-end space-x-2">
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-8"></div>
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-12"></div>
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-10"></div>
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-16"></div>
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-14"></div>
                        <div className="flex-1 bg-gradient-to-t from-accent-purple to-accent-cyan rounded-t h-20"></div>
                      </div>
                    </div>
                    <div className="bg-dark-600 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-400">
                          Upcoming Features
                        </span>
                        <span className="text-[10px] text-accent-cyan">
                          View All
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <FaVideo className="text-purple-400 text-[8px]" />
                          </div>
                          <div className="flex-1">
                            <span className="text-xs text-gray-300">
                              Live Integration
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500">
                            Q1 2026
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <FaMobileAlt className="text-cyan-400 text-[8px]" />
                          </div>
                          <div className="flex-1">
                            <span className="text-xs text-gray-300">
                              Social Functions
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500">
                            Q2 2026
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                Coming Soon
              </h2>
              <p className="text-lg font-medium text-white mb-4">
                Future Innovations:
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-base font-semibold text-white mb-1">Live Integrations</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Soon we will be able to integrate live video calls, screen sharing, and interactive whiteboards into our platform.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-base font-semibold text-white mb-1">Social Functions</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Connect with peers, share resources, and collaborate on projects seamlessly across all devices.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-base font-semibold text-white mb-1">Parent Specific tools</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Track progress, receive updates, and communicate with educators in real-time through dedicated tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
