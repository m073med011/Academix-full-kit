"use client"

import { formatFileSize } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileDropzone } from "@/components/ui/file-dropzone"

export function FileDropzoneMaxSize({ dictionary }: { dictionary: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary?.fileDropzonesPage?.maxSize?.title}</CardTitle>
        <CardDescription>
          {dictionary?.fileDropzonesPage?.maxSize?.description.replace(
            "{size}",
            formatFileSize(250000)
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <FileDropzone multiple maxSize={250000} dictionary={dictionary} />
      </CardContent>
    </Card>
  )
}
