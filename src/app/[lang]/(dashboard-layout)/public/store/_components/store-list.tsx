"use client"

import { ShoppingCart, Star } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

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

interface Product {
  id: number
  title: string
  instructor: string
  rating: number
  reviews: number
  price: number
  image: string
  tag?: string
  tagColor?: string
}

interface StoreListProps {
  dictionary: DictionaryType
  products: Product[]
}

export function StoreList({ dictionary, products }: StoreListProps) {
  const t = dictionary.storePage

  return (
    <div className="w-full lg:w-3/4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <p className="text-sm text-muted-foreground">
          {t.results.replace("{count}", "12").replace("{total}", "152")}
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Label
            htmlFor="sort"
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            {t.sort.label}
          </Label>
          <Select defaultValue="popular">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
          >
            <div className="relative overflow-hidden aspect-[16/9]">
              <img
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                src={product.image}
                alt={product.title}
              />
              {product.tag && (
                <div
                  className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${product.tagColor} rtl:left-auto rtl:right-3`}
                >
                  {/* @ts-ignore */}
                  {t.card[product.tag]}
                </div>
              )}
            </div>
            <CardContent className="p-5 flex flex-col flex-grow">
              <p className="text-sm text-muted-foreground mb-2">
                {product.instructor}
              </p>
              <h3 className="text-lg font-bold leading-tight mb-3 flex-grow line-clamp-2">
                {product.title}
              </h3>
              <div className="flex items-center gap-1 text-sm mb-4">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-foreground">
                  {product.rating}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews.toLocaleString()})
                </span>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <p className="text-xl font-bold text-primary">
                  ${product.price}
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
      <div className="mt-16">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="hidden md:inline-flex">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="hidden md:inline-flex">
                8
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
