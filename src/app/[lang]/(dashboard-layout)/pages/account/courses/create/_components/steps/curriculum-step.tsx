"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  FileText,
  GripVertical,
  Pencil,
  PlayCircle,
  Plus,
  Trash2,
} from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { CourseFormData, CourseModule } from "../../types"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CurriculumStepProps {
  dictionary: DictionaryType
  formData: CourseFormData
  onUpdate: (data: Partial<CourseFormData>) => void
  onNext: () => void
  onBack: () => void
  onSaveDraft: () => void
}

export function CurriculumStep({
  dictionary,
  formData,
  onUpdate,
  onNext,
  onBack,
  onSaveDraft,
}: CurriculumStepProps) {
  const t = dictionary.profilePage.createCourse.curriculum
  const tActions = dictionary.profilePage.createCourse.actions
  const tProgress = dictionary.profilePage.createCourse.progress

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    formData.modules[0]?.id || null
  )

  // Demo data for initial state
  const [modules, setModules] = useState<CourseModule[]>(
    formData.modules.length > 0
      ? formData.modules
      : [
          {
            id: "1",
            title: "Module 1: Introduction",
            isExpanded: true,
            contents: [
              {
                id: "1-1",
                type: "video",
                title: "Welcome Video",
                status: "published",
                duration: "5:32",
              },
              {
                id: "1-2",
                type: "article",
                title: "What is UX Design?",
                status: "draft",
                duration: "12",
              },
              {
                id: "1-3",
                type: "quiz",
                title: "Chapter 1 Knowledge Check",
                status: "published",
                questions: 10,
              },
            ],
          },
          {
            id: "2",
            title: "Module 2: Core Concepts",
            isExpanded: false,
            contents: [],
          },
          {
            id: "3",
            title: "Module 3: Advanced Topics",
            isExpanded: false,
            contents: [],
          },
        ]
  )

  const selectedModule = modules.find((m) => m.id === selectedModuleId)
  const currentProgress = 50 // Can calculate based on content completion

  const toggleModuleExpansion = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
      )
    )
    setSelectedModuleId(moduleId)
  }

  const handleAddModule = () => {
    const newModule: CourseModule = {
      id: crypto.randomUUID(),
      title: `Module ${modules.length + 1}: New Module`,
      isExpanded: false,
      contents: [],
    }
    setModules((prev) => [...prev, newModule])
  }

  const handleSave = () => {
    onUpdate({ modules })
    onNext()
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
            {t.title}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onSaveDraft}>
              {tActions.saveDraft}
            </Button>
            <Button onClick={handleSave}>{tActions.nextSettings}</Button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {tProgress.stepOf
                .replace("{current}", "2")
                .replace("{total}", "5")}
              : {t.title.split(" ").slice(1).join(" ")}
            </span>
            <span>{currentProgress}%</span>
          </div>
          <Progress value={currentProgress} />
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
            {modules.map((module) => (
              <div
                key={module.id}
                className={cn(
                  "rounded-lg p-3 cursor-pointer transition-colors",
                  selectedModuleId === module.id
                    ? "bg-primary/10 border border-primary/50"
                    : "hover:bg-muted/50"
                )}
                onClick={() => toggleModuleExpansion(module.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="size-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{module.title}</span>
                  </div>
                  {module.isExpanded ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </div>
                {module.isExpanded && (
                  <p className="text-xs text-muted-foreground mt-2 ps-6">
                    {module.contents.length} {t.lesson.toLowerCase()}s
                  </p>
                )}
              </div>
            ))}
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
              <Button size="sm">
                <Plus className="size-4" />
                {t.addContent}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedModule?.contents.map((content) => (
              <div
                key={content.id}
                className="bg-muted/30 p-4 rounded-lg flex items-center justify-between border border-transparent hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="size-4 text-muted-foreground cursor-grab" />
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
                      content.status === "published" ? "default" : "secondary"
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
            ))}

            {/* Drop Zone */}
            <div className="border-2 border-dashed border-primary/30 rounded-lg h-12 flex items-center justify-center">
              <p className="text-primary/70 text-sm">{t.dropContentHere}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <footer className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onBack}>
          {tActions.back}
        </Button>
        <Button onClick={handleSave}>{tActions.nextSettings}</Button>
      </footer>
    </div>
  )
}
