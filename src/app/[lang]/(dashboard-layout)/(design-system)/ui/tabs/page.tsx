import type { Metadata } from "next"

import { tabsDemoData } from "./_data/tabs-demo-data"

import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { BasicTabs } from "./_components/basic-tabs"
import { TabsWithCard } from "./_components/tabs-with-card"
import { TabsWithCardUnderline } from "./_components/tabs-with-card-underline"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "Tabs",
}

export default function TabsPage() {
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
      <BasicTabs />
      <TabsWithCard tabs={tabs} defaultValue="home" />
      <TabsWithCardUnderline
        tabs={tabsDemoData.map((tab) => ({
          value: tab.value,
          label: tab.label,
          content: (
            <div className="text-center space-y-3">
              <CardTitle>{tab.title}</CardTitle>
              <CardDescription>{tab.description}</CardDescription>
            </div>
          ),
        }))}
        defaultValue="created"
      />
    </section>
  )
}
