import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

// Supported column data types for cell formatting
export type ColumnType =
  | "text"
  | "number"
  | "currency"
  | "percentage"
  | "image"
  | "avatar"
  | "file"
  | "toggle"
  | "date"
  | "datetime"
  | "badge"
  | "email"
  | "link"
  | "custom"

// Badge variant types
export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"

// Column configuration interface
export interface DynamicColumn<T> {
  // Unique key matching the data property
  key: keyof T & string
  // Display label for the column header
  label: string
  // Data type for formatting
  type: ColumnType
  // Enable sorting for this column (default: true)
  sortable?: boolean
  // Hide column by default
  hidden?: boolean
  // Disable hiding this column
  enableHiding?: boolean
  // Custom render function for 'custom' type or override default
  render?: (value: unknown, row: T) => ReactNode
  // Badge variant getter for 'badge' type
  getBadgeVariant?: (value: unknown) => BadgeVariant
  // Currency symbol for 'currency' type (default: '$')
  currencySymbol?: string
  // Date format for 'date'/'datetime' type
  dateFormat?: string
  // Image size for 'image'/'avatar' type
  imageSize?: { width: number; height: number }
  // Placeholder for empty values
  placeholder?: string
}

// Action item configuration
export interface ActionItem<T> {
  // Action label
  label: string
  // Icon component (lucide-react)
  icon?: LucideIcon
  // Click handler with row data
  onClick: (row: T) => void
  // Button variant for styling
  variant?: "default" | "destructive"
  // Show separator before this action
  separator?: boolean
  // Disable condition
  disabled?: boolean | ((row: T) => boolean)
  // Hide condition
  hidden?: boolean | ((row: T) => boolean)
}

// View mode type
export type ViewMode = "table" | "card"

// Main DynamicTable props
export interface DynamicTableProps<T extends Record<string, unknown>> {
  // Data array
  data: T[]
  // Column configurations
  columns: DynamicColumn<T>[]
  // Row actions (optional - if not provided, actions column hidden)
  actions?: ActionItem<T>[]
  // Show row selection checkboxes (default: false)
  showCheckbox?: boolean
  // Column key to search by (default: first column after checkbox)
  searchColumn?: keyof T & string
  // Search placeholder text
  searchPlaceholder?: string
  // Default view mode (default: 'table')
  defaultView?: ViewMode
  // Page size options (default: [10, 20, 30, 40, 50])
  pageSizeOptions?: number[]
  // Default page size (default: 10)
  defaultPageSize?: number
  // Table title (optional)
  title?: string
  // No results message
  noResultsMessage?: string
  // Unique row identifier key (default: 'id')
  rowIdKey?: keyof T & string
  // Enable row selection change callback
  onRowSelectionChange?: (selectedRows: T[]) => void
  // Card grid columns (default: responsive 1-4)
  cardGridCols?: 1 | 2 | 3 | 4
}
