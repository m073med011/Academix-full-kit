"use client"

import { toast } from "sonner"
import { Copy, Pencil, Trash2 } from "lucide-react"

import type { SampleUser } from "../../_data/sample-users"
import type {
  ActionItem,
  BadgeVariant,
  DynamicColumn,
} from "./dynamic-table/types"

import { sampleUsers } from "../../_data/sample-users"

import { DynamicTable } from "./dynamic-table"

// Column configuration
const userColumns: DynamicColumn<SampleUser>[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
    sortable: true,
  },
  {
    key: "avatar",
    label: "Avatar",
    type: "avatar",
    imageSize: { width: 32, height: 32 },
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    sortable: true,
  },
  {
    key: "role",
    label: "Role",
    type: "badge",
    sortable: true,
    getBadgeVariant: (value): BadgeVariant => {
      switch (value) {
        case "Manager":
          return "default"
        case "Developer":
          return "secondary"
        case "Designer":
          return "outline"
        default:
          return "default"
      }
    },
  },
  {
    key: "status",
    label: "Status",
    type: "badge",
    sortable: true,
    getBadgeVariant: (value): BadgeVariant => {
      switch (value) {
        case "Active":
          return "success"
        case "Inactive":
          return "destructive"
        case "Pending":
          return "warning"
        default:
          return "default"
      }
    },
  },
  {
    key: "salary",
    label: "Salary",
    type: "currency",
    sortable: true,
    currencySymbol: "$",
  },
  {
    key: "percentage",
    label: "Performance",
    type: "percentage",
    sortable: true,
  },
  {
    key: "isVerified",
    label: "Verified",
    type: "toggle",
  },
  {
    key: "joinedAt",
    label: "Joined",
    type: "date",
    sortable: true,
    hidden: true, // Hidden by default
  },
  {
    key: "document",
    label: "Document",
    type: "file",
    hidden: true, // Hidden by default
  },
]

// Action handlers
const handleEdit = (user: SampleUser) => {
  toast.info(`Editing: ${user.name}`)
}

const handleCopy = (user: SampleUser) => {
  toast.success(`Copied: ${user.id}`)
}

const handleDelete = (user: SampleUser) => {
  toast.error(`Delete: ${user.name}`)
}

// Actions configuration
const userActions: ActionItem<SampleUser>[] = [
  {
    label: "Edit",
    icon: Pencil,
    onClick: handleEdit,
  },
  {
    label: "Copy ID",
    icon: Copy,
    onClick: handleCopy,
  },
  {
    label: "Delete",
    icon: Trash2,
    onClick: handleDelete,
    variant: "destructive",
    separator: true,
  },
]

export function DynamicTableDemo() {
  return (
    <DynamicTable<SampleUser>
      data={sampleUsers}
      columns={userColumns}
      actions={userActions}
      showCheckbox={true}
      searchColumn="name"
      searchPlaceholder="Search by name..."
      defaultView="table"
      title="Dynamic Table"
      cardGridCols={3}
    />
  )
}
