"use client"

import { useEffect, useRef } from "react"

import type { ThemeType } from "@/types"

import { useSettings } from "@/hooks/use-settings"

export function useThemeScrubber() {
  const { settings, updateSettings } = useSettings()

  // Refs for dragging
  const dragRef = useRef<{
    startX: number
    startLightness: number
    isDragging: boolean
    activeTheme: ThemeType
  } | null>(null)

  const handlePointerDown = (e: React.PointerEvent, theme: ThemeType) => {
    // Only left click
    if (e.button !== 0) return
    e.preventDefault()

    // Explicitly focus the button since preventDefault stops native focus
    ;(e.currentTarget as HTMLButtonElement).focus()

    // Select the theme immediately
    updateSettings({ ...settings, theme })

    dragRef.current = {
      startX: e.clientX,
      startLightness: settings.lightness ?? 0,
      isDragging: true,
      activeTheme: theme,
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current?.isDragging) return

      const deltaX = e.clientX - dragRef.current.startX
      const sensitivity = 0.5 // Adjust as needed
      let newLightness = dragRef.current.startLightness + deltaX * sensitivity

      // Clamp between -40 and 40
      newLightness = Math.max(-40, Math.min(40, Math.round(newLightness)))

      updateSettings({
        ...settings,
        theme: dragRef.current.activeTheme,
        lightness: newLightness,
      })
    }

    const handlePointerUp = () => {
      if (dragRef.current) {
        dragRef.current.isDragging = false
      }
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerup", handlePointerUp)
    }

    document.addEventListener("pointermove", handlePointerMove)
    document.addEventListener("pointerup", handlePointerUp)
  }

  const handleKeyDown = (e: React.KeyboardEvent, theme: ThemeType) => {
    if (["ArrowLeft", "ArrowDown"].includes(e.key)) {
      e.preventDefault()
      const newLightness = Math.max(-40, Math.min(40, settings.lightness - 1))
      updateSettings({
        ...settings,
        theme,
        lightness: newLightness,
      })
    } else if (["ArrowRight", "ArrowUp"].includes(e.key)) {
      e.preventDefault()
      const newLightness = Math.max(-40, Math.min(40, settings.lightness + 1))
      updateSettings({
        ...settings,
        theme,
        lightness: newLightness,
      })
    } else if (["Enter", " "].includes(e.key)) {
      // Select on Enter/Space
      updateSettings({
        ...settings,
        theme,
      })
    }
  }

  return {
    handlePointerDown,
    handleKeyDown,
  }
}
