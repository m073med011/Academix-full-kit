"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  FileText,
  GripVertical,
  MoreVertical,
  Pencil,
  PlayCircle,
  Plus,
  Trash2,
} from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { CourseContent, CourseFormData, CourseModule } from "../../types"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SortableList } from "@/components/ui/sortable-list"
import { AddContentModal } from "./add-content-modal"

interface CurriculumStepProps {
  dictionary: DictionaryType
  formData: CourseFormData
  onUpdate: (data: Partial<CourseFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function CurriculumStep({
  dictionary,
  formData,
  onUpdate,
  onNext,
  onBack,
}: CurriculumStepProps) {
  const t = dictionary.profilePage.createCourse.curriculum
  const tActions = dictionary.profilePage.createCourse.actions

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    formData.modules[0]?.id || null
  )
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false)

  // Edit state
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  // Demo data for initial state
  const [modules, setModules] = useState<CourseModule[]>(formData.modules)

  const selectedModule = modules.find((m) => m.id === selectedModuleId)

  const toggleModuleExpansion = (moduleId: string) => {
    if (editingModuleId === moduleId) return // Prevent expansion toggle while editing
    const newModules = modules.map((m) =>
      m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
    )
    setModules(newModules)
    onUpdate({ modules: newModules })
    setSelectedModuleId(moduleId)
  }

  const handleAddModule = () => {
    const newModule: CourseModule = {
      id: crypto.randomUUID(),
      title: `Module ${modules.length + 1}: New Module`,
      isExpanded: false,
      contents: [],
    }
    const newModules = [...modules, newModule]
    setModules(newModules)
    onUpdate({ modules: newModules })
  }

  const handleEditModule = (module: CourseModule) => {
    setEditingModuleId(module.id)
    setEditingTitle(module.title)
  }

  const handleSaveModuleTitle = () => {
    if (!editingModuleId) return

    const newModules = modules.map((m) =>
      m.id === editingModuleId ? { ...m, title: editingTitle } : m
    )
    setModules(newModules)
    onUpdate({ modules: newModules })
    setEditingModuleId(null)
    setEditingTitle("")
  }

  const handleDeleteModule = (moduleId: string) => {
    const newModules = modules.filter((m) => m.id !== moduleId)
    setModules(newModules)
    onUpdate({ modules: newModules })

    if (selectedModuleId === moduleId) {
      setSelectedModuleId(newModules[0]?.id || null)
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="size-5 text-primary" />
      case "article":
        return <FileText className="size-5 text-purple-400" />
      case "quiz":
        return <FileText className="size-5 text-orange-400" />
      default:
        return <FileText className="size-5 text-blue-400" />
    }
  }

  const handleModalAddContent = (type: string, data: any) => {
    if (!selectedModuleId) return

    const newContent: CourseContent = {
      id: crypto.randomUUID(),
      type: type as CourseContent["type"],
      title: data.title,
      status: "draft",
      // Common fields
      description: data.description,
      // Video fields
      url: data.videoUrl || data.url,
      isFreePreview: data.isFreePreview,
      allowDownloads: data.allowDownloads,
      // Article fields
      content: data.content,
      duration: data.readTime || 0,
      // Assignment fields
      points: data.points,
      dueDate: data.dueDate?.toISOString(),
      submissionTypes: data.submissionTypes,
      allowLate: data.allowLate,
      // Link fields
      openInNewTab: data.openInNewTab === "new_tab",
      // Legacy
      questions: type === "quiz" ? 0 : undefined,
    }

    const newModules = modules.map((m) =>
      m.id === selectedModuleId
        ? { ...m, contents: [...m.contents, newContent] }
        : m
    )
    setModules(newModules)
    onUpdate({ modules: newModules })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
            {t.title}
          </h1>
          <div className="flex items-center gap-2"></div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
        {/* Left Panel: Modules */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-bold">{t.modules}</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <SortableList
              items={modules}
              onReorder={(newModules) => {
                setModules(newModules)
                onUpdate({ modules: newModules })
              }}
              renderItem={(module) => (
                <div
                  className={cn(
                    "rounded-lg p-3 cursor-pointer transition-colors mb-2 group",
                    selectedModuleId === module.id
                      ? "bg-primary/10 border border-primary/50"
                      : "hover:bg-muted/50 border border-transparent"
                  )}
                  onClick={() => toggleModuleExpansion(module.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="size-4 text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0" />
                      {editingModuleId === module.id ? (
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={handleSaveModuleTitle}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveModuleTitle()
                            if (e.key === "Escape") {
                              setEditingModuleId(null)
                              setEditingTitle("")
                            }
                          }}
                          autoFocus
                          className="h-7 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="font-medium text-sm truncate">
                          {module.title}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {editingModuleId !== module.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="size-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditModule(module)
                              }}
                            >
                              <Pencil className="mr-2 size-4" />
                              {tActions?.edit || "Edit"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteModule(module.id)
                              }}
                            >
                              <Trash2 className="mr-2 size-4" />
                              {(tActions as any)?.delete || "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      {module.isExpanded ? (
                        <ChevronUp className="size-4 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="size-4 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  {module.isExpanded && (
                    <p className="text-xs text-muted-foreground mt-2 ps-6">
                      {module.contents.length} {t.lesson.toLowerCase()}s
                    </p>
                  )}
                </div>
              )}
            />
            <Button
              variant="secondary"
              className="w-full mt-4"
              onClick={handleAddModule}
            >
              {t.addNewModule}
            </Button>
          </CardContent>
        </Card>

        {/* Right Panel: Content Canvas */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedModule?.title || "Select a module"}
              </h2>
              <Button
                size="sm"
                onClick={() => setIsAddContentModalOpen(true)}
                disabled={!selectedModuleId}
              >
                <Plus className="size-4" />
                {t.addContent}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedModule && (
              <SortableList
                items={selectedModule.contents}
                onReorder={(newContents) => {
                  const newModules = modules.map((m) =>
                    m.id === selectedModuleId
                      ? { ...m, contents: newContents }
                      : m
                  )
                  setModules(newModules)
                  onUpdate({ modules: newModules })
                }}
                renderItem={(content) => (
                  <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between border border-transparent hover:border-primary transition-colors mb-3">
                    <div className="flex items-center gap-4">
                      <GripVertical className="size-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                      {getContentIcon(content.type)}
                      <div>
                        <p className="font-medium">
                          {t.lesson}: {content.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {content.type === "video" &&
                            `${t.video} - ${content.duration} min`}
                          {content.type === "article" &&
                            `${t.article} - ${content.duration} ${t.minRead}`}
                          {content.type === "quiz" &&
                            `${content.questions} ${t.questions}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          content.status === "published"
                            ? "default"
                            : "secondary"
                        }
                        className={cn(
                          content.status === "published"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        )}
                      >
                        {content.status === "published" ? t.published : t.draft}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}
              />
            )}

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-primary/30 rounded-lg h-12 flex items-center justify-center">
              <p className="text-primary/70 text-sm">{t.dropContentHere}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddContentModal
        isOpen={isAddContentModalOpen}
        onClose={() => setIsAddContentModalOpen(false)}
        onAddContent={handleModalAddContent}
        dictionary={dictionary}
      />
    </div>
  )
}
