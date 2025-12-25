"use client"

import { toast } from "sonner"

import type { TabItem } from "@/app/[lang]/(dashboard-layout)/(design-system)/cards/basic/_components/card-with-underline-tabs"

import { CardWithUnderlineTabs } from "@/app/[lang]/(dashboard-layout)/(design-system)/cards/basic/_components/card-with-underline-tabs"
import { CoursesTab } from "./courses-tab"
import { OrganizationHeader } from "./organization-header"
import { PlaceholderTab } from "./placeholder-tab"

interface OrganizationDetailViewProps {
  dictionary: {
    title: string
    organization: {
      title: string
      description: string
    }
    tabs: {
      about: string
      courses: string
      levels: string
      terms: string
      students: string
      members: string
      settings: string
      rolesPermissions: string
    }
    courses: {
      addNewCourse: string
      searchPlaceholder: string
      statusFilter: string
      export: string
      columns: {
        courseName: string
        status: string
        enrollees: string
        createdDate: string
        actions: string
      }
      status: {
        active: string
        pending: string
        archived: string
        all: string
      }
      actions: {
        view: string
        edit: string
        archive: string
        delete: string
      }
      comingSoon: {
        about: string
        levels: string
        terms: string
        students: string
        members: string
        settings: string
        roles: string
      }
    }
  }
}

export default function OrganizationDetailView({
  dictionary,
}: OrganizationDetailViewProps) {
  const dict = dictionary

  const handleAddCourse = () => {
    toast.success("Add New Course clicked")
  }

  // Define tabs for CardWithUnderlineTabs
  const organizationTabs: TabItem[] = [
    {
      value: "about",
      label: dict.tabs.about,
      content: <PlaceholderTab message={dict.courses.comingSoon.about} />,
    },
    {
      value: "courses",
      label: dict.tabs.courses,
      content: (
        <CoursesTab
          dictionary={{
            ...dict.courses,
            title: dict.tabs.courses,
          }}
        />
      ),
    },
    {
      value: "levels",
      label: dict.tabs.levels,
      content: <PlaceholderTab message={dict.courses.comingSoon.levels} />,
    },
    {
      value: "terms",
      label: dict.tabs.terms,
      content: <PlaceholderTab message={dict.courses.comingSoon.terms} />,
    },
    {
      value: "students",
      label: dict.tabs.students,
      content: <PlaceholderTab message={dict.courses.comingSoon.students} />,
    },
    {
      value: "members",
      label: dict.tabs.members,
      content: <PlaceholderTab message={dict.courses.comingSoon.members} />,
    },
    {
      value: "settings",
      label: dict.tabs.settings,
      content: <PlaceholderTab message={dict.courses.comingSoon.settings} />,
    },
    {
      value: "roles",
      label: dict.tabs.rolesPermissions,
      content: <PlaceholderTab message={dict.courses.comingSoon.roles} />,
    },
  ]

  return (
    <div className="container space-y-6 p-4 md:p-6">
      <OrganizationHeader
        dictionary={{
          title: dict.organization.title,
          description: dict.organization.description,
          addNewCourse: dict.courses.addNewCourse,
        }}
        onAddCourse={handleAddCourse}
      />

      <CardWithUnderlineTabs tabs={organizationTabs} defaultValue="courses" />
    </div>
  )
}
