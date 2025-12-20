"use client"

import { useMemo, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import type { DynamicColumn, DynamicTableProps, ViewMode } from "./types"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { renderCell } from "./cell-renderers"
import { DynamicTableCardView } from "./dynamic-table-card"
import { DynamicTableRowActions } from "./dynamic-table-row-actions"
import { DynamicTableToolbar } from "./dynamic-table-toolbar"

export function DynamicTable<T extends Record<string, unknown>>({
  data,
  columns,
  actions,
  showCheckbox = false,
  searchColumn,
  searchPlaceholder,
  defaultView = "table",
  pageSizeOptions = [10, 20, 30, 40, 50],
  defaultPageSize = 10,
  title = "Data Table",
  noResultsMessage = "No results.",
  rowIdKey = "id" as keyof T & string,
  onRowSelectionChange,
  cardGridCols = 3,
}: DynamicTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      // Initialize hidden columns from column config
      const visibility: VisibilityState = {}
      columns.forEach((col) => {
        if (col.hidden) {
          visibility[col.key] = false
        }
      })
      return visibility
    }
  )
  const [rowSelection, setRowSelection] = useState({})
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView)

  // Determine search column (default to first column)
  const effectiveSearchColumn = searchColumn ?? columns[0]?.key ?? ""

  // Build TanStack columns from DynamicColumn config
  const tableColumns = useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = []

    // Add select column if showCheckbox is true
    if (showCheckbox) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            className="ms-4"
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            className="ms-4"
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      })
    }

    // Add data columns
    columns.forEach((col) => {
      cols.push({
        id: col.key,
        accessorKey: col.key,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={col.label} />
        ),
        cell: ({ row }) => {
          const value = row.getValue(col.key)
          return renderCell(value, row.original, col)
        },
        enableSorting: col.sortable !== false,
        enableHiding: col.enableHiding !== false,
      })
    })

    // Add actions column if actions provided
    if (actions && actions.length > 0) {
      cols.push({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DynamicTableRowActions row={row} actions={actions} />
        ),
        enableSorting: false,
        enableHiding: false,
      })
    }

    return cols
  }, [columns, actions, showCheckbox])

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater)
      // Call callback with selected rows
      if (onRowSelectionChange) {
        const newSelection =
          typeof updater === "function" ? updater(rowSelection) : updater
        const selectedRows = Object.keys(newSelection)
          .filter((key) => newSelection[key as keyof typeof newSelection])
          .map((key) => data[parseInt(key)])
          .filter(Boolean)
        onRowSelectionChange(selectedRows)
      }
    },
    getRowId: (row) => String(row[rowIdKey] ?? Math.random()),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
  })

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center gap-x-2 space-y-0 flex-wrap">
        <CardTitle>{title}</CardTitle>
        <DynamicTableToolbar
          table={table}
          columns={columns}
          searchColumn={effectiveSearchColumn}
          searchPlaceholder={searchPlaceholder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </CardHeader>
      <CardContent className="p-0">
        {viewMode === "table" ? (
          <ScrollArea
            orientation="horizontal"
            className="w-[calc(100vw-2.25rem)] md:w-auto"
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={tableColumns.length}
                      className="h-24 text-center"
                    >
                      {noResultsMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <DynamicTableCardView
            table={table}
            columns={columns}
            actions={actions}
            showCheckbox={showCheckbox}
            gridCols={cardGridCols}
          />
        )}
      </CardContent>
      <CardFooter className="block py-3">
        <DataTablePagination table={table} />
      </CardFooter>
    </Card>
  )
}
