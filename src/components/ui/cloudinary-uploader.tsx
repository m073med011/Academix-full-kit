"use client"

import { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { Check, Copy, Loader2, Upload, X } from "lucide-react"

import type {
  CloudinaryUploadResult,
  ResourceType,
} from "@/app/[lang]/(dashboard-layout)/pages/account/courses/_services/cloudinary-service"
import type { ComponentProps } from "react"

import { cn, formatBytes, formatFileSize } from "@/lib/utils"
import type { DictionaryType } from "@/lib/get-dictionary"
import type { FileType } from "@/types"

import { useCloudinaryUpload } from "@/app/[lang]/(dashboard-layout)/pages/account/courses/_hooks/use-cloudinary-upload"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, ButtonLoading } from "@/components/ui/button"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { FileThumbnail } from "@/components/ui/file-thumbnail"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface CloudinaryUploaderProps {
  onUploadComplete?: (result: CloudinaryUploadResult) => void
  onUploadStart?: () => void
  onError?: (error: string) => void
  onProcessChange?: (isProcessing: boolean) => void
  accept?: string
  maxSize?: number // in bytes
  className?: string
  placeholder?: string
  buttonLabel?: string
  buttonVariant?: ComponentProps<typeof Button>["variant"]
  showTypeSelector?: boolean
  defaultResourceType?: ResourceType
  showUploadedUrl?: boolean // Show URL input after upload (default: false)
  dictionary: DictionaryType
}

const getFileTypeOptions = (t: DictionaryType["cloudinary"]) => [
  { value: "auto" as ResourceType, label: t.autoDetect },
  { value: "image" as ResourceType, label: t.image },
  { value: "video" as ResourceType, label: t.video },
  { value: "raw" as ResourceType, label: t.document },
]

export interface CloudinaryUploaderRef {
  deleteFile: () => Promise<void>
}

export const CloudinaryUploader = forwardRef<CloudinaryUploaderRef, CloudinaryUploaderProps>(({
  onUploadComplete,
  onUploadStart,
  onError,
  onProcessChange,
  accept,
  maxSize,
  className,
  placeholder = "No file chosen",
  buttonLabel = "Choose File",
  buttonVariant = "default",
  showTypeSelector = true,
  defaultResourceType = "auto",
  showUploadedUrl = false,
  dictionary,
}, ref) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resourceType, setResourceType] =
    useState<ResourceType>(defaultResourceType)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    upload,
    deleteUpload,
    isUploading,
    isDeleting,
    progress,
    error,
    result,
    reset,
  } = useCloudinaryUpload()

  useImperativeHandle(ref, () => ({
    deleteFile: async () => {
      try {
        await deleteUpload()
        handleReset()
      } catch (error) {
        console.error("Failed to delete file via ref:", error)
        throw error
      }
    }
  }))

  useEffect(() => {
    onProcessChange?.(isUploading || isDeleting)
  }, [isUploading, isDeleting, onProcessChange])

  // Check if we should show the dropzone UI (for images)
  const showDropzone = resourceType === "image"

  const t = dictionary.cloudinary
  const fileTypeOptions = getFileTypeOptions(t)

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Reset selected file when resource type changes
  useEffect(() => {
    handleReset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceType])

  const processFile = useCallback(
    (file: File) => {
      // Check file size if maxSize is specified
      if (maxSize && file.size > maxSize) {
        onError?.(
          t.error.fileSize.replace("{size}", formatBytes(maxSize))
        )
        return
      }

      // Revoke previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      // Create new preview URL for the selected file
      const newPreviewUrl = URL.createObjectURL(file)
      setPreviewUrl(newPreviewUrl)
      setSelectedFile(file)
      reset()
    },
    [maxSize, onError, previewUrl, reset]
  )

  // Dropzone value and handler
  const dropzoneValue: FileType[] = selectedFile
    ? [
        {
          id: "selected-file",
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          url: previewUrl || "",
          file: selectedFile,
        },
      ]
    : []

  const handleDropzoneChange = async (files: FileType[]) => {
    if (files.length > 0 && files[0].file) {
      processFile(files[0].file)
    } else {
      // If file is removed, check if we need to delete from Cloudinary
      if (result?.secureUrl) {
        try {
          await deleteUpload()
        } catch (error) {
          console.error("Failed to delete file:", error)
        }
      }
      handleReset()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      onUploadStart?.()
      const uploadResult = await upload(selectedFile, resourceType)
      onUploadComplete?.(uploadResult)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.error.uploadFailed
      onError?.(errorMessage)
    }
  }

  const handleCopyUrl = async () => {
    if (result?.secureUrl) {
      await navigator.clipboard.writeText(result.secureUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleReset = () => {
    // Revoke preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setSelectedFile(null)
    reset()
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleUploadAnother = async () => {
    // Delete the old file from Cloudinary first
    try {
      await deleteUpload()
    } catch {
      // If deletion fails, still allow reset so user can try again
      console.error(t.error.deleteFailed)
    }
    handleReset()
  }

  const handleChooseFile = () => {
    inputRef.current?.click()
  }

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleReset()
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive [&>svg]:text-destructive">
          <X className="h-4 w-4" />
          <AlertTitle>{t.error.uploadFailed || "Error"}</AlertTitle>
          <AlertDescription className="mt-2 flex items-center justify-between gap-2">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="-my-2 h-8 px-3 hover:bg-destructive/20 hover:text-destructive"
            >
              {t.tryAgain}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Success State */}
      {result && (
        <Alert className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20">
          <Check className="h-4 w-4" />
          <AlertTitle>{t.uploadSuccessful}</AlertTitle>
          <AlertDescription className="mt-2 space-y-3">
            {showUploadedUrl && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground/70">{t.uploadedUrl}</label>
                <div className="flex gap-2">
                  <Input
                    value={result.secureUrl}
                    readOnly
                    className="flex-1 text-xs h-8"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCopyUrl}
                    title={copied ? t.copied : t.copyUrl}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleUploadAnother}
              disabled={isDeleting}
              className="w-full h-8 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border-emerald-500/20"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                  {t.removeOld}
                </>
              ) : (
                t.uploadAnother
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Type Selector */}
      {showTypeSelector && (
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.fileType}</label>
              <Select
                value={resourceType}
                onValueChange={(value) => setResourceType(value as ResourceType)}
                disabled={isUploading || isDeleting}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.selectFileType} />
                </SelectTrigger>
                <SelectContent>
                  {fileTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
      )}

      {/* Conditional File Input UI */}
      {showDropzone ? (
        /* Image Dropzone UI */
        <FileDropzone
          value={dropzoneValue}
          onFilesChange={handleDropzoneChange}
          maxFiles={1}
          maxSize={maxSize}
          accept={{ "image/*": [] }}
          disabled={isUploading || isDeleting}
          className={cn((isUploading || isDeleting) && "cursor-default")}
          dictionary={dictionary}
        />
      ) : (
        /* Regular File Input UI */
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.file}</label>
            <div className="flex gap-2">
              <div className="flex-1 flex h-9 rounded-md border border-input bg-transparent text-sm">
                <Button
                  type="button"
                  variant={buttonVariant}
                  className="h-full w-28 rounded-e-none border-0 border-e border-input"
                  onClick={handleChooseFile}
                  disabled={isUploading || isDeleting}
                >
                  {buttonLabel === "Choose File" ? t.chooseFile : buttonLabel}
                </Button>
                <div className="flex-1 flex items-center text-muted-foreground px-3">
                  <span className="w-0 flex-1 truncate">
                    {selectedFile?.name ?? (placeholder === "No file chosen" ? t.noFileChosen : placeholder)}
                  </span>
                </div>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading || isDeleting}
              />
            </div>
          </div>

          {/* File Preview for non-image types */}
          {selectedFile && previewUrl && !result && (
            <div className="relative rounded-lg border bg-muted/30 p-3">
              <div className="flex gap-3">
                <div className="shrink-0">
                  <FileThumbnail
                    fileName={selectedFile.name}
                    className="h-16 w-16 text-base"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedFile.type || "Unknown type"}
                  </p>
                </div>
                {!isUploading && !isDeleting && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-6 w-6"
                    onClick={handleReset}
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload Button */}
      <ButtonLoading
        onClick={handleUpload}
        disabled={!selectedFile || isUploading || isDeleting}
        isLoading={isUploading}
        icon={Upload}
        className="w-full"
      >
        {isUploading ? `${t.uploading} ${progress}%` : t.upload}
      </ButtonLoading>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t.uploading}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

    </div>
  )
})

CloudinaryUploader.displayName = "CloudinaryUploader"


