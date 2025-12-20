"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { title } from "process"

// SVG Icon Components - Learning Platform Features (Colorful & Realistic)
const IconKanban = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="kanban-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="7" height="18" rx="2" fill="url(#kanban-grad)"/>
    <rect x="14" y="3" width="7" height="12" rx="2" fill="#f093fb"/>
    <rect x="4.5" y="6" width="4" height="2" rx="0.5" fill="white" opacity="0.8"/>
    <rect x="4.5" y="10" width="4" height="2" rx="0.5" fill="white" opacity="0.6"/>
    <rect x="15.5" y="6" width="4" height="2" rx="0.5" fill="white" opacity="0.8"/>
  </svg>
);

const IconChat = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" fill="url(#chat-grad)"/>
    <line x1="7" y1="8" x2="17" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
    <line x1="7" y1="12" x2="14" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

const IconTodo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="todo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#43e97b" />
        <stop offset="100%" stopColor="#38f9d7" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#todo-grad)"/>
    <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconTasks = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tasks-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fa709a" />
        <stop offset="100%" stopColor="#fee140" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="url(#tasks-grad)"/>
    <line x1="8" y1="10" x2="16" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
    <line x1="8" y1="14" x2="13" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <circle cx="8" cy="10" r="1.2" fill="white"/>
    <circle cx="8" cy="14" r="1.2" fill="white"/>
  </svg>
);

const IconCourses = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="courses-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#f5576c" />
      </linearGradient>
    </defs>
    <path d="M6.5 3H20V21H6.5C5.83696 21 5.20107 20.7366 4.73223 20.2678C4.26339 19.7989 4 19.163 4 18.5V5.5C4 4.83696 4.26339 4.20107 4.73223 3.73223C5.20107 3.26339 5.83696 3 6.5 3Z" fill="url(#courses-grad)"/>
    <line x1="9" y1="8" x2="17" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
    <line x1="9" y1="12" x2="15" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="9" y1="16" x2="16" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const IconCalendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="calendar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fccb90" />
        <stop offset="100%" stopColor="#d57eeb" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="18" rx="2" fill="url(#calendar-grad)"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="#d57eeb" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="#d57eeb" strokeWidth="2" strokeLinecap="round"/>
    <rect x="3" y="10" width="18" height="2" fill="white" opacity="0.3"/>
    <rect x="7" y="14" width="3" height="3" rx="0.5" fill="white" opacity="0.9"/>
  </svg>
);

const IconVideo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="video-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fa709a" />
        <stop offset="100%" stopColor="#ff6a00" />
      </linearGradient>
    </defs>
    <rect x="2" y="5" width="20" height="14" rx="2" fill="url(#video-grad)"/>
    <path d="M10 9L15 12L10 15V9Z" fill="white"/>
  </svg>
);

const IconQuiz = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="quiz-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#30cfd0" />
        <stop offset="100%" stopColor="#330867" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="9" fill="url(#quiz-grad)"/>
    <path d="M12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1.2" fill="white"/>
  </svg>
);

const IconCertificate = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cert-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd89b" />
        <stop offset="100%" stopColor="#19547b" />
      </linearGradient>
    </defs>
    <rect x="3" y="5" width="18" height="14" rx="2" fill="url(#cert-grad)"/>
    <path d="M16 19L14 22L12 20L10 22L8 19" stroke="#19547b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#ffd89b"/>
    <circle cx="12" cy="12" r="2.5" fill="white" opacity="0.9"/>
    <path d="M7 8H10M14 8H17M7 16H10M14 16H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

const IconStudents = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="students-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8edea" />
        <stop offset="100%" stopColor="#fed6e3" />
      </linearGradient>
    </defs>
    <circle cx="9" cy="7" r="4" fill="#fed6e3"/>
    <path d="M3 21V19C3 16.7909 4.79086 15 7 15H11C13.2091 15 15 16.7909 15 19V21" fill="url(#students-grad)"/>
    <circle cx="17" cy="7" r="3" fill="#a8edea"/>
    <path d="M21 21V19.5C21 17.567 19.433 16 17.5 16H17" fill="#a8edea" opacity="0.7"/>
  </svg>
);

const IconAnalytics = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="analytics-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ba360" />
        <stop offset="100%" stopColor="#3cba92" />
      </linearGradient>
    </defs>
    <path d="M3 3V21H21" stroke="url(#analytics-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 16L11 12L15 16L21 8" stroke="url(#analytics-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="16" r="2.5" fill="#0ba360"/>
    <circle cx="11" cy="12" r="2.5" fill="#1db876"/>
    <circle cx="15" cy="16" r="2.5" fill="#2ac784"/>
    <circle cx="21" cy="8" r="2.5" fill="#3cba92"/>
  </svg>
);

// Default icon configuration for learning platform (10 essential icons, 5 visible on mobile)
export const defaultHeroIcons: FloatingIconsHeroProps['icons'] = [
  { id: 1, icon: IconKanban, className: 'top-[10%] left-[10%]' },
  { id: 2, icon: IconChat, className: 'top-[15%] right-[10%]' },
  { id: 3, icon: IconTodo, className: 'top-[70%] left-[8%] hidden md:block' },
  { id: 4, icon: IconCourses, className: 'top-[8%] left-[45%]' },
  { id: 5, icon: IconCalendar, className: 'top-[12%] right-[35%] hidden md:block' },
  { id: 6, icon: IconVideo, className: 'bottom-[15%] left-[30%]' },
  { id: 7, icon: IconQuiz, className: 'top-[45%] left-[5%] hidden md:block' },
  { id: 8, icon: IconCertificate, className: 'top-[65%] right-[20%]' },
  { id: 9, icon: IconStudents, className: 'bottom-[12%] right-[10%] hidden md:block' },
  { id: 10, icon: IconAnalytics, className: 'top-[50%] right-[8%] hidden md:block' },
];

// Interface for the props of each individual icon.
interface IconProps {
  id: number
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  className: string // Used for custom positioning of the icon.
}

// Interface for the main hero component's props.
export interface FloatingIconsHeroProps {
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  icons: IconProps[]
}

// A single icon component with its own motion logic
const Icon = ({
  mouseX,
  mouseY,
  iconData,
  index,
}: {
  mouseX: React.MutableRefObject<number>
  mouseY: React.MutableRefObject<number>
  iconData: IconProps
  index: number
}) => {
  const ref = React.useRef<HTMLDivElement>(null)

  // Motion values for the icon's position, with spring physics for smooth movement
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  React.useEffect(() => {
    const handleMouseMove = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const distance = Math.sqrt(
          Math.pow(mouseX.current - (rect.left + rect.width / 2), 2) +
            Math.pow(mouseY.current - (rect.top + rect.height / 2), 2)
        )

        // If the cursor is close enough, repel the icon
        if (distance < 150) {
          const angle = Math.atan2(
            mouseY.current - (rect.top + rect.height / 2),
            mouseX.current - (rect.left + rect.width / 2)
          )
          // The closer the cursor, the stronger the repulsion
          const force = (1 - distance / 150) * 50
          x.set(-Math.cos(angle) * force)
          y.set(-Math.sin(angle) * force)
        } else {
          // Return to original position when cursor is away
          x.set(0)
          y.set(0)
        }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [x, y, mouseX, mouseY])

  return (
    <motion.div
      ref={ref}
      key={iconData.id}
      style={{
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("absolute", iconData.className)}
    >
      {/* Inner wrapper for the continuous floating animation */}
      <motion.div
        className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 p-3 rounded-3xl shadow-xl bg-card backdrop-blur-md border border-border/10"
        animate={{
          y: [0, -8, 0, 8, 0],
          x: [0, 6, 0, -6, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <iconData.icon className="w-8 h-8 md:w-10 md:h-10 text-foreground" />
      </motion.div>
    </motion.div>
  )
}

const FloatingIconsHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FloatingIconsHeroProps
>(({ className, title, subtitle, ctaText, ctaHref, icons, ...props }, ref) => {
  // Refs to track the raw mouse position
  const mouseX = React.useRef(0)
  const mouseY = React.useRef(0)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseX.current = event.clientX
    mouseY.current = event.clientY
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full h-[100dvh] min-h-[700px] flex items-center justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Container for the background floating icons */}
      <div className="absolute inset-0 w-full h-full">
        {icons.map((iconData, index) => (
          <Icon
            key={iconData.id}
            mouseX={mouseX}
            mouseY={mouseY}
            iconData={iconData}
            index={index}
          />
        ))}
      </div>

      {/* Container for the foreground content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text">
          {title}
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground">
          {subtitle}
        </p>
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="px-8 py-6 text-base font-semibold"
          >
            <a href={ctaHref}>{ctaText}</a>
          </Button>
        </div>
      </div>
    </section>
  )
})

FloatingIconsHero.displayName = "FloatingIconsHero"

export { FloatingIconsHero }
