"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { DictionaryType } from "@/lib/get-dictionary"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Create dynamic schema with translations
function createBillingFormSchema(
  t: DictionaryType["checkoutPage"]["billingInfo"]
) {
  return z.object({
    firstName: z.string().min(2, t.firstNameError),
    lastName: z.string().min(2, t.lastNameError),
    email: z.string().email(t.emailError),
    phoneNumber: z.string().min(10, t.phoneError),
    address: z.string().min(5, t.addressError),
    city: z.string().min(2, t.cityError),
    country: z.string().min(2, t.countryError),
    postalCode: z.string().min(3, t.postalCodeError),
  })
}

export type BillingFormValues = z.infer<
  ReturnType<typeof createBillingFormSchema>
>

interface BillingFormProps {
  onSubmit: (data: BillingFormValues) => Promise<void>
  isLoading?: boolean
  dictionary: DictionaryType
}

/**
 * Billing information form for checkout
 * Validates and collects user billing details
 */
export function BillingForm({
  onSubmit,
  isLoading = false,
  dictionary,
}: BillingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = dictionary.checkoutPage.billingInfo
  const countries = dictionary.checkoutPage.countries

  const billingFormSchema = createBillingFormSchema(t)

  const form = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
  })

  const handleSubmit = async (values: BillingFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  const disabled = isLoading || isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.firstName}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.firstNamePlaceholder}
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.lastName}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.lastNamePlaceholder}
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.email}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.phone}</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address Field */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.address}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t.addressPlaceholder}
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Fields */}
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.city}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.cityPlaceholder}
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.country}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.countryPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EG">{countries.EG}</SelectItem>
                    <SelectItem value="US">{countries.US}</SelectItem>
                    <SelectItem value="GB">{countries.GB}</SelectItem>
                    <SelectItem value="CA">{countries.CA}</SelectItem>
                    <SelectItem value="AU">{countries.AU}</SelectItem>
                    <SelectItem value="DE">{countries.DE}</SelectItem>
                    <SelectItem value="FR">{countries.FR}</SelectItem>
                    <SelectItem value="SA">{countries.SA}</SelectItem>
                    <SelectItem value="AE">{countries.AE}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.postalCode}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.postalCodePlaceholder}
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={disabled}>
          {isSubmitting ? t.processing : t.continueToPayment}
        </Button>
      </form>
    </Form>
  )
}
