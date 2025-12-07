"use client"

import { FileText, Settings, User, CheckCircle } from "lucide-react"

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

interface StepsWithIconsProps {
  dictionary: DictionaryType["stepsDemo"]
}

export function StepsWithIcons({ dictionary }: StepsWithIconsProps) {
  const t = dictionary

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.titles.withIcons}</CardTitle>
      </CardHeader>
      <CardContent>
        <Steps totalSteps={4} variant="outline">
          <StepsList>
            <StepsItem
              step={0}
              label={t.labels.personalInfo}
              icon={<User className="size-5" />}
              showCheckOnComplete={false}
            />
            <StepsConnector afterStep={0} />
            <StepsItem
              step={1}
              label={t.labels.documents}
              icon={<FileText className="size-5" />}
              showCheckOnComplete={false}
            />
            <StepsConnector afterStep={1} />
            <StepsItem
              step={2}
              label={t.labels.settings}
              icon={<Settings className="size-5" />}
              showCheckOnComplete={false}
            />
            <StepsConnector afterStep={2} />
            <StepsItem
              step={3}
              label={t.labels.complete}
              icon={<CheckCircle className="size-5" />}
              showCheckOnComplete={false}
            />
          </StepsList>

          <StepsContent step={0}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">
                {t.content.personalInfoTitle}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t.content.personalInfoDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={1}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.documentsTitle}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.documentsDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={2}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.settingsTitle}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.settingsDesc}
              </p>
            </div>
          </StepsContent>

          <StepsContent step={3}>
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{t.content.allDoneTitle}</h3>
              <p className="text-muted-foreground text-sm">
                {t.content.allDoneDesc}
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
