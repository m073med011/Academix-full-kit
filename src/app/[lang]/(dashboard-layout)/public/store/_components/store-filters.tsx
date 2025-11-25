"use client"

import { Filter } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Rating } from "@/components/ui/rating"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface StoreFiltersProps {
  dictionary: DictionaryType
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function StoreFilters({
  dictionary,
  isOpen,
  setIsOpen,
}: StoreFiltersProps) {
  const t = dictionary.storePage.filters

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {t.title}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>{t.title}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersContent dictionary={dictionary} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Sidebar Filters (Desktop) */}
      <aside className="hidden lg:block w-full lg:w-1/4">
        <div className="sticky top-8 border rounded-lg bg-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{t.title}</h2>
            <Button
              variant="link"
              className="text-primary h-auto p-0 text-sm hover:no-underline"
            >
              {t.clearAll}
            </Button>
          </div>
          <FiltersContent dictionary={dictionary} />
        </div>
      </aside>
    </>
  )
}

function FiltersContent({ dictionary }: { dictionary: DictionaryType }) {
  const t = dictionary.storePage.filters

  // Mock counts - in a real app, these would come from the backend
  const categoryCounts = {
    business: 12,
    technology: 8,
    design: 15,
    marketing: 5,
  }

  return (
    <Accordion type="multiple" defaultValue={["category"]} className="w-full">
      {/* Category Section */}
      <AccordionItem value="category">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
          {t.category}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            {Object.entries(t.categories).map(([key, label]) => (
              <div
                key={key}
                className="flex items-center space-x-3 rtl:space-x-reverse"
              >
                <Checkbox id={`category-${key}`} />
                <Label
                  htmlFor={`category-${key}`}
                  className="font-normal cursor-pointer flex-1"
                >
                  {label}
                </Label>
                <span className="text-xs text-muted-foreground">
                  ({categoryCounts[key as keyof typeof categoryCounts] || 0})
                </span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Experience Level Section */}
      <AccordionItem value="level">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
          {t.level}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            {Object.entries(t.levels).map(([key, label]) => (
              <div
                key={key}
                className="flex items-center space-x-3 rtl:space-x-reverse"
              >
                <Checkbox id={`level-${key}`} />
                <Label
                  htmlFor={`level-${key}`}
                  className="font-normal cursor-pointer"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Rating Section */}
      <AccordionItem value="rating">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
          {t.rating}
        </AccordionTrigger>
        <AccordionContent>
          <div className="pt-2">
            <Rating value="5" size="sm" />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Price Section */}
      <AccordionItem value="price" className="border-b-0">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline">
          Price
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Checkbox id="price-free" />
              <Label
                htmlFor="price-free"
                className="font-normal cursor-pointer"
              >
                Free
              </Label>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Checkbox id="price-paid" />
              <Label
                htmlFor="price-paid"
                className="font-normal cursor-pointer"
              >
                Paid
              </Label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
