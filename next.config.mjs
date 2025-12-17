import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests from local network devices in development
  allowedDevOrigins: ["192.168.100.2"],

  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  typedRoutes: false,

  // See https://lucide.dev/guide/packages/lucide-react#nextjs-example
  transpilePackages: ["lucide-react"],

  // Configure allowed image domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // See https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs
  async redirects() {
    return [
      // ⚠️ Important:
      // Always list more specific static paths before dynamic ones like "/:lang"
      // to prevent Next.js from incorrectly matching static routes as dynamic parameters.
      // For example, if "/:lang" comes before "/docs", Next.js may treat "docs" as a language.
      {
        source: "/docs",
        destination: "/docs/overview/introduction",
        permanent: true,
      },
      // {
      //   source: "/:lang",
      //   destination: process.env.HOME_PATHNAME,
      //   permanent: true,
      //   has: [
      //     {
      //       type: "cookie",
      //       key: "next-auth.session-token",
      //     },
      //   ],
      // },
      // {
      //   source: "/:lang",
      //   destination: process.env.HOME_PATHNAME,
      //   permanent: true,
      //   has: [
      //     {
      //       type: "cookie",
      //       key: "__Secure-next-auth.session-token",
      //     },
      //   ],
      // },
      {
        source: "/:lang/apps/email",
        destination: "/:lang/apps/email/inbox",
        permanent: true,
      },
    ]
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
