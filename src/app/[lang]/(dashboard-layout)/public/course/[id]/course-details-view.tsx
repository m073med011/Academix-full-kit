"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCartStore } from "@/stores/cart-store"
import { usePurchasedCoursesStore } from "@/stores/purchased-courses-store"
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Globe,
  Heart,
  Play,
  Share2,
  ShoppingCart,
  Smartphone,
  Star,
  Trophy,
  Users,
  Video,
} from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"
import type { Course, User } from "@/types/api"

import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CourseDetailsViewProps {
  dictionary: DictionaryType
  course: Course
  courseId: string
}

export function CourseDetailsView({
  dictionary: _dictionary,
  course,
  courseId: _courseId,
}: CourseDetailsViewProps) {
  const params = useParams()
  const router = useRouter()
  const locale = params.lang as LocaleType
  const { toast } = useToast()

  // Cart and purchased courses state
  const addToCart = useCartStore((state) => state.addToCart)
  const cart = useCartStore((state) => state.cart)
  const initializeCart = useCartStore((state) => state.initializeCart)
  const purchasedCourses = usePurchasedCoursesStore((state) => state.courses)
  const initializePurchasedCourses = usePurchasedCoursesStore(
    (state) => state.initializePurchasedCourses
  )

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoadingStores, setIsLoadingStores] = useState(true)

  // Initialize stores on mount
  useEffect(() => {
    const initStores = async () => {
      try {
        await Promise.all([initializeCart(), initializePurchasedCourses()])
      } catch (error) {
        console.error("Failed to initialize stores:", error)
      } finally {
        setIsLoadingStores(false)
      }
    }
    initStores()
  }, [initializeCart, initializePurchasedCourses])

  // Check if course is already purchased or in cart (reactive)
  const courseAlreadyPurchased = purchasedCourses.some(
    (c) => c._id === course._id
  )
  const courseInCart =
    cart?.items.some((item) =>
      typeof item.courseId === "string"
        ? item.courseId === course._id
        : item.courseId._id === course._id
    ) ?? false

  // Helper to get instructor name
  const getInstructorName = (
    instructor: string | User | null | undefined
  ): string => {
    if (!instructor) return "Unknown Instructor"
    if (typeof instructor === "string") return "Instructor"
    return instructor.name || "Unknown Instructor"
  }

  // Helper to get student count
  const getStudentCount = (students?: string[] | User[]): number => {
    return students?.length || 0
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(course._id)
      // Toast is already shown by the cart store
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to add course to cart",
        variant: "destructive",
      })
    }
  }

  const handleEnrollNow = async () => {
    try {
      // Add to cart and redirect to checkout
      await addToCart(course._id)
      router.push(`/${locale}/checkout`)
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to add course to cart",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: course.description,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Course link has been copied to clipboard",
      })
    }
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted
        ? `${course.title} has been removed from your wishlist`
        : `${course.title} has been added to your wishlist`,
    })
  }

  // Parse what you'll learn from description (for demo purposes)
  const learningPoints = [
    "Foundational principles of the subject",
    "Hands-on practical exercises and projects",
    "Industry best practices and standards",
    "Real-world application techniques",
    "Advanced concepts and methodologies",
    "Tools and technologies used by professionals",
  ]

  const prerequisites = [
    "Basic understanding of fundamental concepts",
    "Access to a computer with internet connection",
    "Willingness to learn and practice regularly",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link
              href={`/${locale}/store`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Catalog
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link
              href={`/${locale}/store?category=${course.category}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {course.category}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {course.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-muted-foreground">
                    ({getStudentCount(course.students).toLocaleString()}{" "}
                    students)
                  </span>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {course.level}
                </Badge>
                <Badge variant="outline">{course.category}</Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration} hours</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-semibold">
                    {getInstructorName(course.instructor)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* What you'll learn */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">
                      What you&apos;ll learn
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {learningPoints.map((point, index) => (
                        <div key={index} className="flex gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{point}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Prerequisites */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Prerequisites</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {prerequisites.map((prereq, index) => (
                        <li key={index} className="flex gap-3">
                          <ChevronRight className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Course Description */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">
                      Course Description
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      This comprehensive course is designed to take you from the
                      fundamentals to advanced concepts in {course.category}.
                      Through a combination of video lectures, hands-on
                      projects, and practical exercises, you&apos;ll gain the
                      skills and knowledge needed to excel in this field.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Course Content</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.materials?.length || 0} sections •{" "}
                      {course.duration} hours total length
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((section) => (
                        <div
                          key={section}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">
                              Section {section}: Module Title
                            </h4>
                            <span className="text-sm text-muted-foreground">
                              {Math.round(course.duration / 5)} hours
                            </span>
                          </div>
                          <div className="space-y-2">
                            {[1, 2, 3].map((lesson) => (
                              <div
                                key={lesson}
                                className="flex items-center gap-3 text-sm text-muted-foreground"
                              >
                                {lesson === 1 ? (
                                  <Video className="h-4 w-4" />
                                ) : (
                                  <FileText className="h-4 w-4" />
                                )}
                                <span>Lesson {lesson}: Topic Name</span>
                                <span className="ml-auto">
                                  {lesson === 1 ? "15:30" : "Reading"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">
                      About the Instructor
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-12 w-12 text-primary" />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-lg font-semibold">
                            {getInstructorName(course.instructor)}
                          </h4>
                          <p className="text-sm text-primary">
                            Expert {course.category} Instructor
                          </p>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          With over 10 years of experience in {course.category},
                          our instructor brings real-world expertise and
                          practical knowledge to help you master the subject.
                          They have taught thousands of students and are
                          passionate about sharing their knowledge.
                        </p>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <p className="font-semibold">
                              {getStudentCount(
                                course.students
                              ).toLocaleString()}
                            </p>
                            <p className="text-muted-foreground">Students</p>
                          </div>
                          <div>
                            <p className="font-semibold">
                              {course.rating?.toFixed(1) || "0.0"}
                            </p>
                            <p className="text-muted-foreground">Rating</p>
                          </div>
                          <div>
                            <p className="font-semibold">1</p>
                            <p className="text-muted-foreground">Courses</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Student Reviews</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-4xl font-bold">
                            {course.rating?.toFixed(1) || "0.0"}
                          </p>
                          <div className="flex gap-0.5 my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.round(course.rating || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getStudentCount(course.students)} ratings
                          </p>
                        </div>
                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <span className="text-sm w-3">{rating}</span>
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400"
                                  style={{
                                    width: `${rating === 5 ? 60 : rating === 4 ? 25 : rating === 3 ? 10 : rating === 2 ? 3 : 2}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-10 text-right">
                                {rating === 5
                                  ? "60"
                                  : rating === 4
                                    ? "25"
                                    : rating === 3
                                      ? "10"
                                      : rating === 2
                                        ? "3"
                                        : "2"}
                                %
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Sample Reviews */}
                      <div className="space-y-4">
                        {[1, 2, 3].map((review) => (
                          <div key={review} className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold">Student Name</p>
                                  <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  2 weeks ago
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Excellent course! The instructor explains
                                  concepts clearly and the practical exercises
                                  really helped me understand the material.
                                  Highly recommended for anyone looking to learn{" "}
                                  {course.category}.
                                </p>
                              </div>
                            </div>
                            {review < 3 && <Separator />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Course Preview Card */}
              <Card className="overflow-hidden">
                {/* Video Preview */}
                <div className="relative aspect-video bg-muted">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                      <Play className="h-16 w-16 text-primary/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="gap-2"
                      onClick={() => {
                        toast({
                          title: "Preview not available",
                          description: "Course preview will be available soon",
                        })
                      }}
                    >
                      <Play className="h-5 w-5" />
                      Preview Course
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold">
                      ${course.price.toFixed(2)}
                    </span>
                    {course.price > 99 && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${(course.price * 1.5).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {courseAlreadyPurchased ? (
                      // Already purchased - show "Go to Course"
                      <>
                        <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            You own this course
                          </span>
                        </div>
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={() => router.push(`/${locale}/courses/user/purchased`)}
                        >
                          Go to Course
                        </Button>
                      </>
                    ) : courseInCart ? (
                      // Already in cart - show "Go to Cart" and remove option
                      <>
                        <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Already in your cart
                          </span>
                        </div>
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={() => router.push(`/${locale}/cart`)}
                        >
                          Go to Cart
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full"
                          onClick={() => router.push(`/${locale}/checkout`)}
                        >
                          Checkout Now
                        </Button>
                      </>
                    ) : (
                      // Not purchased and not in cart - show normal buttons
                      <>
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={handleEnrollNow}
                          disabled={isLoadingStores}
                        >
                          Enroll Now
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full gap-2"
                          onClick={handleAddToCart}
                          disabled={isLoadingStores}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </Button>
                      </>
                    )}
                  </div>

                  {!courseAlreadyPurchased && (
                    <p className="text-xs text-center text-muted-foreground">
                      30-Day Money-Back Guarantee
                    </p>
                  )}

                  <Separator />

                  {/* Course Includes */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">This course includes:</h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-3">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration} hours on-demand video</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {course.materials?.length || 0} articles & resources
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span>Downloadable resources</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>Full lifetime access</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span>Access on mobile and TV</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>Certificate of completion</span>
                      </div>
                    </div>
                  </div>

                  {/* Share and Wishlist */}
                  <div className="flex justify-center gap-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 ${isWishlisted ? "text-red-500" : ""}`}
                      onClick={handleToggleWishlist}
                    >
                      <Heart
                        className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                      />
                      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
