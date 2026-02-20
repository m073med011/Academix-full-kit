"use client"

import { useState } from "react"
import { ClipboardList, Download, ExternalLink, FileText, HelpCircle, Lock, Play, Video } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { Course, Material } from "@/types/api"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CourseCurriculumTabProps {
  dictionary: DictionaryType
  course: Course
  hasAccess?: boolean
}

export function CourseCurriculumTab({
  dictionary,
  course,
  hasAccess = false,
}: CourseCurriculumTabProps) {
  const t = dictionary.courseDetailsPage?.curriculum
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  )

  // Calculate total lessons/items
  const totalItems =
    course.modules?.reduce(
      (acc, module) => acc + (module.items?.length || 0),
      0
    ) || 0

  const handleMaterialClick = (material: Material) => {
    if (hasAccess || material.isFreePreview) {
      setSelectedMaterial(material)
    }
  }

  const canAccessMaterial = (material: Material) => {
    return hasAccess || material.isFreePreview
  }

  return (
    <>
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">
            {t?.title || "Course Content"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {course.modules?.length || 0} {t?.sections || "sections"} •{" "}
            {totalItems} {t?.lessons || "lessons"} • {course.duration}{" "}
            {t?.totalLength || "hours total length"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {course.modules?.map((module, index) => (
              <div
                key={module._id || index}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    {t?.sectionPrefix || "Section"} {index + 1}: {module.title}
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {module.items?.length || 0} {t?.lessons || "lessons"}
                  </span>
                </div>
                <div className="space-y-2">
                  {module.items?.map((item: any, itemIndex) => {
                    const material = item.materialId as Material
                    const isAccessible = canAccessMaterial(material)

                    return (
                      <div
                        key={item._id || itemIndex}
                        className={`flex items-center gap-3 text-sm p-2 rounded-md transition-colors ${
                          isAccessible
                            ? "hover:bg-muted/50 cursor-pointer"
                            : "opacity-60"
                        }`}
                        onClick={() =>
                          isAccessible && handleMaterialClick(material)
                        }
                      >
                        {material?.type === "video" ? (
                          <Video className="h-4 w-4 text-primary" />
                        ) : material?.type === "link" ? (
                          <ExternalLink className="h-4 w-4 text-primary" />
                        ) : material?.type === "assignment" ? (
                          <ClipboardList className="h-4 w-4 text-primary" />
                        ) : material?.type === "quiz" ? (
                          <HelpCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                        <span className="flex-1">
                          {material?.title || "Untitled Lesson"}
                        </span>

                        {/* Show badges for free preview or locked content */}
                        {material?.isFreePreview && !hasAccess && (
                          <Badge variant="secondary" className="text-xs">
                            Free Preview
                          </Badge>
                        )}

                        {!isAccessible && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}

                        {isAccessible && material?.type === "video" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}

                        <span className="text-muted-foreground">
                          {material?.duration
                            ? `${material.duration} min`
                            : material?.type === "assignment" || material?.type === "quiz"
                            ? "" 
                            : t?.reading || "Reading"}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {(!course.modules || course.modules.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No curriculum content available yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Material Preview Dialog */}
      <Dialog
        open={!!selectedMaterial}
        onOpenChange={() => setSelectedMaterial(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Material Description */}
            {selectedMaterial?.description && (
              <p className="text-muted-foreground">
                {selectedMaterial.description}
              </p>
            )}

            {/* Video Player */}
            {selectedMaterial?.type === "video" && selectedMaterial?.url && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={selectedMaterial.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              </div>
            )}

            {/* PDF/Document Link */}
            {selectedMaterial?.type === "pdf" && selectedMaterial?.url && (
              <div className="flex flex-col gap-4">
                <iframe
                  src={selectedMaterial.url}
                  className="w-full h-[60vh] rounded-lg border"
                  title={selectedMaterial.title}
                />
                <Button asChild variant="outline">
                  <a
                    href={selectedMaterial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in new tab
                  </a>
                </Button>
              </div>
            )}

            {/* External Link */}
            {selectedMaterial?.type === "link" && selectedMaterial?.url && (
              <Button asChild>
                <a
                  href={selectedMaterial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </a>
              </Button>
            )}

            {/* Text Content */}
            {selectedMaterial?.type === "text" && selectedMaterial?.content && (
              <div className="space-y-4">
                 {/* Check if content is a URL (File Mode) */}
                 {selectedMaterial.content.startsWith("http") ? (
                    <div className="flex flex-col gap-4 items-center justify-center p-8 border rounded-lg bg-muted/20">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                      <div className="text-center space-y-2">
                        <h4 className="font-semibold text-lg">Lesson Material</h4>
                        <p className="text-sm text-muted-foreground">
                          This lesson contains a downloadable file.
                        </p>
                      </div>
                      <Button asChild>
                        <a href={selectedMaterial.content} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download / View File
                        </a>
                      </Button>
                    </div>
                 ) : (
                   <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedMaterial.content }}
                    />
                  </div>
                 )}
              </div>
            )}

            {/* Assignment Display */}
            {selectedMaterial?.type === "assignment" && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                   <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Assignment Details</h4>
                      <Badge>{selectedMaterial.points} Points</Badge>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
                      {selectedMaterial.dueDate && (
                         <div>Due Date: {new Date(selectedMaterial.dueDate).toLocaleDateString()}</div>
                      )}
                      {selectedMaterial.duration && (
                         <div>Duration: {selectedMaterial.duration} mins</div>
                      )}
                      <div>Allow Late: {selectedMaterial.allowLate ? "Yes" : "No"}</div>
                      <div>
                        Submissions: {selectedMaterial.submissionTypes?.join(", ") || "File"}
                      </div>
                   </div>

                   <p className="text-sm">{selectedMaterial.description}</p>
                </div>

                {selectedMaterial.assignmentFileUrl && (
                  <Button asChild variant="outline" className="w-full">
                     <a href={selectedMaterial.assignmentFileUrl} target="_blank" rel="noopener noreferrer">
                       <Download className="mr-2 h-4 w-4" />
                       Download Assignment Resource
                     </a>
                  </Button>
                )}
                 
                 {/* Files allowed for download generally */}
                  {selectedMaterial.allowDownloads && selectedMaterial.url && (
                     <Button asChild variant="secondary" className="w-full">
                     <a href={selectedMaterial.url} target="_blank" rel="noopener noreferrer">
                       <Download className="mr-2 h-4 w-4" />
                       Download Additional Material
                     </a>
                  </Button>
                  )}
              </div>
            )}

            {/* Quiz Display */}
            {selectedMaterial?.type === "quiz" && (
              <div className="space-y-4">
                 <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="font-semibold">Quiz Details</h4>
                       <Badge variant="outline">{selectedMaterial.quizQuestions?.length || 0} Questions</Badge>
                    </div>
                     <p className="text-sm text-muted-foreground mb-2">
                      {selectedMaterial.description}
                    </p>
                 </div>

                 {/* Preview Questions */}
                 <div className="space-y-4">
                    {selectedMaterial.quizQuestions?.map((q, i) => (
                      <div key={i} className="border rounded-lg p-4">
                         <p className="font-medium mb-3">Q{i + 1}: {q.text}</p>
                         <div className="space-y-2">
                           {q.options.map((opt, optIndex) => (
                             <div key={optIndex} className="text-sm p-2 rounded border bg-card">
                                {opt}
                             </div>
                           ))}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
