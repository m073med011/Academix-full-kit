"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ValidationInput } from "./validation-input"

export function ValidationInputDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Validation Inputs (Manual)</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <ValidationInput
          label="Success Input"
          validationState="success"
          validationMessage="Username is available."
          placeholder="johndoe"
          defaultValue="johndoe"
        />
        <ValidationInput
          label="Error Input"
          validationState="error"
          validationMessage="Password is too short."
          placeholder="Password"
          type="password"
          defaultValue="123"
        />
      </CardContent>
    </Card>
  )
}
