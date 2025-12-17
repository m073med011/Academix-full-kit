"use client"

import { useState } from "react"
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  FileText,
  HelpCircle,
  Link as LinkIcon,
  Video,
  X,
} from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CloudinaryUploader } from "@/components/ui/cloudinary-uploader"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Editor } from "@/components/ui/editor"
import { Input } from "@/components/ui/input"
import { InputSpin } from "@/components/ui/input-spin"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type ContentType = "video" | "article" | "quiz" | "assignment" | "link"

interface AddContentModalProps {
  isOpen: boolean
  onClose: () => void
  onAddContent: (type: ContentType, data: any) => void
  dictionary: DictionaryType
}

export function AddContentModal({
  isOpen,
  onClose,
  onAddContent,
  dictionary,
}: AddContentModalProps) {
  const [step, setStep] = useState<"selection" | "form">("selection")
  const [selectedType, setSelectedType] = useState<ContentType | null>(null)

  // Common State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // Video State
  const [videoSource, setVideoSource] = useState<
    "upload" | "embed" | "library"
  >("upload")
  const [videoUrl, setVideoUrl] = useState("")
  const [isFreePreview, setIsFreePreview] = useState(false)
  const [allowDownloads, setAllowDownloads] = useState(false)

  // Article State
  const [articleContent, setArticleContent] = useState("")
  const [readTime, setReadTime] = useState(0)

  // Assignment State
  const [points, setPoints] = useState(100)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [submissionTypes, setSubmissionTypes] = useState<string[]>(["file"])
  const [allowLate, setAllowLate] = useState(false)

  // Link State
  const [openInNewTab, setOpenInNewTab] = useState("new_tab")

  const handleTypeSelect = (type: ContentType) => {
    setSelectedType(type)
    setStep("form")
    // Reset form
    setTitle("")
    setDescription("")
    setVideoUrl("")
    setArticleContent("")
    setPoints(100)
    setDueDate(undefined)
  }

  const handleBack = () => {
    setStep("selection")
    setSelectedType(null)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep("selection")
      setSelectedType(null)
    }, 300)
  }

  const handleSubmit = () => {
    if (!selectedType) return

    const commonData = { title, description }
    let specificData = {}

    switch (selectedType) {
      case "video":
        specificData = { videoSource, videoUrl, isFreePreview, allowDownloads }
        break
      case "article":
        specificData = { content: articleContent, readTime }
        break
      case "assignment":
        specificData = { points, dueDate, submissionTypes, allowLate }
        break
      case "link":
        specificData = { url: videoUrl, openInNewTab } // Reusing videoUrl for link URL
        break
    }

    onAddContent(selectedType, { ...commonData, ...specificData })
    handleClose()
  }

  const contentTypes = [
    {
      id: "video",
      label: "Lesson (Video)",
      description: "Upload video files or embed from external sources",
      icon: Video,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "article",
      label: "Lesson (Article)",
      description: "Create text-based lessons with rich media",
      icon: FileText,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "quiz",
      label: "Quiz",
      description: "Assess student knowledge with multiple questions",
      icon: HelpCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      id: "assignment",
      label: "Assignment",
      description: "Create tasks for students to submit files or text",
      icon: ClipboardList,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      id: "link",
      label: "External Link",
      description: "Link to external resources or websites",
      icon: LinkIcon,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ] as const

  const renderForm = () => {
    switch (selectedType) {
      case "video":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Lesson Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to UX Design"
              />
            </div>

            <div className="space-y-2">
              <Label>Video Source</Label>
              <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
                {(["upload", "embed", "library"] as const).map((source) => (
                  <Button
                    key={source}
                    variant="ghost"
                    onClick={() => setVideoSource(source)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-all h-auto",
                      videoSource === source
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {videoSource === "upload" ? (
              <CloudinaryUploader
                dictionary={dictionary}
                defaultResourceType="video"
                showTypeSelector={false}
                onUploadComplete={(res) => setVideoUrl(res.secureUrl)}
                accept="video/*"
              />
            ) : (
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a brief description..."
              />
            </div>

            <div className="flex justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="free-preview"
                  checked={isFreePreview}
                  onCheckedChange={(c) => setIsFreePreview(!!c)}
                />
                <Label htmlFor="free-preview">Enable free preview</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow-downloads"
                  checked={allowDownloads}
                  onCheckedChange={(c) => setAllowDownloads(!!c)}
                />
                <Label htmlFor="allow-downloads">Allow downloads</Label>
              </div>
            </div>
          </div>
        )

      case "article":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Lesson Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Understanding User Research"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Read Time (minutes)</Label>
                  <InputSpin value={readTime} onChange={setReadTime} min={1} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lesson Thumbnail (Optional)</Label>
                <CloudinaryUploader
                  dictionary={dictionary}
                  defaultResourceType="image"
                  showTypeSelector={false}
                  buttonLabel="Select Image"
                  buttonVariant="outline"
                  className="h-full min-h-[120px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lesson Content</Label>
              <Editor
                value={articleContent}
                onValueChange={setArticleContent}
                placeholder="Start writing your lesson content here..."
                className="min-h-[300px]"
              />
            </div>
          </div>
        )

      case "assignment":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Assignment Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Final UX Case Study"
              />
            </div>

            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed instructions..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Points Possible</Label>
                <InputSpin
                  value={points}
                  onChange={setPoints}
                  min={0}
                  max={1000}
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <DatePicker value={dueDate} onValueChange={setDueDate} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Submission Type</Label>
              <div className="flex gap-4">
                {["File Upload", "Text Entry", "Website URL"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sub-${type}`}
                      checked={submissionTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSubmissionTypes([...submissionTypes, type])
                        } else {
                          setSubmissionTypes(
                            submissionTypes.filter((t) => t !== type)
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`sub-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="allow-late"
                checked={allowLate}
                onCheckedChange={(c) => setAllowLate(!!c)}
              />
              <Label htmlFor="allow-late">Allow Late Submissions</Label>
            </div>
          </div>
        )

      case "link":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Link Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Official Documentation"
              />
            </div>

            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://"
              />
            </div>

            <div className="space-y-2">
              <Label>Open link in</Label>
              <Select value={openInNewTab} onValueChange={setOpenInNewTab}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_tab">New Tab</SelectItem>
                  <SelectItem value="same_window">Same Window</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a brief description..."
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Form for {selectedType} is under construction.
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-2 shrink-0">
          <DialogTitle className="text-xl">
            {step === "selection"
              ? "Add Content to Module"
              : `Add New ${
                  contentTypes
                    .find((c) => c.id === selectedType)
                    ?.label.split(" ")[0]
                }${
                  selectedType === "video" || selectedType === "article"
                    ? `: ${contentTypes
                        .find((c) => c.id === selectedType)
                        ?.label.split("(")[1]
                        .replace(")", "")}`
                    : ""
                }`}
          </DialogTitle>
          {step === "selection" && (
            <DialogDescription>
              Choose the type of content you want to add to this module.
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="p-6 pt-2 flex-1">
          {step === "selection" ? (
            <div className="space-y-4">
              <div className="relative">
                <Input placeholder="Search content type..." className="pl-9" />
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recommended
                </p>
                <div className="grid gap-2">
                  {contentTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant="ghost"
                      onClick={() => handleTypeSelect(type.id)}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left w-full group h-auto"
                    >
                      <div
                        className={cn(
                          "p-2 rounded-md transition-colors",
                          type.bgColor
                        )}
                      >
                        <type.icon className={cn("size-5", type.color)} />
                      </div>
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {type.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {type.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">{renderForm()}</div>
          )}
        </ScrollArea>

        {step === "form" && (
          <div className="p-6 pt-4 border-t shrink-0 bg-background flex justify-between items-center">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {selectedType === "assignment"
                  ? "Save Assignment"
                  : selectedType === "link"
                    ? "Save Link"
                    : selectedType === "article"
                      ? "Save Lesson"
                      : "Add Lesson"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
