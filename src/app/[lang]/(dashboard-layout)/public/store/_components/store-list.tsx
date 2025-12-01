"use client"

import { AlertCircle, Loader2, ShoppingCart, Star } from "lucide-react"

import type { Course, CoursePagination, User } from "@/types/api"
import type { DictionaryType } from "@/lib/get-dictionary"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StoreListProps {
  dictionary: DictionaryType
  courses: Course[]
  pagination: CoursePagination | null
  loading: boolean
  error: string | null
  onPageChange: (page: number) => void
  onSortChange: (sortValue: string) => void
}

export function StoreList({
  dictionary,
  courses,
  pagination,
  loading,
  error,
  onPageChange,
  onSortChange,
}: StoreListProps) {
  const t = dictionary.storePage

  // Helper to get instructor name
  const getInstructorName = (instructor: string | User): string => {
    if (typeof instructor === "string") return "Instructor"
    return instructor.name || "Instructor"
  }

  // Helper to get student count
  const getStudentCount = (students?: string[] | User[]): number => {
    return students?.length || 0
  }

  return (
    <div className="w-full lg:w-3/4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <p className="text-sm text-muted-foreground">
          {pagination
            ? t.results
                .replace("{count}", courses.length.toString())
                .replace("{total}", pagination.total.toString())
            : "Loading..."}
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Label
            htmlFor="sort"
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            {t.sort.label}
          </Label>
          <Select defaultValue="popular" onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t.sort.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">{t.sort.options.popular}</SelectItem>
              <SelectItem value="rated">{t.sort.options.rated}</SelectItem>
              <SelectItem value="newest">{t.sort.options.newest}</SelectItem>
              <SelectItem value="price_asc">
                {t.sort.options.priceLowHigh}
              </SelectItem>
              <SelectItem value="price_desc">
                {t.sort.options.priceHighLow}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold mb-2">No courses found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && !error && courses.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="group overflow-hidden border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={
                      course.thumbnail ||
                      "https://placehold.co/600x400?text=Course+Image"
                    }
                    alt={course.title}
                  />
                  {course.price === 0 && (
                    <div className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border bg-green-500/20 text-green-300 border-green-500/30 rtl:left-auto rtl:right-3">
                      FREE
                    </div>
                  )}
                </div>
                <CardContent className="p-5 flex flex-col flex-grow">
                  <p className="text-sm text-muted-foreground mb-2">
                    {getInstructorName(course.instructor)}
                  </p>
                  <h3 className="text-lg font-bold leading-tight mb-3 flex-grow line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-foreground">
                      {course.rating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({getStudentCount(course.students).toLocaleString()})
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <p className="text-xl font-bold text-primary">
                      ${course.price.toFixed(2)}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-16">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        pagination.page > 1 && onPageChange(pagination.page - 1)
                      }}
                      className={
                        pagination.page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* First page */}
                  {pagination.page > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onPageChange(1)
                        }}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Ellipsis if needed */}
                  {pagination.page > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Previous page */}
                  {pagination.page > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onPageChange(pagination.page - 1)
                        }}
                        className="cursor-pointer"
                      >
                        {pagination.page - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Current page */}
                  <PaginationItem>
                    <PaginationLink href="#" isActive className="cursor-pointer">
                      {pagination.page}
                    </PaginationLink>
                  </PaginationItem>

                  {/* Next page */}
                  {pagination.page < pagination.totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onPageChange(pagination.page + 1)
                        }}
                        className="cursor-pointer"
                      >
                        {pagination.page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Ellipsis if needed */}
                  {pagination.page < pagination.totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Last page */}
                  {pagination.page < pagination.totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onPageChange(pagination.totalPages)
                        }}
                        className="cursor-pointer"
                      >
                        {pagination.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        pagination.page < pagination.totalPages &&
                          onPageChange(pagination.page + 1)
                      }}
                      className={
                        pagination.page === pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}
