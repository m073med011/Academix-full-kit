"use client"

import { useState } from "react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { StoreFilters } from "./_components/store-filters"
import { StoreHero } from "./_components/store-hero"
import { StoreList } from "./_components/store-list"

// Mock Data
const products = [
  {
    id: 1,
    title: "Introduction to Web Development",
    instructor: "John Doe",
    rating: 4.7,
    reviews: 1250,
    price: 49.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYTR1W6cZ0DHqiXLqN9DdfEu-vzFwlEzYh7j-JCRiwa7pYShMFIClGbgkrUGD-Tnd1GzIMR0jKva6ygDiG4vKIUd-tFog1BGgjf2z_hlgvavwpW3k8BrrKJxuSxhXvdryNhJ13BQbeHrIWlvSq6vv6K1aZOm9yklHFrHj9W2ro0SdpnPLKECwHT2oSpiRk2V5EEnR-D44xR-cP11Y-ut1Om72eWy8fvsF7CZwe3cj6KMfw7l0FGfI92AWzRZlar0fMiJoh9cqWC0s",
    tag: "new",
    tagColor: "bg-green-500/20 text-green-300 border-green-500/30",
  },
  {
    id: 2,
    title: "Data Science with Python",
    instructor: "Jane Smith",
    rating: 4.9,
    reviews: 5830,
    price: 89.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMvcdczWLBPxN5zPl6n7zdnOqjzatXnE-H9cl9XSclcivmNp48-XkT3nQ7-A2bg3NVv7twK2NeDJCnLysvBOIfTwbFuLM3nj_uv7WcSp-mBulGpo19wfnefnOylaGpZz5lOOTfxu6J_UYdY-oyBuy-aUrs-BUP0SdaGg3I1hFl33zgB1WQyJwLVRav3ZLQs5fbaS62hj2rjH89MXBDpil9VsmZcu7JG14B_Jlc-BpWaPP9swqp6II7HfGitkbEgedKc0niJT9z9Y4",
    tag: "bestseller",
    tagColor: "bg-primary/20 text-primary border-primary/30",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    instructor: "Alex Johnson",
    rating: 4.8,
    reviews: 2115,
    price: 79.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9JlevSYZXb996CQYyje-5BOX2KkIV52aXvVWAMDFa8-WN4_R-lBe23JQPEjiPh1ApMXFEsVtc0zBMmTEhdpvEvyr7f1UyABU3J75VvXDaaNOlTvaxBQ2LgRYyOzeyR6Fq8_LlM08m13G09Kv4RnLLI4Lkz2BmAr3904O6BsAuOa3h_Zte_QzDg-aTZ-tPOe1ZZuO2TENy_WLpGniiYroE5ILmHcrQlocPkwpiYvehfSIzNYQ2r8D8GGhFjgyepp5OD84QUH69zCc",
  },
  {
    id: 4,
    title: "Digital Marketing Masterclass",
    instructor: "Emily White",
    rating: 4.6,
    reviews: 980,
    price: 69.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTFtbsP2uwuEpML1DKhg7djp-t7EZ3vRyCasg1DP8clm-6im6m_YPKKRQbYDpSdvCoj6H15bVSUhVY7hAC0rjVcxJi4f5UWNT77tEaJowu1cOwgOV8kO4rA97Hv18MvHaiU9e_iRWd5pCK_12lIckk68nNWDKnK9vueop8q_b4JoA1jCdd3Ws7pnkb_jbDFAsloXIstxDd3JpCv3DiQRwi_SCb_YlnK3nnsVubseUV490pf5vELHks4J2HlJx3wLayJ-_bQFkpnrY",
  },
  {
    id: 5,
    title: "Advanced JavaScript Concepts",
    instructor: "Michael Brown",
    rating: 4.9,
    reviews: 3450,
    price: 99.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAP8xbyyypryAsrsvSrohHhMrYX31q5GqkNbTtsO_oIfBLfLadCeMTIDbvKTJykXGBpjJ7J-fmNJSQiaC47afCXUX-O-LKJJMdYnfZyyN0JWSZrYcLG-Z0vEWdDh_BqnbwvUskP_MncbBHjQh4dXUZEFaagT5KddXLMxXu3PNxqs2Vpv0y4GNmzGOI-8S4QJRWSsbVDEU5o5oG_kOm5AkIYFaas-DLlgnYUy23PfQ6_JjM6Zwj8N-O7HftnQdp43QGPRWYZIAHscM8",
  },
  {
    id: 6,
    title: "Project Management Professional (PMP)",
    instructor: "Sarah Davis",
    rating: 4.7,
    reviews: 1890,
    price: 129.99,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCo3Y1HhfR4l5y7tqOEeVC560QA7DNnbniF393s_hz0kcoHtA__bswuUZxWiOFaISHonaRFI-hFDqR0fF5JeifkZg_q4_tLD_ZNSt_ZfBEj_Y2nKh-OSRjl6jrtB3LHD6sR7KEtTQ89qoYjmwWGu_cVqSdVkXB-43RnuMqQugxCs_uoy04MYCtdqlRniT6-2b0QVDarhCJ0330jV1sxToEZJzX6ISNHGGdjnEtSVJVzs1Bm666kqkYtNVvjxFoUVivoA1vEvDptILM",
  },
]

export function StoreView({ dictionary }: { dictionary: DictionaryType }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <StoreHero dictionary={dictionary} />

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <StoreFilters
            dictionary={dictionary}
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
          />
          <StoreList dictionary={dictionary} products={products} />
        </div>
      </div>
    </div>
  )
}
