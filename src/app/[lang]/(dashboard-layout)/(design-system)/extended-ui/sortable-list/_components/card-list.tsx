"use client"

import { useState } from "react"
import { GripVertical } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SortableList } from "@/components/ui/sortable-list"

interface Item {
  id: string
  text: string
  status: "todo" | "in-progress" | "done"
}

interface CardListProps {
  dictionary: DictionaryType["sortableListDemo"]
}

export function CardList({ dictionary }: CardListProps) {
  const t = dictionary
  const [items, setItems] = useState<Item[]>([
    { id: "1", text: t.items.researchCompetitors, status: "done" },
    { id: "2", text: t.items.draftProposal, status: "in-progress" },
    { id: "3", text: t.items.designSystem, status: "todo" },
  ])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t.cardList}</h2>
      <SortableList
        items={items}
        onReorder={setItems}
        renderItem={(item, index, isDragging) => (
          <Card
            className={`mb-0 ${isDragging ? "shadow-xl border-primary/50" : ""}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t.labels.task} #{item.id}
              </CardTitle>
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.text}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t.labels.status}:{" "}
                {item.status === "done"
                  ? t.status.done
                  : item.status === "in-progress"
                    ? t.status.inProgress
                    : t.status.todo}
              </p>
            </CardContent>
          </Card>
        )}
      />
    </div>
  )
}
