"use client"

import { Plus } from "lucide-react"

import { Organization } from "@/types/api"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface OrganizationHeaderProps {
  dictionary: {
    addNewCourse: string
  }
  organization: Organization
  onAddCourse: () => void
}

export function OrganizationHeader({
  dictionary,
  organization,
  onAddCourse,
}: OrganizationHeaderProps) {
  return (
    <Card className="overflow-hidden">
      {organization.orgcover && (
        <div className="h-48 w-full">
          <img
            src={organization.orgcover}
            alt={organization.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl">{organization.name}</CardTitle>
            <CardDescription className="mt-1.5">
              {organization.description}
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
