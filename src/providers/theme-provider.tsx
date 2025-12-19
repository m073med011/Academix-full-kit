"use client"

import { useEffect } from "react"

import type { ReactNode } from "react"

import { themes } from "@/configs/themes"

import { useSettings } from "@/hooks/use-settings"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()

  useEffect(() => {
    const bodyElement = document.body

    // Update class names in the <body> tag
    Array.from(bodyElement.classList)
      .filter(
        (className) =>
          className.startsWith("theme-") ||
          className.startsWith("radius-") ||
          className === "dark"
      )
      .forEach((className) => {
        bodyElement.classList.remove(className)
      })

    bodyElement.classList.add(`theme-${settings.theme}`)
    bodyElement.classList.add(`theme-${settings.theme}`)
    // Remove class-based radius to allow dynamic style-based radius
    // bodyElement.classList.add(`radius-${settings.radius ?? 0.5}`)

    // Apply dynamic radius
    // If radius is 1.0, use "9999px" for full pill shape
    // Otherwise use rem value
    const radiusValue =
      settings.radius === 1.0 ? "1.6rem" : `${settings.radius ?? 0.5}rem`

    bodyElement.style.setProperty("--radius", radiusValue)

    // Add dark class based on mode setting
    const isDark =
      settings.mode === "dark" ||
      (settings.mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    if (isDark) {
      bodyElement.classList.add("dark")
    }

    // Dynamic Lightness Logic
    if (settings.lightness !== 0) {
      const mode = isDark ? "dark" : "light"
      // @ts-ignore
      const baseColor = themes[settings.theme].activeColor[mode] as string

      const [h, s, l] = baseColor.split(" ").map((v) => v.replace("%", ""))
      const newL = Math.max(
        0,
        Math.min(100, parseFloat(l) + settings.lightness)
      )

      bodyElement.style.setProperty("--primary", `${h} ${s}% ${newL}%`)
    } else {
      bodyElement.style.removeProperty("--primary")
    }
  }, [settings.theme, settings.radius, settings.mode, settings.lightness])

  return <>{children}</>
}
