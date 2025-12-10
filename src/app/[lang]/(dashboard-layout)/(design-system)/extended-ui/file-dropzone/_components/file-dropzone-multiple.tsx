"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/ui/file-dropzone"

export function FileDropzoneMultiple({ dictionary }: { dictionary: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary?.fileDropzonesPage?.multiple}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <FileDropzone multiple dictionary={dictionary} />
      </CardContent>
    </Card>
  )
}
