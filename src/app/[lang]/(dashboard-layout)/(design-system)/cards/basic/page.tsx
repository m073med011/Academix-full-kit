import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { CardOverlay } from "./_components/card-overlay"
import { CardWithFilledImage } from "./_components/card-with-filled-image"
import { CardWithFilledImageHorizontal } from "./_components/card-with-filled-image-horizontal"
import { CardWithImage } from "./_components/card-with-image"
import { CardWithImageHorizontal } from "./_components/card-with-image-horizontal"
import { CardWithTabs } from "./_components/card-with-tabs"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "Basic Cards",
}

export default function BasicCardsPage() {
  const tabs = [
    {
      value: "home",
      label: "Home",
      content: (
        <div className="text-center space-y-3">
          <CardTitle>Welcome to the Homepage</CardTitle>
          <CardDescription>
            Discover the latest updates and explore new features available on
            our platform.
          </CardDescription>
          <Button>Explore</Button>
        </div>
      ),
    },
    {
      value: "settings",
      label: "Settings",
      content: (
        <div className="text-center space-y-3">
          <CardTitle>Manage Your Preferences</CardTitle>
          <CardDescription>
            Customize your experience by updating your settings and preferences
            here.
          </CardDescription>
          <Button>Update Settings</Button>
        </div>
      ),
    },
    {
      value: "disabled",
      label: "Disabled",
      content: null,
      disabled: true,
    },
  ]

  return (
    <section className="container grid gap-4 p-4 md:grid-cols-2">
      <CardWithImage />
      <CardOverlay />
      <CardWithFilledImage />
      <div className="space-y-4">
        <CardWithImageHorizontal />
        <CardWithFilledImageHorizontal />
      </div>
      <CardWithTabs tabs={tabs} defaultValue="home" />
    </section>
  )
}
