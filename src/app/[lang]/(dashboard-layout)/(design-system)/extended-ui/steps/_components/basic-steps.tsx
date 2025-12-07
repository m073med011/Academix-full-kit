"use client"

import type { DictionaryType } from "@/lib/get-dictionary"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Steps,
  StepsConnector,
  StepsContent,
  StepsItem,
  StepsList,
  StepsNavigation,
} from "@/components/ui/steps"

interface BasicStepsProps {
  dictionary: DictionaryType["stepsDemo"]
}

export function BasicSteps({ dictionary }: BasicStepsProps) {
  const t = dictionary

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.titles.basicHorizontal}</CardTitle>
      </CardHeader>
      <CardContent>
        <Steps totalSteps={4}>
          <StepsList>
            <StepsItem step={0} label={`${t.labels.step} 1`} />
            <StepsConnector afterStep={0} />
            <StepsItem step={1} label={`${t.labels.step} 2`} />
            <StepsConnector afterStep={1} />
            <StepsItem step={2} label={`${t.labels.step} 3`} />
            <StepsConnector afterStep={2} />
            <StepsItem step={3} label={`${t.labels.step} 4`} />
          </StepsList>

          <StepsContent step={0}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.welcome}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.welcomeDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={1}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.information}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.informationDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={2}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.reviewTitle}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.reviewDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={3}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.completeTitle}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.completeDesc}
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
