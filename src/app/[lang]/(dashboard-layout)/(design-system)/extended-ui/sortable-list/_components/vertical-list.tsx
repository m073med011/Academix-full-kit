"use client"

import { useState } from "react"
import { GripVertical } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SortableList } from "@/components/ui/sortable-list"

interface Item {
  id: string
  text: string
  status: "todo" | "in-progress" | "done"
}

interface VerticalListProps {
  dictionary: DictionaryType["sortableListDemo"]
}

export function VerticalList({ dictionary }: VerticalListProps) {
  const t = dictionary
  const [items, setItems] = useState<Item[]>([
    { id: "1", text: t.items.researchCompetitors, status: "done" },
    { id: "2", text: t.items.draftProposal, status: "in-progress" },
    { id: "3", text: t.items.designSystem, status: "todo" },
    { id: "4", text: t.items.setupEnv, status: "done" },
    { id: "5", text: t.items.implementFeatures, status: "todo" },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.verticalList}</CardTitle>
      </CardHeader>
      <CardContent>
        <SortableList
          items={items}
          onReorder={setItems}
          renderItem={(item, index, isDragging) => (
            <div
              className={`flex items-center justify-between p-3 border rounded-md bg-card ${
                isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                <span className="font-medium">{item.text}</span>
              </div>
              <Badge
                variant={
                  item.status === "done"
                    ? "default"
                    : item.status === "in-progress"
                    ? "secondary"
                    : "outline"
                }
              >
                {item.status === "done"
                  ? t.status.done
                  : item.status === "in-progress"
                  ? t.status.inProgress
                  : t.status.todo}
              </Badge>
            </div>
          )}
        />
      </CardContent>
    </Card>
  )
}
