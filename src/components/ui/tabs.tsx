"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

import { useScrollDrag } from "@/hooks/use-scroll-drag"

export function Tabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const internalRef =
    React.useRef<React.ElementRef<typeof TabsPrimitive.List>>(null)
  useScrollDrag(internalRef)

  return (
    <TabsPrimitive.List
      ref={(node) => {
        internalRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ;(
            ref as React.MutableRefObject<React.ElementRef<
              typeof TabsPrimitive.List
            > | null>
          ).current = node
        }
      }}
      data-slot="tabs-list"
      className={cn(
        "no-scrollbar inline-flex h-13 w-fit max-w-full items-center justify-start overflow-x-auto rounded-lg bg-muted p-1 text-muted-foreground [&.active]:cursor-grabbing",
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}
