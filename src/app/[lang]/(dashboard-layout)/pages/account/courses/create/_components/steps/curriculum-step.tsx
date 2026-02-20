"use client"

import { useState, useCallback } from "react"
import {
  ChevronDown,
  ChevronUp,
  FileText,
  GripVertical,
  Loader2,
  MoreVertical,
  Pencil,
  PlayCircle,
  Plus,
  Trash2,
} from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { CourseContent, CourseFormData, CourseModule } from "../../types"

import { cn } from "@/lib/utils"

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
import { ScrollArea } from "@/components/ui/scroll-area"
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
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null)

  // Edit state
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [editingContent, setEditingContent] = useState<CourseContent | null>(
    null
  )

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
    
    // Auto-focus the new module
    setSelectedModuleId(newModule.id)
    setEditingModuleId(newModule.id)
    setEditingTitle(newModule.title)
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

  const handleCancelEdit = () => {
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

  const handleEditContent = (content: CourseContent) => {
    setEditingContent(content)
    setIsAddContentModalOpen(true)
  }

  const removeLesson = async (contentId: string) => {
    if (!selectedModuleId) return
    setDeletingLessonId(contentId)

    // Find the content to verify if we need to delete files
    const module = modules.find((m) => m.id === selectedModuleId)
    const content = module?.contents.find((c) => c.id === contentId)

    if (content?.url) {
      try {
        const { deleteFromCloudinary, extractPublicId } = await import(
          "@/app/[lang]/(dashboard-layout)/pages/account/courses/_services/cloudinary-service"
        )
        const publicId = extractPublicId(content.url)
        if (publicId) {
          // Determine resource type
          let resourceType: "video" | "image" | "raw" = "image"
          if (content.type === "video") {
            resourceType = "video"
          } else if (content.url.match(/\.(pdf|doc|docx|zip|rar)$/i)) {
            resourceType = "raw"
          }
          
          await deleteFromCloudinary(publicId, resourceType)
        }
      } catch (error) {
        console.error("Failed to delete file from Cloudinary:", error)
        // We continue with local deletion even if remote fails
      }
    }

    const newModules = modules.map((m) =>
      m.id === selectedModuleId
        ? { ...m, contents: m.contents.filter((c) => c.id !== contentId) }
        : m
    )
    setModules(newModules)
    onUpdate({ modules: newModules })
    setDeletingLessonId(null)
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="size-5 text-primary" />
      case "text": // Changed from "article"
      case "article": // Legacy support
        return <FileText className="size-5 text-purple-400" />
      case "quiz":
        return <FileText className="size-5 text-orange-400" />
      default:
        return <FileText className="size-5 text-blue-400" />
    }
  }

  const handleModalAddContent = (type: string, data: any) => {
    if (!selectedModuleId) return

    // Common mapping logic
    const mapDataToContent = (id: string, status: "draft" | "published"): CourseContent => ({
        id,
        type: type as CourseContent["type"],
        title: data.title,
        status,
        description: data.description,
        // Video fields
        url: data.videoUrl || data.url,
        isFreePreview: data.isFreePreview,
        allowDownloads: data.allowDownloads,
        // Article/Text fields
        content: data.content,
        duration: data.readTime || data.duration || 0,
        thumbnailUrl: data.thumbnailUrl, // Added
        // Assignment fields
        points: data.points,
        dueDate: data.dueDate?.toISOString(),
        submissionTypes: data.submissionTypes,
        allowLate: data.allowLate,
        assignmentFileUrl: data.assignmentFileUrl, // Added
        // Quiz fields
        quizQuestions: data.quizQuestions, // Added
        // Link fields
        openInNewTab: data.openInNewTab === "new_tab" || data.openInNewTab === true,
        // Legacy
        questions: type === "quiz" ? 0 : undefined,
    })

    // Check if we're editing an existing content
    if (editingContent && data.id) {
      const updatedContent = mapDataToContent(data.id, editingContent.status)

      const newModules = modules.map((m) =>
        m.id === selectedModuleId
          ? {
              ...m,
              contents: m.contents.map((c) =>
                c.id === data.id ? updatedContent : c
              ),
            }
          : m
      )
      setModules(newModules)
      onUpdate({ modules: newModules })
    } else {
      // Creating new content
      const newContent = mapDataToContent(crypto.randomUUID(), "draft")

      const newModules = modules.map((m) =>
        m.id === selectedModuleId
          ? { ...m, contents: [...m.contents, newContent] }
          : m
      )
      setModules(newModules)
      onUpdate({ modules: newModules })
    }
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
          <CardContent className="flex flex-col gap-2">
            <ScrollArea className="h-[500px] pr-4">
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
            </ScrollArea>
            <Button
              variant="secondary"
              className="w-full mt-2"
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
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
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
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditContent(content)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLesson(content.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={deletingLessonId === content.id}
                          >
                            {deletingLessonId === content.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
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
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <AddContentModal
        isOpen={isAddContentModalOpen}
        onClose={() => {
          setIsAddContentModalOpen(false)
          setEditingContent(null)
        }}
        onAddContent={handleModalAddContent}
        dictionary={dictionary}
        mode={editingContent ? "edit" : "create"}
        initialData={editingContent}
      />
    </div>
  )
}
