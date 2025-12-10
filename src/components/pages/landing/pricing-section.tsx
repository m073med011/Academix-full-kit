import { FaCheck } from "react-icons/fa"

import { Button } from "@/components/ui/button"

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      subtitle: "Best suited for with",
      price: "$29",
      period: "/mo",
      features: [
        "All Pro Features",
        "Limited Subjects",
        "Premium/Pro Features",
      ],
      buttonText: "Try Prototype for Teachers",
      buttonSubtext: "Try it now!",
      borderColor: "border-cyan-500/30",
      accentColor: "text-cyan-400",
      checkColor: "text-cyan-400",
      popular: false,
    },
    {
      name: "Pro",
      subtitle: "Business/Institutions and",
      price: "$89",
      period: "/mo",
      features: [
        "All Features",
        "5x Live Sessions",
        "Year Sessions",
        "3 Personal Tutors",
      ],
      buttonText: "Get Started",
      buttonSubtext: "Most Popular!",
      borderColor: "border-purple-500/50",
      accentColor: "text-purple-400",
      checkColor: "text-purple-400",
      popular: true,
    },
    {
      name: "Organization",
      subtitle: "For teams and businesses",
      price: "Contact Us",
      period: "",
      isContact: true,
      features: [
        "Unlimited Badges",
        "100x Sessions",
        "Yearbook Management",
        "Developer Support",
      ],
      buttonText: ">> Request/Demo/Quote/Consult",
      buttonSubtext: "Best Value!",
      borderColor: "border-gray-700",
      accentColor: "text-gray-300",
      checkColor: "text-gray-400",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-[#0d0d12] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Transparent Pricing
          </h2>
          <p className="text-gray-500 text-sm">
            Choose a suitable plan for you to achieve your aspirations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#13131a] rounded-2xl p-6 border ${plan.borderColor} transition-all duration-300 hover:-translate-y-1 relative`}
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-xs mb-4">{plan.subtitle}</p>
                <div className="flex items-baseline">
                  {plan.isContact ? (
                    <span className="text-xl font-semibold text-cyan-400">
                      {plan.price}
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-white">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-500 text-sm ml-1">
                          {plan.period}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <FaCheck className={`${plan.checkColor} text-xs`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <Button
                  className={`w-full py-3 rounded-lg text-sm font-medium transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white border-0"
                      : "bg-[#1a1a24] hover:bg-[#22222e] text-gray-300 border border-gray-700"
                  }`}
                >
                  {plan.buttonText}
                </Button>
                <p className="text-center text-xs text-gray-600">
                  {plan.buttonSubtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
