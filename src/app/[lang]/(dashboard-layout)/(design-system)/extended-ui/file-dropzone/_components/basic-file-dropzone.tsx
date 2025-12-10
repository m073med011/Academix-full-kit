import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/ui/file-dropzone"

export function BasicFileDropzone({ dictionary }: { dictionary: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary?.fileDropzonesPage?.basic}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <FileDropzone dictionary={dictionary} />
      </CardContent>
    </Card>
  )
}
