"use client"

import { Calendar, Users } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { CourseFormData } from "../../types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface PricingStepProps {
  dictionary: DictionaryType
  formData: CourseFormData
  onUpdate: (data: Partial<CourseFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function PricingStep({
  dictionary,
  formData,
  onUpdate,
  onNext,
  onBack,
}: PricingStepProps) {
  const t = dictionary.profilePage.createCourse.pricing
  const tActions = dictionary.profilePage.createCourse.actions

  const enrollmentTypes = [
    { value: "free", label: t.free },
    { value: "subscription", label: t.subscription },
    { value: "one-time", label: t.oneTimePurchase },
  ] as const

  return (
    <div className="flex flex-col gap-8">
      {/* Page Heading */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
          {t.title}
        </h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {/* Enrollment Type Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.enrollmentType}</CardTitle>
          <CardDescription>{t.enrollmentTypeDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-10 w-full max-w-sm items-center rounded-lg bg-muted p-1">
            {enrollmentTypes.map((type) => (
              <label
                key={type.value}
                className={`flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-md px-3 text-sm font-medium transition-colors ${
                  formData.enrollmentType === type.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="truncate">{type.label}</span>
                <input
                  type="radio"
                  name="enrollment-type"
                  value={type.value}
                  checked={formData.enrollmentType === type.value}
                  onChange={(e) =>
                    onUpdate({
                      enrollmentType: e.target
                        .value as CourseFormData["enrollmentType"],
                    })
                  }
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section - Only show for paid courses */}
      {formData.enrollmentType !== "free" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>{t.pricingSection}</CardTitle>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {formData.enrollmentType === "one-time"
                  ? t.oneTimePurchase
                  : t.subscription}
              </Badge>
            </div>
            <CardDescription>{t.priceDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-xs">
              <Label htmlFor="course-price">{t.coursePrice}</Label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  $
                </span>
                <Input
                  id="course-price"
                  type="number"
                  placeholder="99.99"
                  value={formData.price || ""}
                  onChange={(e) =>
                    onUpdate({ price: parseFloat(e.target.value) || 0 })
                  }
                  className="pl-7 pr-16"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => onUpdate({ currency: value })}
                  >
                    <SelectTrigger className="h-full rounded-l-none border-0 border-l bg-transparent w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Access Restrictions Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.accessRestrictions}</CardTitle>
          <CardDescription>{t.accessRestrictionsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Private Course Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Label htmlFor="private-course">{t.privateCourse}</Label>
              <span className="text-sm text-muted-foreground">
                {t.privateCourseDescription}
              </span>
            </div>
            <Switch
              id="private-course"
              checked={formData.isPrivate}
              onCheckedChange={(checked) => onUpdate({ isPrivate: checked })}
            />
          </div>

          {/* Enrollment Cap Toggle */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <Label htmlFor="enrollment-cap">{t.enrollmentCap}</Label>
              <span className="text-sm text-muted-foreground">
                {t.enrollmentCapDescription}
              </span>
            </div>
            <Switch
              id="enrollment-cap"
              checked={formData.hasEnrollmentCap}
              onCheckedChange={(checked) =>
                onUpdate({ hasEnrollmentCap: checked })
              }
            />
          </div>

          {/* Max Students Input - Only show when enrollment cap is enabled */}
          {formData.hasEnrollmentCap && (
            <div className="w-full max-w-xs">
              <Label htmlFor="max-students">{t.maxStudents}</Label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Users className="size-4 text-muted-foreground" />
                </div>
                <Input
                  id="max-students"
                  type="number"
                  placeholder="100"
                  value={formData.maxStudents || ""}
                  onChange={(e) =>
                    onUpdate({ maxStudents: parseInt(e.target.value) || 100 })
                  }
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Enrollment Period */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="start-date">{t.enrollmentStartDate}</Label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Calendar className="size-4 text-muted-foreground" />
                </div>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.enrollmentStartDate || ""}
                  onChange={(e) =>
                    onUpdate({ enrollmentStartDate: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="end-date">{t.enrollmentEndDate}</Label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Calendar className="size-4 text-muted-foreground" />
                </div>
                <Input
                  id="end-date"
                  type="date"
                  value={formData.enrollmentEndDate || ""}
                  onChange={(e) =>
                    onUpdate({ enrollmentEndDate: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <footer className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onBack}>
          {tActions.back}
        </Button>
        <Button onClick={onNext}>{tActions.nextPublish}</Button>
      </footer>
    </div>
  )
}
