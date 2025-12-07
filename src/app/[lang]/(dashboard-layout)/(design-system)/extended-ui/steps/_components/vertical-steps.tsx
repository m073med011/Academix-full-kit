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

interface VerticalStepsProps {
  dictionary: DictionaryType["stepsDemo"]
}

export function VerticalSteps({ dictionary }: VerticalStepsProps) {
  const t = dictionary

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.titles.vertical}</CardTitle>
      </CardHeader>
      <CardContent>
        <Steps totalSteps={4} orientation="vertical">
          <StepsList>
            <StepsItem
              step={0}
              label={t.labels.accountSetup}
              description={t.descriptions.createAccount}
            />
            <StepsConnector afterStep={0} />
            <StepsItem
              step={1}
              label={t.labels.profileDetails}
              description={t.descriptions.addInfo}
            />
            <StepsConnector afterStep={1} />
            <StepsItem
              step={2}
              label={t.labels.preferences}
              description={t.descriptions.setPreferences}
            />
            <StepsConnector afterStep={2} />
            <StepsItem
              step={3}
              label={t.labels.confirmation}
              description={t.descriptions.reviewConfirm}
            />
          </StepsList>

          <div className="flex-1">
            <StepsContent step={0}>
              <div className="p-4 border rounded-lg bg-muted/50 h-full">
                <h3 className="font-semibold mb-2">
                  {t.content.accountSetupTitle}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t.content.accountSetupDesc}
                </p>
              </div>
            </StepsContent>

            <StepsContent step={1}>
              <div className="p-4 border rounded-lg bg-muted/50 h-full">
                <h3 className="font-semibold mb-2">
                  {t.content.profileDetailsTitle}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t.content.profileDetailsDesc}
                </p>
              </div>
            </StepsContent>

            <StepsContent step={2}>
              <div className="p-4 border rounded-lg bg-muted/50 h-full">
                <h3 className="font-semibold mb-2">
                  {t.content.preferencesTitle}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t.content.preferencesDesc}
                </p>
              </div>
            </StepsContent>

            <StepsContent step={3}>
              <div className="p-4 border rounded-lg bg-muted/50 h-full">
                <h3 className="font-semibold mb-2">
                  {t.content.confirmationTitle}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t.content.confirmationDesc}
                </p>
              </div>
            </StepsContent>

            <StepsNavigation
              prevLabel={t.navigation.previous}
              nextLabel={t.navigation.next}
              finishLabel={t.navigation.finish}
            />
          </div>
        </Steps>
      </CardContent>
    </Card>
  )
}
