"use client"

import * as React from "react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Steps,
  StepsConnector,
  StepsContent,
  StepsItem,
  StepsList,
  StepsNavigation,
} from "@/components/ui/steps"
import { toast } from "sonner"

interface StepsWizardFormProps {
  dictionary: DictionaryType["stepsDemo"]
}

export function StepsWizardForm({ dictionary }: StepsWizardFormProps) {
  const t = dictionary
  const [activeStep, setActiveStep] = React.useState(0)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    bio: "",
    notifications: true,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFinish = () => {
    toast.success(t.content.completeTitle, {
      description: `${t.content.welcomeDesc}`,
    })
  }

  const canGoNext =
    (activeStep === 0 &&
      formData.name.length > 0 &&
      formData.email.length > 0) ||
    activeStep === 1 ||
    activeStep === 2

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.titles.wizardForm}</CardTitle>
      </CardHeader>
      <CardContent>
        <Steps
          totalSteps={3}
          activeStep={activeStep}
          onStepChange={setActiveStep}
          canGoNext={canGoNext}
        >
          <StepsList>
            <StepsItem
              step={0}
              label={t.labels.account}
              description={t.descriptions.basicInfo}
            />
            <StepsConnector afterStep={0} />
            <StepsItem
              step={1}
              label={t.labels.profile}
              description={t.descriptions.aboutYou}
            />
            <StepsConnector afterStep={1} />
            <StepsItem
              step={2}
              label={t.labels.confirm}
              description={t.labels.review}
            />
          </StepsList>

          <StepsContent step={0}>
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="name">{t.wizard.name} *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t.wizard.namePlaceholder}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t.wizard.email} *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t.wizard.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {!canGoNext && activeStep === 0 && (
                <p className="text-sm text-destructive">{t.wizard.required}</p>
              )}
            </div>
          </StepsContent>

          <StepsContent step={1}>
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="bio">{t.wizard.bio}</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder={t.wizard.bioPlaceholder}
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </StepsContent>

          <StepsContent step={2}>
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold">{t.wizard.reviewInfo}</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>{t.wizard.name}:</strong> {formData.name || "-"}
                </p>
                <p>
                  <strong>{t.wizard.email}:</strong> {formData.email || "-"}
                </p>
                <p>
                  <strong>{t.wizard.bio}:</strong> {formData.bio || "-"}
                </p>
              </div>
            </div>
          </StepsContent>

          <StepsNavigation
            onFinish={handleFinish}
            finishLabel={t.wizard.submit}
            prevLabel={t.navigation.previous}
            nextLabel={t.navigation.next}
          />
        </Steps>
      </CardContent>
    </Card>
  )
}
