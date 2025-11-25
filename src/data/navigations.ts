import type { NavigationType } from "@/types"

export const navigationsData: NavigationType[] = [
  {
    title: "Dashboards",
    items: [
      {
        title: "Analytics",
        href: "/dashboards/analytics",
        iconName: "ChartPie",
      },
      {
        title: "CRM",
        href: "/dashboards/crm",
        iconName: "ChartBar",
      },
      {
        title: "eCommerce",
        href: "/dashboards/ecommerce",
        iconName: "ShoppingCart",
      },
    ],
  },
  {
    title: "Apps",
    items: [
      {
        title: "Email",
        href: "/apps/email",
        iconName: "AtSign",
      },
      {
        title: "Chat",
        href: "/apps/chat",
        iconName: "MessageCircle",
      },
      {
        title: "Calendar",
        href: "/apps/calendar",
        iconName: "Calendar",
      },
      {
        title: "Kanban",
        href: "/apps/kanban",
        iconName: "Grid2x2",
      },
      {
        title: "Todo",
        href: "#",
        label: "Soon",
        iconName: "ListTodo",
      },
    ],
  },
  // public pages {store}
  {
    title: "Public",
    items: [
      {
        title: "Store",
        href: "/public/store",
        iconName: "ShoppingCart",
      },
    ],
  },
]
