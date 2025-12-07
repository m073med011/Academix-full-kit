"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { Check, Copy, Loader2, Upload, UploadCloud, X } from "lucide-react"

import type {
  CloudinaryUploadResult,
  ResourceType,
} from "@/services/cloudinary-service"
import type { ComponentProps } from "react"

import { cn, formatFileSize } from "@/lib/utils"
import type { DictionaryType } from "@/lib/get-dictionary"

import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"
import { Button, ButtonLoading } from "@/components/ui/button"
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
  onError?: (error: string) => void
  accept?: string
  maxSize?: number // in bytes
  className?: string
  placeholder?: string
  buttonLabel?: string
  buttonVariant?: ComponentProps<typeof Button>["variant"]
  showTypeSelector?: boolean
  defaultResourceType?: ResourceType
  showUploadedUrl?: boolean // Show URL input after upload (default: false)
  dictionary?: DictionaryType
}

const getFileTypeOptions = (t: DictionaryType["cloudinary"]) => [
  { value: "auto" as ResourceType, label: t.autoDetect },
  { value: "image" as ResourceType, label: t.image },
  { value: "video" as ResourceType, label: t.video },
  { value: "raw" as ResourceType, label: t.document },
]

export function CloudinaryUploader({
  onUploadComplete,
  onError,
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
}: CloudinaryUploaderProps) {
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

  // Check if we should show the dropzone UI (for images)
  const showDropzone = resourceType === "image"

  // Default English dictionary fallback
  const defaultDict: DictionaryType["cloudinary"] = {
    upload: "Upload",
    uploading: "Uploading...",
    uploadAnother: "Upload Another File",
    removeOld: "Removing old file...",
    fileType: "File Type",
    selectFileType: "Select file type",
    autoDetect: "Auto Detect",
    image: "Image",
    video: "Video",
    document: "Document/Other",
    dragDropImage: "Drag and drop an image here, or click to select",
    supports: "Supports: JPG, PNG, GIF, WebP, SVG",
    file: "File",
    chooseFile: "Choose File",
    noFileChosen: "No file chosen",
    tryAgain: "Try Again",
    uploadSuccessful: "Upload successful!",
    uploadedUrl: "Uploaded URL",
    copyUrl: "Copy URL",
    copied: "Copied!",
    error: {
      fileSize: "File size exceeds maximum allowed ({size})",
      uploadFailed: "Upload failed",
      deleteFailed: "Failed to delete old file from Cloudinary",
    },
  }

  const t = dictionary?.cloudinary || defaultDict
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

  // Dropzone callback for image upload
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0])
      }
    },
    [processFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: isUploading || !!selectedFile,
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
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
      {/* Type Selector */}
      {showTypeSelector && (
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.fileType}</label>
              <Select
                value={resourceType}
                onValueChange={(value) => setResourceType(value as ResourceType)}
                disabled={isUploading}
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
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground cursor-pointer transition-colors hover:border-primary hover:bg-muted/50 min-h-48",
            isDragActive && "border-primary bg-muted/50",
            (isUploading || selectedFile) && "cursor-default",
            selectedFile && "border-solid border-border"
          )}
        >
          <input {...getInputProps()} />

          {selectedFile && previewUrl ? (
            /* Image Preview */
            <div className="w-full p-4">
              <div className="relative flex flex-col items-center gap-3">
                <div className="relative h-32 w-32 rounded-md overflow-hidden border bg-background">
                  <Image
                    src={previewUrl}
                    alt={selectedFile.name}
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  )}
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                {!isUploading && !result && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute end-0 top-0 h-6 w-6"
                    onClick={handleRemoveFile}
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Dropzone Empty State */
            <div className="flex flex-col justify-center items-center gap-2 text-center p-6">
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t.dragDropImage}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.supports}
              </p>
            </div>
          )}
        </div>
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
                  disabled={isUploading}
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
                disabled={isUploading}
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
                {!isUploading && (
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
        disabled={!selectedFile || isUploading}
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

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          <X className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="ms-auto"
          >
            {t.tryAgain}
          </Button>
        </div>
      )}

      {/* Success State */}
      {result && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 rounded-md bg-primary/10 text-primary text-sm">
            <Check className="h-4 w-4 shrink-0" />
            <span>{t.uploadSuccessful}</span>
          </div>
          {showUploadedUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.uploadedUrl}</label>
              <div className="flex gap-2">
                <Input
                  value={result.secureUrl}
                  readOnly
                  className="flex-1 text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  title={copied ? t.copied : t.copyUrl}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
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
            className="w-full"
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
        </div>
      )}
    </div>
  )
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
