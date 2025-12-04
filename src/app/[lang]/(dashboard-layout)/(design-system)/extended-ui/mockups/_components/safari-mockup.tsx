import { Card, CardContent } from "@/components/ui/card"
import { Safari } from "@/components/ui/safari"

export function SafariMockup() {
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle>Safari Mockup</CardTitle>
      </CardHeader> */}
      <CardContent className="grid ">
        <Safari
          imageSrc="/images/misc/hero.png"
          className="h-96 w-full dark:hidden "
          id="safari-1"
        />
        <Safari
          imageSrc="/images/misc/hero-dark.png"
          className="hidden h-96 w-full dark:md:block "
          id="safari-2"
        />
      </CardContent>
    </Card>
  )
}
