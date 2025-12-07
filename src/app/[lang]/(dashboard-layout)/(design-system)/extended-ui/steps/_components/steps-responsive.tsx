"use client"

import type { DictionaryType } from "@/lib/get-dictionary"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Steps,
  StepsConnector,
  StepsContent,
  StepsItem,
  StepsList,
  StepsNavigation,
} from "@/components/ui/steps"

interface StepsResponsiveProps {
  dictionary: DictionaryType["stepsDemo"]
}

export function StepsResponsive({ dictionary }: StepsResponsiveProps) {
  const t = dictionary
  const isMobile = useIsMobile()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.titles.responsive}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {t.responsive.description} {t.responsive.currently}:{" "}
          <strong>
            {isMobile ? t.responsive.vertical : t.responsive.horizontal}
          </strong>
        </p>
        <Steps
          totalSteps={4}
          orientation={isMobile ? "vertical" : "horizontal"}
          size={isMobile ? "sm" : "default"}
        >
          <StepsList>
            <StepsItem step={0} label={t.labels.browse} />
            <StepsConnector afterStep={0} />
            <StepsItem step={1} label={t.labels.select} />
            <StepsConnector afterStep={1} />
            <StepsItem step={2} label={t.labels.checkout} />
            <StepsConnector afterStep={2} />
            <StepsItem step={3} label={t.labels.done} />
          </StepsList>

          <StepsContent step={0}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.browseProducts}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.browseProductsDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={1}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.selectItems}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.selectItemsDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={2}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.checkoutTitle}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.checkoutDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={3}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.orderComplete}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.orderCompleteDesc}
              </p>
            </div>
          </StepsContent>

          <StepsNavigation
            prevLabel={t.navigation.previous}
            nextLabel={t.navigation.next}
            finishLabel={t.navigation.finish}
          />
        </Steps>
      </CardContent>
    </Card>
  )
}
