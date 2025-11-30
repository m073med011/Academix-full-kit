import { useEffect, useRef } from "react"

export function useScrollDrag<T extends HTMLElement>(
  ref: React.RefObject<T | null>
) {
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  useEffect(() => {
    const slider = ref.current
    if (!slider) return

    const handleMouseDown = (e: MouseEvent) => {
      isDown.current = true
      slider.classList.add("active")
      startX.current = e.pageX - slider.offsetLeft
      scrollLeft.current = slider.scrollLeft
    }

    const handleMouseLeave = () => {
      isDown.current = false
      slider.classList.remove("active")
    }

    const handleMouseUp = () => {
      isDown.current = false
      slider.classList.remove("active")
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown.current) return
      e.preventDefault()
      const x = e.pageX - slider.offsetLeft
      const walk = (x - startX.current) * 2 // scroll-fast
      slider.scrollLeft = scrollLeft.current - walk
    }

    slider.addEventListener("mousedown", handleMouseDown)
    slider.addEventListener("mouseleave", handleMouseLeave)
    slider.addEventListener("mouseup", handleMouseUp)
    slider.addEventListener("mousemove", handleMouseMove)

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown)
      slider.removeEventListener("mouseleave", handleMouseLeave)
      slider.removeEventListener("mouseup", handleMouseUp)
      slider.removeEventListener("mousemove", handleMouseMove)
    }
  }, [ref])
}
