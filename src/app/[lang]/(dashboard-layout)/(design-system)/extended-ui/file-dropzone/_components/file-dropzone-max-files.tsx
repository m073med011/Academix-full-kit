"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileDropzone } from "@/components/ui/file-dropzone"

export function FileDropzoneMaxFiles({ dictionary }: { dictionary: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary?.fileDropzonesPage?.maxFiles?.title}</CardTitle>
        <CardDescription>
          {dictionary?.fileDropzonesPage?.maxFiles?.description.replace(
            "{count}",
            "2"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <FileDropzone multiple maxFiles={2} dictionary={dictionary} />
      </CardContent>
    </Card>
  )
}
