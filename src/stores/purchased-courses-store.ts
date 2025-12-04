import { courseService } from "@/services/course-service"
import { toast } from "sonner"
import { create } from "zustand"

import type { Course } from "@/types/api"

interface PurchasedCoursesStore {
  courses: Course[]
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  // Actions
  initializePurchasedCourses: () => Promise<void>
  refreshPurchasedCourses: () => Promise<void>
  isPurchased: (courseId: string) => boolean
  getPurchasedCourseIds: () => string[]
}

export const usePurchasedCoursesStore = create<PurchasedCoursesStore>(
  (set, get) => ({
    courses: [],
    isLoading: false,
    isInitialized: false,
    error: null,

    initializePurchasedCourses: async () => {
      if (get().isInitialized) return

      try {
        set({ isLoading: true, error: null })
        const courses = await courseService.getPurchasedCourses()
        console.log("Purchased courses initialized:", courses)
        set({ courses, isInitialized: true })
      } catch (error) {
        console.error("Failed to initialize purchased courses:", error)
        set({
          courses: [],
          isInitialized: true,
          error: "Failed to load purchased courses",
        })
      } finally {
        set({ isLoading: false })
      }
    },

    refreshPurchasedCourses: async () => {
      try {
        set({ isLoading: true, error: null })
        const courses = await courseService.getPurchasedCourses()
        console.log("Purchased courses refreshed:", courses.length)
        set({ courses })
      } catch (error) {
        console.error("Failed to refresh purchased courses:", error)
        set({ error: "Failed to refresh purchased courses" })
        toast.error("Failed to refresh purchased courses")
      } finally {
        set({ isLoading: false })
      }
    },

    isPurchased: (courseId: string) => {
      const courses = get().courses
      return courses.some((course) => course._id === courseId)
    },

    getPurchasedCourseIds: () => {
      return get().courses.map((course) => course._id)
    },
  })
)
