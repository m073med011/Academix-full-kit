import { FaCheckCircle } from "react-icons/fa"
import { Button } from "@/components/ui/button"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Cindy.A.Swift",
      role: "Career Support",
      content:
        "This app has a tremendous impact on education, we witnessed how it has transformed our students' learning performance over the years.",
      layout: "dark",
    },
    {
      name: "Drake Lulani",
      role: "Senior Product Designer",
      content:
        "The design quality, flexibility, and speed demonstrated by this platform is exceptional. We're genuinely thankful to be a part of this journey.",
      layout: "light",
    },
  ]

  const comingSoonFeatures = [
    { name: "AI Time Adaptation", verified: true },
    { name: "Java/Certifications", verified: false },
    { name: "Social Marketplace", verified: false },
  ]

  const faqs = [
    {
      question: "What is in a Learn/Subscription?",
      answer: "",
    },
    {
      question: "What is our premium/FMV?",
      answer: "",
    },
  ]

  return (
    <section className="py-16 bg-[#0d0d12] relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Trusted by <span className="text-cyan-400">Educators & Learners</span>
          </h2>
          <p className="text-gray-500 text-xs">
            Expertly curated by 100,000+ Verified Professors
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {/* Testimonial Cards - Side by Side */}
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`rounded-xl p-5 ${
                testimonial.layout === "dark"
                  ? "bg-[#13131a] border border-gray-800"
                  : "bg-[#1a1a24] border border-gray-700"
              }`}
            >
              <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-white">{testimonial.name}</h4>
                  <p className="text-[10px] text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Coming Soon Section */}
          <div className="bg-[#13131a] rounded-xl p-5 border border-gray-800">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Coming Soon</span>
            <h3 className="text-base font-semibold text-white mt-2 mb-4">Future Innovations</h3>
            
            <div className="space-y-2">
              {comingSoonFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FaCheckCircle 
                    className={`text-xs ${feature.verified ? "text-cyan-400" : "text-gray-600"}`} 
                  />
                  <span className={`text-xs ${feature.verified ? "text-gray-300" : "text-gray-500"}`}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <Button className="mt-5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors">
              Notify me
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-[#13131a] rounded-xl p-5 border border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">FAQs</h3>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
              >
                <span className="text-xs text-gray-300">{faq.question}</span>
                <span className="text-gray-600 text-sm">+</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
