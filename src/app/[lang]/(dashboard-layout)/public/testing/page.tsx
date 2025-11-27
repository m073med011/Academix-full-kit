"use client"

import {
  FieldConfig,
  ReusableValidationForm,
} from "../../(design-system)/ui/input/_components/reusable-validation-form"

// Define the form data structure
interface UserRegistrationForm {
  username: string
  email: string
  phone: string
  password: string
}

export default function TestingPage() {
  // Define the fields configuration
  const fields: FieldConfig<UserRegistrationForm>[] = [
    {
      name: "username",
      label: "Username (Required)",
      placeholder: "Enter your username",
      type: "text",
      rules: {
        required: "Username is required",
        minLength: {
          value: 3,
          message: "Username must be at least 3 characters",
        },
        maxLength: {
          value: 20,
          message: "Username must be less than 20 characters",
        },
      },
    },
    {
      name: "email",
      label: "Email (Required, Pattern)",
      placeholder: "Enter your email",
      type: "email",
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
    },
    {
      name: "phone",
      label: "Phone Number (Optional)",
      placeholder: "+1 234 567 8900",
      type: "tel",
      rules: {
        pattern: {
          value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
          message: "Invalid phone number format",
        },
      },
    },
    {
      name: "password",
      label: "Password (Required, Min 8 chars)",
      placeholder: "Enter your password",
      type: "password",
      rules: {
        required: "Password is required",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
      },
    },
  ]

  // Handle form submission
  const handleSubmit = (data: UserRegistrationForm) => {
    console.log("Form submitted with data:", data)
    alert(`Form Submitted!\n\n${JSON.stringify(data, null, 2)}`)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Testing Page</h1>
      <p className="mb-8 text-muted-foreground">
        This demonstrates the reusable validation form component with automatic
        validation states.
      </p>

      <ReusableValidationForm<UserRegistrationForm>
        fields={fields}
        title="User Registration Form"
        submitButtonText="Create Account"
        onSubmit={handleSubmit}
        disableSubmitWhenInvalid={true}
      />
    </div>
  )
}
