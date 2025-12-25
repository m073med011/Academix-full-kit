import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface TabItem {
  value: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

interface TabsWithCardProps {
  tabs: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function TabsWithCard({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
}: TabsWithCardProps) {
  return (
    <Card className={cn(className)}>
      <Tabs
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
      >
        <CardHeader>
          <TabsList className="mx-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
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
              className="space-y-3"
            >
              {tab.content}
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  )
}
