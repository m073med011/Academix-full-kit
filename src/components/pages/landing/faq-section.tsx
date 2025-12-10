"use client"

import { useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What is ACADEMY?SHADBOARD?",
      answer:
        "ACADEMY?SHADBOARD is a comprehensive learning management system designed for educators, students, and institutions. It provides tools for course creation, student management, assessments, and collaborative learning experiences.",
    },
    {
      question: "What does BYTEROVER Pro?",
      answer:
        "BYTEROVER Pro is our premium subscription tier that includes advanced features such as unlimited subjects, premium templates, analytics dashboard, priority support, and exclusive access to new features before general release.",
    },
    {
      question: "How do I get started?",
      answer:
        "Getting started is easy! Simply sign up for a free account, choose your role (teacher, student, or institution), and follow our guided onboarding process. You can upgrade to a paid plan at any time to unlock additional features.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We offer multiple support channels including email support, live chat during business hours, comprehensive documentation, video tutorials, and a community forum. Pro and Organization plan users receive priority support with faster response times.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won't be charged again. You can always resubscribe later if needed.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-purple-600/15 rounded-full blur-[100px] opacity-40"></div>
      <div className="absolute top-2/3 right-10 w-72 h-72 bg-cyan-600/15 rounded-full blur-[100px] opacity-40"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-sm">
            Find answers to common questions about our platform
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#13131a] rounded-xl border border-gray-800 overflow-hidden transition-all duration-300 hover:border-purple-500/30"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-[#1a1a24]"
              >
                <h3 className="text-base font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <FaChevronUp className="text-purple-400 flex-shrink-0 text-sm" />
                ) : (
                  <FaChevronDown className="text-gray-400 flex-shrink-0 text-sm" />
                )}
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
