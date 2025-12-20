"use client"

import { useCallback } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useCartStore } from "@/stores/cart-store"
import {
  AlignLeft,
  AlignRight,
  AlignStartHorizontal,
  AlignStartVertical,
  MoonStar,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Settings,
  Sun,
  SunMoon,
} from "lucide-react"

import type { LocaleType, ModeType, ThemeType } from "@/types"
import type { CSSProperties } from "react"

import { i18n } from "@/configs/i18n"
import { themes } from "@/configs/themes"
import { relocalizePathname } from "@/lib/i18n"
import { adjustLightness } from "@/lib/utils"

import { useSettings } from "@/hooks/use-settings"
import { useThemeScrubber } from "@/hooks/use-theme-scrubber"
import { Button } from "@/components/ui/button"
import { NumericScrubber } from "@/components/ui/number-scrubber"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useSidebar } from "@/components/ui/sidebar"

export function Customizer() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { setOpen } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const { handlePointerDown, handleKeyDown } = useThemeScrubber()
  const dictionary = useCartStore((state) => state.dictionary)

  const locale = params.lang as LocaleType
  const direction = i18n.localeDirection[locale]

  const handleSetLocale = useCallback(
    (localeName: LocaleType) => {
      updateSettings({ ...settings, locale: localeName })
      router.push(relocalizePathname(pathname, localeName))
    },
    [settings, updateSettings, router, pathname]
  )

  const handleSetMode = useCallback(
    (modeName: ModeType) => {
      updateSettings({ ...settings, mode: modeName })
    },
    [settings, updateSettings]
  )

  const handleReset = useCallback(() => {
    resetSettings()
    router.push(relocalizePathname(pathname, "en"), { scroll: false })
  }, [resetSettings, router, pathname])

  return (
    <Sheet>
      <SheetTrigger className="fixed bottom-10 end-0 z-50" asChild>
        <Button
          size="icon"
          className="rounded-e-none shadow-sm"
          aria-label="Customizer"
        >
          <Settings className="shrink-0 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetPortal>
        <SheetContent className="p-0" side="start">
          <ScrollArea className="h-full p-4">
            <div className="flex flex-1 flex-col space-y-4">
              <SheetHeader>
                <SheetTitle>
                  {dictionary?.customizer?.title || "Customizer"}
                </SheetTitle>
                <SheetDescription>
                  {dictionary?.customizer?.description ||
                    "Pick a style and color for the dashboard."}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <p className="text-sm">
                    {dictionary?.customizer?.color || "Color"}
                  </p>
                  {settings.lightness !== 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs font-mono tabular-nums transition-colors hover:bg-primary hover:text-primary-foreground"
                      style={
                        {
                          "--primary":
                            // @ts-ignore
                            themes[settings.theme].activeColor[
                              settings.mode === "dark" ? "dark" : "light"
                            ],
                        } as CSSProperties
                      }
                      onClick={() =>
                        updateSettings({ ...settings, lightness: 0 })
                      }
                    >
                      {dictionary?.customizer?.reset || "Reset"} (
                      {settings.lightness > 0 ? "+" : ""}
                      {settings.lightness}%)
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(themes).map(([name, value]) => {
                    const isActive = settings.theme === name
                    const mode = settings.mode === "dark" ? "dark" : "light"
                    // @ts-ignore
                    const baseColor = value.activeColor[mode]

                    return (
                      <Button
                        key={name}
                        variant={isActive ? "secondary" : "default"}
                        className={`relative overflow-hidden ${
                          isActive ? "cursor-ew-resize" : "cursor-pointer"
                        }`}
                        style={
                          {
                            "--primary": adjustLightness(
                              baseColor,
                              settings.lightness ?? 0
                            ),
                            "--primary-foreground":
                              value.activeColor["foreground"],
                          } as CSSProperties
                        }
                        onPointerDown={(e) =>
                          handlePointerDown(e, name as ThemeType)
                        }
                        onKeyDown={(e) => handleKeyDown(e, name as ThemeType)}
                      >
                        {isActive && (
                          <div
                            className="absolute inset-0 transition-all bg-primary"
                            style={{
                              width: `${((settings.lightness + 40) / 80) * 100}%`,
                            }}
                          />
                        )}

                        <div className="relative z-10 flex w-full items-center justify-between px-1">
                          <span>{value.label}</span>
                          {isActive && (
                            <span className="text-[10px] font-mono tabular-nums opacity-80">
                              {settings.lightness > 0 ? "+" : ""}
                              {settings.lightness}%
                            </span>
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Radius */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <p className="text-sm">
                    {dictionary?.customizer?.radius || "Radius"}
                  </p>
                  {settings.radius !== 0.75 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs font-mono tabular-nums transition-colors hover:bg-primary hover:text-primary-foreground"
                      style={
                        {
                          "--primary":
                            // @ts-ignore
                            themes[settings.theme].activeColor[
                              settings.mode === "dark" ? "dark" : "light"
                            ],
                        } as CSSProperties
                      }
                      onClick={() =>
                        updateSettings({ ...settings, radius: 0.75 })
                      }
                    >
                      {dictionary?.customizer?.reset || "Reset"} (0.75)
                    </Button>
                  )}
                </div>
                <NumericScrubber
                  min={0}
                  max={1}
                  step={0.01}
                  value={settings.radius}
                  onChange={(val) =>
                    updateSettings({ ...settings, radius: val })
                  }
                  className="w-full"
                />
              </div>

              {/* Mode */}
              <div className="space-y-1.5">
                <p className="text-sm">
                  {dictionary?.customizer?.mode || "Mode"}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={
                      settings.mode === "light" ? "secondary" : "outline"
                    }
                    onClick={() => handleSetMode("light")}
                  >
                    <Sun className="shrink-0 h-4 w-4 me-2" />
                    {dictionary?.navigation?.mode?.light || "Light"}
                  </Button>
                  <Button
                    variant={settings.mode === "dark" ? "secondary" : "outline"}
                    onClick={() => handleSetMode("dark")}
                  >
                    <MoonStar className="shrink-0 h-4 w-4 me-2" />
                    {dictionary?.navigation?.mode?.dark || "Dark"}
                  </Button>
                  <Button
                    variant={
                      settings.mode === "system" ? "secondary" : "outline"
                    }
                    onClick={() => handleSetMode("system")}
                  >
                    <SunMoon className="shrink-0 h-4 w-4 me-2" />
                    {dictionary?.navigation?.mode?.system || "System"}
                  </Button>
                </div>

                {/* Layout */}
                <div className="space-y-1.5">
                  <span className="text-sm">
                    {dictionary?.customizer?.layout || "Layout"}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={
                        settings.layout === "horizontal"
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() =>
                        updateSettings({
                          ...settings,
                          layout: "horizontal",
                        })
                      }
                    >
                      <AlignStartHorizontal className="shrink-0 h-4 w-4 me-2" />
                      {dictionary?.customizer?.horizontal || "Horizontal"}
                    </Button>
                    <Button
                      variant={
                        settings.layout === "vertical" ? "secondary" : "outline"
                      }
                      onClick={() =>
                        updateSettings({
                          ...settings,
                          layout: "vertical",
                        })
                      }
                    >
                      <AlignStartVertical className="shrink-0 h-4 w-4 me-2" />
                      {dictionary?.customizer?.vertical || "Vertical"}
                    </Button>
                  </div>
                </div>

                {/* Direction */}
                <div className="space-y-1.5">
                  <span className="text-sm">
                    {dictionary?.customizer?.direction || "Direction"}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={direction === "ltr" ? "secondary" : "outline"}
                      onClick={() => handleSetLocale("en")}
                    >
                      <AlignLeft className="shrink-0 h-4 w-4 me-2" />
                      {dictionary?.customizer?.ltr || "LRT"}
                    </Button>
                    <Button
                      variant={direction === "rtl" ? "secondary" : "outline"}
                      onClick={() => handleSetLocale("ar")}
                    >
                      <AlignRight className="shrink-0 h-4 w-4 me-2" />
                      {dictionary?.customizer?.rtl || "RTL"}
                    </Button>
                  </div>
                </div>

                {/* Sidebar Mode */}
                <div className="space-y-1.5">
                  <span className="text-sm">
                    {dictionary?.customizer?.sidebarMode || "Sidebar Mode"}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={
                        settings.sidebarMode === "open"
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() => {
                        updateSettings({
                          ...settings,
                          sidebarMode: "open",
                        })
                        setOpen(true)
                      }}
                    >
                      <AlignStartVertical className="shrink-0 h-4 w-4 me-2" />
                      {dictionary?.customizer?.open || "Open"}
                    </Button>
                    <Button
                      variant={
                        settings.sidebarMode === "icons"
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() => {
                        updateSettings({
                          ...settings,
                          sidebarMode: "icons",
                        })
                        setOpen(false)
                      }}
                    >
                      <PanelLeftClose className="shrink-0 h-4 w-4 me-2" />
                      {dictionary?.customizer?.icons || "Icons"}
                    </Button>
                    <Button
                      variant={
                        settings.sidebarMode === "closed"
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() => {
                        updateSettings({
                          ...settings,
                          sidebarMode: "closed",
                        })
                        setOpen(false)
                      }}
                    >
                      <PanelLeftOpen className="shrink-0 h-4 w-4 me-2" />
                      {dictionary?.customizer?.closed || "Closed"}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleReset}
              >
                <RotateCcw className="shrink-0 h-4 w-4 me-2" />
                {dictionary?.customizer?.reset || "Reset"}
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  )
}
