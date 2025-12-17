import Image from "next/image"

import { Card } from "@/components/ui/card"

export function NodesShapesUI() {
  return (
    <section className="container block md:hidden">
      <Card>
        <Image
          src="/images/illustrations/misc/whiteboard.svg"
          alt=""
          height={1080}
          width={1080}
          className="h-56 w-full object-cover bg-white overflow-hidden dark:invert"
        />
      </Card>
    </section>
  )
}
