"use client"

import type { DictionaryType } from "@/lib/get-dictionary"

import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudinaryUploader } from "@/components/ui/cloudinary-uploader"

export function CloudinaryUploadDemo({
  dictionary,
}: {
  dictionary: DictionaryType
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloudinary Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <CloudinaryUploader
          showUploadedUrl={true}
          dictionary={dictionary}
          onUploadComplete={(result) => {
            toast({
              title: "Upload Successful",
              description: `File uploaded to: ${result.secureUrl}`,
            })
          }}
          onError={(error) => {
            toast({
              variant: "destructive",
              title: "Upload Failed",
              description: error,
            })
          }}
        />
      </CardContent>
    </Card>
  )
}
