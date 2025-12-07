import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { getDictionary } from "@/lib/get-dictionary"

import { BasicInputFile } from "./_components/basic-input-file"
import { CloudinaryUploadDemo } from "./_components/cloudinary-upload-demo"
import { InputFileButtonLabel } from "./_components/input-file-button-label"
import { InputFileButtonVariants } from "./_components/input-file-button-varaints"
import { InputFilePlaceholder } from "./_components/input-file-placeholder"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "Input File",
}

export default async function InputFilePage({
  params,
}: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <section className="container grid gap-4 p-4 md:grid-cols-2">
      <div className="grid gap-4">
        <BasicInputFile />
        <InputFileButtonLabel />
        <InputFilePlaceholder />
      </div>
      <div className="grid gap-4">
        <InputFileButtonVariants />
        <CloudinaryUploadDemo dictionary={dictionary} />
      </div>
    </section>
  )
}
