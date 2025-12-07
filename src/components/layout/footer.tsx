import type { DictionaryType } from "@/lib/get-dictionary"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"

interface FooterProps {
  dictionary: DictionaryType
}

export function Footer({ dictionary }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const t = dictionary.footer

  return (
    <footer className="bg-background border-t border-sidebar-border">
      <div className="container flex justify-between items-center p-4 md:px-6">
        <p className="text-xs text-muted-foreground md:text-sm">
          {t.copyright} {currentYear}{" "}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
          >
            Academix
          </a>
          .
        </p>
        <p className="text-xs text-muted-foreground md:text-sm">
          {t.designedBy}{" "}
          <a
            href="https://github.com/m073med011"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "link" }), "inline p-0")}
          >
            Mohamed El-Tantawy
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
