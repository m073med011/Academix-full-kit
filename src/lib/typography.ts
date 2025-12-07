/**
 * Centralized Typography Styles
 *
 * These styles are derived from the design system defined in:
 * src/app/[lang]/(dashboard-layout)/(design-system)/typography/_data/text-styles.ts
 *
 * Usage:
 * import { typography } from "@/lib/typography"
 * <h1 className={typography.h1}>Title</h1>
 */

export const typography = {
  /** Main page or section title - text-4xl font-black */
  h1: "text-4xl font-black",

  /** Section headings - text-3xl font-semibold */
  h2: "text-3xl font-semibold",

  /** Subsection headings - text-2xl font-semibold */
  h3: "text-2xl font-semibold",

  /** Tertiary titles or smaller headings - text-xl font-semibold */
  h4: "text-xl font-semibold",

  /** Subtle introductory or supporting text - text-sm text-muted-foreground font-normal */
  lead: "text-sm text-muted-foreground font-normal",

  /** For larger body text or highlighted content - text-base font-semibold */
  large: "text-base font-semibold",

  /** Standard paragraph or body text - text-sm font-normal */
  normal: "text-sm font-normal",

  /** For fine print or disclaimers - text-xs font-normal */
  small: "text-xs font-normal",

  /** Secondary or less emphasized text - text-sm text-muted-foreground font-normal */
  muted: "text-sm text-muted-foreground font-normal",
} as const

export type TypographyStyle = keyof typeof typography
