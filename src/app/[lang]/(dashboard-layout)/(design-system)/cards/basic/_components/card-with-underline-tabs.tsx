import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface TabItem {
  value: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

interface CardWithUnderlineTabsProps {
  tabs: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function CardWithUnderlineTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
}: CardWithUnderlineTabsProps) {
  return (
    <Card className={cn(className)}>
      <Tabs
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
      >
        <CardHeader>
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                className="relative h-12 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </CardHeader>
        <CardContent>
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="mt-6 space-y-4"
            >
              {tab.content}
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  )
}
