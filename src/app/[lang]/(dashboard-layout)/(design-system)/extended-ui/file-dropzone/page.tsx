import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { getDictionary } from "@/lib/get-dictionary"

import { BasicFileDropzone } from "./_components/basic-file-dropzone"
import { FileDropzoneMaxFiles } from "./_components/file-dropzone-max-files"
import { FileDropzoneMaxSize } from "./_components/file-dropzone-max-size"
import { FileDropzoneMultiple } from "./_components/file-dropzone-multiple"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "File Dropzone",
}

export default async function FileDropzonePage({
  params,
}: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await params
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
