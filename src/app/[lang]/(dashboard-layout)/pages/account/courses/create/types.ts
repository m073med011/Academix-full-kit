export interface CourseFormData {
  // Basic Info
  title: string
  description: string
  categories: string[]
  targetAudience: "beginner" | "intermediate" | "advanced" | "expert"

  // Curriculum
  modules: CourseModule[]

  // Pricing
  enrollmentType: "free" | "subscription" | "one-time"
  price: number
  currency: string
  isPrivate: boolean
  hasEnrollmentCap: boolean
  maxStudents: number
  enrollmentStartDate?: string
  enrollmentEndDate?: string

  // Media
  thumbnailUrl?: string
  promoVideoUrl?: string
  brandColor: string
}

export interface CourseModule {
  id: string
  title: string
  isExpanded: boolean
  contents: CourseContent[]
}

export interface CourseContent {
  id: string
  type: "video" | "article" | "quiz" | "assignment"
  title: string
  status: "published" | "draft"
  duration?: string
  questions?: number
  dueDate?: string
}

export type WizardStep = 1 | 2 | 3 | 4 | 5

export const WIZARD_STEPS = {
  BASIC_INFO: 1,
  CURRICULUM: 2,
  PRICING: 3,
  MEDIA: 4,
  REVIEW: 5,
} as const

export const initialCourseFormData: CourseFormData = {
  title: "",
  description: "",
  categories: [],
  targetAudience: "beginner",
  modules: [],
  enrollmentType: "one-time",
  price: 0,
  currency: "USD",
  isPrivate: false,
  hasEnrollmentCap: false,
  maxStudents: 100,
  thumbnailUrl: undefined,
  promoVideoUrl: undefined,
  brandColor: "#137fec",
}
