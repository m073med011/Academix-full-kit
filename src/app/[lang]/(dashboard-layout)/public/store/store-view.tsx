"use client"

import { useState } from "react"

import type { CourseFilterParams } from "@/types/api"
import type { DictionaryType } from "@/lib/get-dictionary"

import { useCourses } from "@/hooks/use-courses"

import { StoreFilters } from "./_components/store-filters"
import { StoreHero } from "./_components/store-hero"
import { StoreList } from "./_components/store-list"

export function StoreView({ dictionary }: { dictionary: DictionaryType }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<CourseFilterParams>({
    page: 1,
    limit: 12,
  })

  const { courses, pagination, loading, error, setFilters: updateFilters } = useCourses(filters)

  const handleFilterChange = (newFilters: Partial<CourseFilterParams>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 } // Reset to page 1 on filter change
    setFilters(updatedFilters)
    updateFilters(updatedFilters)
  }

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page }
    setFilters(updatedFilters)
    updateFilters(updatedFilters)
  }

  const handleSortChange = (sortValue: string) => {
    // Sort is handled client-side for now, can be added to backend later
    console.log("Sort changed:", sortValue)
  }

  const handleClearFilters = () => {
    const clearedFilters = { page: 1, limit: 12 }
    setFilters(clearedFilters)
    updateFilters(clearedFilters)
  }

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
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            currentFilters={filters}
          />
          <StoreList
            dictionary={dictionary}
            courses={courses}
            pagination={pagination}
            loading={loading}
            error={error}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
    </div>
  )
}
