"use client"

import { useForm } from "react-hook-form"

import type {
  DefaultValues,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { ValidationInput } from "./validation-input"

// Field configuration for each input
export interface FieldConfig<T extends FieldValues> {
  name: Path<T>
  label: string
  placeholder?: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  rules?: RegisterOptions<T>
  defaultValue?: unknown
}

// Props for the reusable form
export interface ReusableValidationFormProps<T extends FieldValues> {
  fields: FieldConfig<T>[]
  onSubmit: (data: T) => void
  title?: string
  submitButtonText?: string
  disableSubmitWhenInvalid?: boolean
  className?: string
  cardClassName?: string
}

export function ReusableValidationForm<T extends FieldValues>({
  fields,
  onSubmit,
  title = "Form",
  submitButtonText = "Submit",
  disableSubmitWhenInvalid = true,
  className,
  cardClassName,
}: ReusableValidationFormProps<T>) {
  // Build default values from field config
  const defaultValues = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: field.defaultValue ?? "",
    }),
    {} as DefaultValues<T>
  )

  const form = useForm<T>({
    mode: "onChange",
    defaultValues,
  })

  function handleSubmit(data: T) {
    onSubmit(data)
  }

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={className || "grid gap-4"}
          >
            {fields.map((fieldConfig) => (
              <FormField
                key={fieldConfig.name as string}
                control={form.control}
                name={fieldConfig.name}
                rules={fieldConfig.rules}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <ValidationInput
                        {...field}
                        type={fieldConfig.type}
                        label={fieldConfig.label}
                        placeholder={fieldConfig.placeholder}
                        validationState={
                          fieldState.invalid
                            ? "error"
                            : !fieldState.invalid &&
                                fieldState.isDirty &&
                                field.value
                              ? "success"
                              : "none"
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="submit"
              disabled={disableSubmitWhenInvalid && !form.formState.isValid}
            >
              {submitButtonText}
              {disableSubmitWhenInvalid && " (Disabled if invalid)"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
