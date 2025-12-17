"use client"

import { useEffect, useState } from "react"
import Image, { ImageProps } from "next/image"

import { cn } from "@/lib/utils"

import { useIsDarkMode } from "@/hooks/use-mode"

// Allow all ImageProps except src (controlled by theme)
// alt is optional with a default, but can be overridden
interface DefaultImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null
  alt?: string
}

export function DefaultImage({
  src,
  className,
  alt = "Logo",
  ...props
}: DefaultImageProps) {
  const isDarkMode = useIsDarkMode()
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [src])

  const defaultSrc = "/images/logos/logo.png"
  const finalSrc = src && !error ? src : defaultSrc
  const isFallback = !src || error

  return (
    <Image
      data-slot="default-image"
      src={finalSrc}
      alt={alt}
      className={cn(
        "transition-all duration-300",
        isFallback ? "object-contain p-2" : "object-cover",
        // Assuming logo.png is white (for dark mode), invert it for light mode
        isFallback && !isDarkMode && "invert",
        className
      )}
      onError={() => setError(true)}
      {...props} // Pass through all other props (width, height, fill, etc.)
    />
  )
}
