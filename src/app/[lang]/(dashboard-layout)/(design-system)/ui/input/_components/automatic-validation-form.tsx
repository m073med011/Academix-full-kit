"use client"

import { ReusableValidationForm } from "./reusable-validation-form"

export function AutomaticValidationForm() {
  const fields = [
    {
      name: "username",
      label: "Username",
      placeholder: "johndoe",
      rules: { required: "Username is required" },
    },
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "john@example.com",
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
    },
  ]

  return (
    <ReusableValidationForm
      title="Automatic Validation Form"
      fields={fields}
      onSubmit={(data) => console.log(data)}
    />
  )
}
