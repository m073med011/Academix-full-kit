"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface OrganizationHeaderProps {
  dictionary: {
    title: string
    description: string
    addNewCourse: string
  }
  onAddCourse: () => void
}

export function OrganizationHeader({
  dictionary,
  onAddCourse,
}: OrganizationHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl">{dictionary.title}</CardTitle>
            <CardDescription className="mt-1.5">
              {dictionary.description}
            </CardDescription>
          </div>
          <Button onClick={onAddCourse} className="w-full md:w-auto">
            <Plus className="me-2 h-4 w-4" />
            {dictionary.addNewCourse}
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
