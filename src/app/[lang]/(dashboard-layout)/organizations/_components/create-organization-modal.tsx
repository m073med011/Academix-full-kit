"use client"

import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import type { CloudinaryUploadResult } from "@/app/[lang]/(dashboard-layout)/pages/account/courses/_services/cloudinary-service"

import { Button, ButtonLoading } from "@/components/ui/button"
import { CloudinaryUploader, type CloudinaryUploaderRef } from "@/components/ui/cloudinary-uploader"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { organizationService } from "../_services/organization.service"

const createOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  orgcover: z.string().optional(),
})

type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>

interface CreateOrganizationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  fullDictionary: any // Full dictionary for CloudinaryUploader
  createModal: {
    title: string
    description: string
    name: string
    namePlaceholder: string
    descriptionPlaceholder: string
    orgCover: string
    noImageChosen: string
    chooseImage: string
    cancel: string
    create: string
    creating: string
    success: string
    successDescription: string
    error: string
    errorDescription: string
  }
}

export function CreateOrganizationModal({
  open,
  onOpenChange,
  onSuccess,
  fullDictionary,
  createModal,
}: CreateOrganizationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageProcessing, setIsImageProcessing] = useState(false)
  const uploaderRef = useRef<CloudinaryUploaderRef>(null)

  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
      orgcover: "",
    },
  })

  const handleUploadComplete = (result: CloudinaryUploadResult) => {
    form.setValue("orgcover", result.secureUrl)
  }

  const onSubmit = async (data: CreateOrganizationFormData) => {
    try {
      setIsSubmitting(true)
      const response = await organizationService.createOrganization(data)

      if (response.success) {
        toast.success(createModal.success, {
          description: createModal.successDescription,
        })
        form.reset()
        onOpenChange(false)
        onSuccess() // Refresh organizations list
        // Reset local state if needed
      }
    } catch (error: any) {
      toast.error(createModal.error, {
        description: error.message || createModal.errorDescription,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    // Prevent closing if image is processing
    if (isImageProcessing) return

    if (!isOpen) {
      const currentOrgCover = form.getValues("orgcover")
      // If there's an uploaded image but user is closing without creating, delete it
      if (currentOrgCover) {
         uploaderRef.current?.deleteFile()
            .then(() => {
               form.setValue("orgcover", "")
               onOpenChange(false)
            })
            .catch((err) => {
               console.error("Failed to cleanup image on close:", err)
               // Close anyway? or keep open? User wants "if remove suceded close"
               // If it fails, maybe we should force close or notify.
               // Let's assume on failure we just force close to avoid locking user.
               onOpenChange(false)
            })
         return
      }
    }
    
    onOpenChange(isOpen)
  }

  const isBusy = isSubmitting || isImageProcessing

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px]"
        onInteractOutside={(e) => {
          // If processing, prevent interaction outside
          if (isImageProcessing) {
            e.preventDefault()
          }
        }}
        onEscapeKeyDown={(e) => {
           if (isImageProcessing) {
             e.preventDefault()
           }
        }}
      >
        <DialogHeader>
          <DialogTitle>{createModal.title}</DialogTitle>
          <DialogDescription>{createModal.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Organization Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{createModal.name}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={createModal.namePlaceholder}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{createModal.description}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={createModal.descriptionPlaceholder}
                      className="resize-none"
                      rows={4}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Cover Image */}
            <FormItem>
              <FormLabel>{createModal.orgCover}</FormLabel>
              <CloudinaryUploader
                onUploadComplete={handleUploadComplete}
                accept="image/*"
                showTypeSelector={false}
                defaultResourceType="image"
                showUploadedUrl={false}
                dictionary={fullDictionary}
                placeholder={createModal.noImageChosen}
                buttonLabel={createModal.chooseImage}
                onProcessChange={setIsImageProcessing}
                ref={uploaderRef}
              />
            </FormItem>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isBusy}
              >
                {createModal.cancel}
              </Button>
              <ButtonLoading
                type="submit"
                isLoading={isSubmitting}
                disabled={isBusy}
                icon={Loader2}
              >
                {isSubmitting ? createModal.creating : createModal.create}
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
