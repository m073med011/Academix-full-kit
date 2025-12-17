import { DefaultImage } from "@/components/ui/defult-Image"

export function TrustedBySection() {
  const testimonials = [
    {
      name: "CURRICULUM COACH",
      role: "PRAISE CANADA",
      text: "I'm a teacher in New Mexico and my students love the platform! They find the content engaging and user-friendly.",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "PRAISE CANADA",
      role: "PRAISE CANADA",
      text: "I've been using the Academy Platform for a year now and I'm pleased with the progress I've made in my students.",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "SOCIAL",
      role: "SOCIAL STUDIES",
      text: "Their teachers was really supportive and ready to answer my questions at any point in my learning journey.",
      image: "https://i.pravatar.cc/150?img=8",
    },
  ]

  return (
    <section className="py-20 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] opacity-40"></div>
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-[100px] opacity-40"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Trusted by Educators & Learners
          </h2>
          <p className="text-gray-500 text-sm">
            Join thousands of satisfied teachers and students worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#13131a] rounded-2xl p-6 border border-gray-800 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 flex flex-col"
            >
              <DefaultImage
                src={testimonial.image}
                alt={testimonial.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover mb-4"
              />
              <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">
                {testimonial.text}
              </p>
              <div className="mt-auto">
                <h3 className="text-base font-semibold text-white mb-1">
                  {testimonial.name}
                </h3>
                <p className="text-xs text-purple-400 font-medium">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
