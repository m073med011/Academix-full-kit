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

interface ClickableStepsProps {
  dictionary: DictionaryType["stepsDemo"]
}

export function ClickableSteps({ dictionary }: ClickableStepsProps) {
  const t = dictionary

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.titles.clickable}</CardTitle>
      </CardHeader>
      <CardContent>
        <Steps totalSteps={5} allowJump>
          <StepsList>
            <StepsItem step={0} label={t.labels.start} />
            <StepsConnector afterStep={0} />
            <StepsItem step={1} label={t.labels.details} />
            <StepsConnector afterStep={1} />
            <StepsItem step={2} label={t.labels.options} />
            <StepsConnector afterStep={2} />
            <StepsItem step={3} label={t.labels.review} />
            <StepsConnector afterStep={3} />
            <StepsItem step={4} label={t.labels.finish} />
          </StepsList>

          <StepsContent step={0}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.gettingStarted}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.gettingStartedDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={1}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.addDetails}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.addDetailsDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={2}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.selectOptions}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.selectOptionsDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={3}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">
                {t.content.reviewEverything}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t.content.reviewEverythingDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={4}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.allDoneProcess}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.allDoneProcessDesc}
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
