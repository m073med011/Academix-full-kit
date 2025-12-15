"use client"

import { useState } from "react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SortableList } from "@/components/ui/sortable-list"

interface Item {
  id: string
  text: string
  status: "todo" | "in-progress" | "done"
}

interface HorizontalListProps {
  dictionary: DictionaryType["sortableListDemo"]
}

export function HorizontalList({ dictionary }: HorizontalListProps) {
  const t = dictionary
  const [items, setItems] = useState<Item[]>([
    { id: "1", text: t.items.research, status: "done" },
    { id: "2", text: t.items.draft, status: "in-progress" },
    { id: "3", text: t.items.design, status: "todo" },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.horizontalList}</CardTitle>
      </CardHeader>
      <CardContent>
        <SortableList
          items={items}
          onReorder={setItems}
          direction="horizontal"
          renderItem={(item, index, isDragging) => (
            <div
              className={`flex flex-col items-center justify-center p-4 border rounded-md bg-card w-32 h-32 text-center gap-2 ${
                isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
              }`}
            >
              <span className="font-medium text-sm">{item.text}</span>
              <Badge variant="secondary" className="text-xs">
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
