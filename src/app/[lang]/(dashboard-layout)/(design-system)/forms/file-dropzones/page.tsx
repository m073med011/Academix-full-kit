import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { getDictionary } from "@/lib/get-dictionary"

import { BasicFileDropzone } from "../../extended-ui/file-dropzone/_components/basic-file-dropzone"
import { FileDropzoneMaxFiles } from "../../extended-ui/file-dropzone/_components/file-dropzone-max-files"
import { FileDropzoneMaxSize } from "../../extended-ui/file-dropzone/_components/file-dropzone-max-size"
import { FileDropzoneMultiple } from "../../extended-ui/file-dropzone/_components/file-dropzone-multiple"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "File Dropzones",
}

export default async function FileDropzonesPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await props.params
  const dictionary = await getDictionary(lang)

  return (
    <section className="container grid gap-4 p-4 md:grid-cols-2">
      <BasicFileDropzone dictionary={dictionary} />
      <FileDropzoneMultiple dictionary={dictionary} />
      <FileDropzoneMaxFiles dictionary={dictionary} />
      <FileDropzoneMaxSize dictionary={dictionary} />
    </section>
  )
}
