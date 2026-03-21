import { Inter } from "next/font/google"
import { Metadata, Viewport } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffbeb" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://lankanbook.vercel.app"),
  title: {
    default: "LankanBook",
    template: "%s · LankanBook",
  },
  description:
    "A community-driven platform documenting establishments in Sri Lanka that discriminate against local residents. Browse reports, submit testimonies, and verify authenticity.",
  keywords: [
    "Sri Lanka",
    "discrimination",
    "establishments",
    "community reports",
    "accountability",
    "human rights",
    "tourism",
    "local residents",
  ],
  authors: [{ name: "LankanBook Community" }],
  creator: "LankanBook Community",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lankanbook.vercel.app",
    siteName: "LankanBook",
    title: "LankanBook",
    description:
      "Documenting establishments that discriminate against Sri Lankan residents.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LankanBook",
    description:
      "Documenting establishments that discriminate against Sri Lankan residents.",
    creator: "@lankanbook",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", inter.variable, "font-sans")}
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
