"use client"

import * as React from "react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"

import type {
  DraggableProvided,
  DropResult,
  DroppableProvided,
} from "@hello-pangea/dnd"

import { cn } from "@/lib/utils"

export interface SortableListProps<T> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode
  keyExtractor?: (item: T) => string
  direction?: "vertical" | "horizontal"
  className?: string
  listClassName?: string
  dragHandle?: boolean
}

export function SortableList<T extends { id?: string | number }>({
  items,
  onReorder,
  renderItem,
  keyExtractor = (item) => String(item.id),
  direction = "vertical",
  className,
  listClassName,
}: SortableListProps<T>) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) {
      return
    }

    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(sourceIndex, 1)
    newItems.splice(destinationIndex, 0, reorderedItem)

    onReorder(newItems)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sortable-list" direction={direction}>
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "flex",
              direction === "vertical" ? "flex-col gap-2" : "flex-row gap-2",
              className
            )}
          >
            <div
              className={cn(
                "flex w-full",
                direction === "vertical" ? "flex-col gap-2" : "flex-row gap-2",
                listClassName
              )}
            >
              {items.map((item, index) => (
                <Draggable
                  key={keyExtractor(item)}
                  draggableId={keyExtractor(item)}
                  index={index}
                >
                  {(provided: DraggableProvided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                      className={cn(snapshot.isDragging && "z-50")}
                    >
                      {renderItem(item, index, snapshot.isDragging)}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
